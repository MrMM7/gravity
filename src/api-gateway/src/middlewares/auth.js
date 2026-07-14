async function verifySession(req, res, next) {
    try {
        const response = await fetch("http://auth-service:3001/verify", {
            headers: {
                cookie: req.headers.cookie || ""
            }
        });

        if (!response.ok) {
            return res.redirect("/auth");
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Authentication error");
    }
}

module.exports = verifySession;