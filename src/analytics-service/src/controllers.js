const db = require("./db");

exports.incrementClick = (id) => {
    // verify the id exists before updating
    const selectStmt = db.prepare("SELECT 1 FROM link_analytics WHERE link_id = ?");
    const row = selectStmt.get(id);

    if (!row) {
        // No analytics row for this link_id
        return null;
    }

    const stmt = db.prepare("UPDATE link_analytics SET clicks = clicks + 1 WHERE link_id = ? RETURNING *");
    return stmt.get(id);
};

exports.trackNewClick = (req, res) => {
    const {id} = req.params;

    try {
        const updated = exports.incrementClick(id);
        if (!updated) {
            return res.status(404).send({message: "Link not found"});
        }
        return res.status(200).send(updated);
    } catch (error) {
        console.error("Error tracking click:", error);
        res.status(500).send({message: "Internal server error"});
    }
};

exports.newLink = (req, res) => {
    const {id} = req.body;
    createNewLink(id)
    res.status(201).send(data);
}

exports.createNewLink = (id) => {
    const selectStmt = db.prepare("SELECT 1 FROM link_analytics WHERE link_id = ?");
    const row = selectStmt.get(id);

    // verify that the row does not already exist
    if (row) return;

    const stmt = db.prepare("INSERT INTO link_analytics (link_id, clicks) VALUES (?, 0) RETURNING *");
    return stmt.get(id);
}

exports.getAnalytics = (req, res) => {
    const {id} = req.params;

    try {
        const stmt = db.prepare("SELECT * FROM link_analytics WHERE link_id = ?");
        const data = stmt.get(id);

        if (!data) {
            return res.status(404).send({message: "Link not found"});
        }
        return res.status(200).send(data);
    } catch (error) {
        console.error("Error creating link:", error);
        res.status(500).send({message: "Internal server error"});
    }
}