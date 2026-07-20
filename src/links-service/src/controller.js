const { randomBytes } = require("crypto");
const db = require("./db");
const { sendClickAnalytics, sendGenerateAnalytics } = require("./producer")

function generateShortCode(length = 6) {
    return randomBytes(length).toString("base64url")
}

async function generateAnalytics(shortCode) {
    sendGenerateAnalytics({ shortCode });
    return { message: "Successfully generated analytics" };
}

async function incrementClickAnalytics(shortCode) {
    sendClickAnalytics({ shortCode });
    return { message: "Successfully incremented click analytics" };
}

exports.getLink = async (req, res) => {
    const { shortCode } = req.params;

    try {
        const prepare = db.prepare("SELECT * FROM links WHERE short_code = ?");
        const data = prepare.get(shortCode)

        if (!data) {
            res.status(404).send({ message: "Link not found" });
            return;
        }

        await incrementClickAnalytics(shortCode)

        res.redirect(data.original_url)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.createNewLink = async (req, res) => {
    const { originalUrl } = req.body;

    try {
        const shortCode = generateShortCode()
        const url = originalUrl.includes("http") ? originalUrl : "https://" + originalUrl
        const linkStmt = db.prepare("INSERT INTO links (short_code, original_url) VALUES (?, ?) RETURNING *");

        await generateAnalytics(shortCode)

        const newLink = linkStmt.get(shortCode, url)
        res.status(201).send({ ...newLink });
    } catch (error) {
        res.status(400).send(error)
    }
}