const { randomBytes } = require("crypto");
const db = require("../utils/db");

exports.getLink = (req, res) => {
    const { shortCode } = req.params;

    try {
        const prepare = db.prepare("SELECT * FROM links WHERE short_code = ?");
        const data = prepare.get(shortCode)
        res.redirect(data.original_url)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.createNewLink = (req, res) => {
    const { originalUrl } = req.body;

    try {
        const shortCode = randomBytes(6).toString("base64url")
        const url = originalUrl.includes("http") ? originalUrl : "https://" + originalUrl
        const prepare = db.prepare("INSERT INTO links (short_code, original_url) VALUES (?, ?)")

        prepare.run(shortCode, url)
        res.send({ shortCode });
    } catch (error) {
        res.status(400).send(error.toJSON())
    }
}