const db = require('./db');

const bcrypt = require('bcrypt')
const crypto = require('crypto')

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

        return res.redirect('/');
    } catch (error) {
        if (error.errcode === 2067) {
            return res.status(400).send({message: 'User or email already exists'});
        }

        return res.status(400).send({error: error});
    }
}

exports.login = async (req, res) => {
    const {name, password} = req.body;

    if (!name || !password) {
        return res.status(400).send({message: 'Username and password are required'});
    }

    const prepare = db.prepare('SELECT * FROM users WHERE name = ?');
    try {
        const user = prepare.get(name);

        if (!user)
            throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid)
            throw new Error('Password is incorrect');

        await createNewSession(user.id, res);

        delete user.hashed_password;

        return res.send(user);

    } catch (error) {
        return res.status(400).send({error: error.message});
    }
}

exports.verifySession = async (req, res) => {
    const sessionId = req.cookies.sessionId

    if (!sessionId) {
        return res.status(400).send({message: 'Session does not exist'});
    }

    try {
        const stmt = db.prepare('SELECT * FROM sessions WHERE session_id = ?');
        const session = stmt.get(sessionId);
        if (!session)
            throw new Error('No such session');

        return res.send(session);
    } catch (err) {
        return res.status(400).send({message: err.message});
    }
}

async function createNewSession(userId, res) {
    if (!userId) {
        throw new Error("Id is required");
    }

    const sessionId = crypto.randomUUID();

    const maxAge = 1000 * 60 * 60 * 24 * 365;
    const now = Date.now();
    const expiresAt = now + maxAge;

    const stmt = db.prepare(`
        INSERT INTO sessions 
        (session_id, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?)
    `);

    stmt.run(sessionId, userId, now, expiresAt);

    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: maxAge
    });
}