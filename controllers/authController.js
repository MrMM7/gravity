const db = require('../utils/db')
const bcrypt = require('bcrypt')

exports.createNewUser = async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({message: 'Name, email and password are required'});
    }
    const prepare = db.prepare('INSERT INTO users (name, email, hashed_password) VALUES (?,?,?) RETURNING *');

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const inserted = prepare.get(name, email, hashedPassword);

        await createNewSession(inserted.id, res)

        res.redirect('/');
    } catch (error) {
        if (error.errcode === 2067) {
            return res.status(400).send({message: 'User or email already exists'});
        }

        return res.status(400).send({error: error});
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({message: 'Email and password are required'});
    }

    const prepare = db.prepare('SELECT * FROM users WHERE email = ?');
    try {
        const user = prepare.get(email)
        if (!user)
            throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordValid)
            throw new Error('Password is incorrect');

        await createNewSession(user.id, res)

        delete user.hashed_password;
        res.redirect('/');
    } catch (error) {
        return res.status(400).send({error: error});
    }
}

async function createNewSession(userId, res) {
    if (!userId) {
        return res.status(400).send({message: 'Id is required'});
    }

    try {
        const sessionId = crypto.randomUUID();
        const stmt = db.prepare('INSERT INTO sessions (session_id, user_id, created_at, expires_at) VALUES (?,?,?,?)')
        const expiresAt = 1000 * 60 * 60 * 24 * 365 // 365 days
        const now = Date.now();

        stmt.run(sessionId, userId, now, expiresAt);

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresAt
        });
    } catch (error) {
        return res.status(400).send({error: error});
    }
}