const { randomBytes } = require("crypto");
const db = require("./db");

function generateShortCode(length = 6) {
    return randomBytes(length).toString("base64url")
}

async function generateAnalytics(shortCode) {
    const res = await fetch("http://analytics-service:3004/links", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: shortCode })
    });
    return res.json();
}

async function incrementClickAnalytics(shortCode) {
    const res = await fetch(`http://analytics-service:3004/links/${shortCode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
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
        const analytics = await generateAnalytics(shortCode)

        const newLink = linkStmt.get(shortCode, url)
        res.status(201).send({ ...newLink, analytics });
    } catch (error) {
        res.status(400).send(error)
    }
}