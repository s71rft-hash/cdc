const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = 3000;

const rabbitmqHost = 'rabbitmq';
const rabbitmqUrl = `amqp://user:password@${rabbitmqHost}:5672`;
const exchange = 'debezium.exchange';
const queue = 'my-queue';
const routingKey = '#'; // Listen to all messages on the exchange

async function start() {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'topic', { durable: true });
        const q = await channel.assertQueue(queue, { exclusive: false });

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);
        channel.bindQueue(q.queue, exchange, routingKey);

        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                console.log(" [x] Received %s", msg.content.toString());
            }
        }, {
            noAck: true
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
        // Retry connection after a delay
        setTimeout(start, 5000);
    }
}

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
    start();
});
