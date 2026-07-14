const app = require("./app")
const port = process.env.PORT || 3002;

app.listen(port, "0.0.0.0", () => {
    console.log(`links service started on port ${port}`);
});