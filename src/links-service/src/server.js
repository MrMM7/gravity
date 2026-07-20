const port = process.env.PORT || 3002;
const {initRabbitMQ} = require("./producer")

async function start() {
    await initRabbitMQ();
    const app = require("./app")

    app.listen(port, "0.0.0.0", () => {
        console.log(`links service started on port ${port}`);
    });
}

start();