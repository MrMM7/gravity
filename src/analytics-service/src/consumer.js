const amqp = require('amqplib')
const { incrementClick, createNewLink } = require('./controllers')

async function consumeNewAnalytics () {
    const connection = await amqp.connect(process.env.RABBITMQ_URL)

    const channel = await connection.createChannel();

    await channel.assertQueue("analytics.new");

    channel.consume("analytics.new", (msg) => {
        if (!msg) return;

        try {
            const payload = JSON.parse(msg.content.toString());
            createNewLink(payload.shortCode);
        } catch (err) {
            console.error('Failed to process analytics.new message:', err);
        } finally {
            channel.ack(msg);
        }
    })
}

async function consumeClickAnalytics () {
    const connection = await amqp.connect(process.env.RABBITMQ_URL)

    const channel = await connection.createChannel();

    await channel.assertQueue("analytics.click");

    channel.consume("analytics.click", (msg) => {
        if (!msg) return;

        try {
            const payload = JSON.parse(msg.content.toString());
            incrementClick(payload.shortCode);
        } catch (err) {
            console.error('Failed to process analytics.click message:', err);
        } finally {
            channel.ack(msg);
        }
    })
}

module.exports = {
    consumeNewAnalytics,
    consumeClickAnalytics,
};