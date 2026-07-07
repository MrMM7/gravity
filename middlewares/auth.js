const db = require('../utils/db');

function verifySession (req, res, next) {
    const sessionId = req.cookies.sessionId

    if (!sessionId) {
        return res.redirect(302, '/auth');
    }

    try {
        const stmt = db.prepare('SELECT * FROM sessions WHERE session_id = ?');
        const session = stmt.get(sessionId);
        if (!session)
            throw new Error('No such session');

    } catch (_) {
        return res.redirect(302, '/auth');
    }
    return next()
}

module.exports = verifySession