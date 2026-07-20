const amqp = require("amqplib");

let channel;

async function initRabbitMQ() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue("analytics.new");
    await channel.assertQueue("analytics.click");
}

function sendClickAnalytics(event) {
    if (!channel) {
        throw new Error("RabbitMQ not initialized.");
    }

    channel.sendToQueue(
        "analytics.click",
        Buffer.from(JSON.stringify(event))
    );
}
function sendGenerateAnalytics(event) {
    if (!channel) {
        throw new Error("RabbitMQ not initialized.");
    }

    channel.sendToQueue(
        "analytics.new",
        Buffer.from(JSON.stringify(event))
    );
}

module.exports = {
    initRabbitMQ,
    sendGenerateAnalytics,
    sendClickAnalytics
};