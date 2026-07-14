const { randomBytes } = require("crypto");
const db = require("./db");

function generateShortCode(length = 6) {
    return randomBytes(length).toString("base64url")
}

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
        const shortCode = generateShortCode()
        const url = originalUrl.includes("http") ? originalUrl : "https://" + originalUrl
        const prepare = db.prepare("INSERT INTO links (short_code, original_url) VALUES (?, ?)")

        prepare.run(shortCode, url)
        res.status(201).send({ shortCode });
    } catch (error) {
        res.status(400).send(error.toJSON())
    }
}