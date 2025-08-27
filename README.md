# CDC Example: Debezium Server, PostgreSQL, RabbitMQ, and Express.js

This project demonstrates a simplified Change Data Capture (CDC) pipeline using Debezium Server to stream changes directly from a database to a message broker.

*   **PostgreSQL**: The source database where changes are captured.
*   **Debezium Server**: A standalone application that captures row-level changes in PostgreSQL and sends them directly to a message broker.
*   **RabbitMQ**: The message queue where change events are routed for consumption by downstream services.
*   **Express.js**: A simple Node.js application that consumes the change events from RabbitMQ and logs them.

The entire stack is orchestrated using Docker Compose, making it easy to set up and run. This example showcases a Kafka-less Debezium setup.

## How it works

1.  **Database Changes**: Any `INSERT`, `UPDATE`, or `DELETE` operation on the `products` table in the PostgreSQL database is captured by Debezium.
2.  **Debezium Server**: The Debezium Server is configured to watch the PostgreSQL database. It captures these changes through PostgreSQL's logical decoding feature.
3.  **RabbitMQ Sink**: Debezium Server sends the change events directly to a RabbitMQ exchange (`debezium.exchange`) using its built-in RabbitMQ sink.
4.  **Express.js Consumer**: The Express.js application is connected to a queue bound to the RabbitMQ exchange. It receives the change event messages and logs them to the console.

## Prerequisites

*   Docker
*   Docker Compose

## How to run

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Start the services**:
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker image for the `express-app` service and start all the containers.

3.  **Check the logs**:
    You can check the logs of each service to see what's happening:
    *   `docker-compose logs -f postgres`
    *   `docker-compose logs -f debezium-server`
    *   `docker-compose logs -f rabbitmq`
    *   `docker-compose logs -f express-app`

    You should see the `express-app` logging the initial records from the `products` table.

## Test the CDC pipeline

To see the CDC pipeline in action, you can make changes to the `products` table in the PostgreSQL database.

1.  **Connect to the PostgreSQL database**:
    You can use any PostgreSQL client to connect to the database, or you can use `docker-exec`:
    ```bash
    docker-compose exec -it postgres psql -U user -d mydb
    ```

2.  **Insert a new product**:
    ```sql
    INSERT INTO products (name, price) VALUES ('Monitor', 300.00);
    ```

3.  **Update a product**:
    ```sql
    UPDATE products SET price = 1150.00 WHERE name = 'Laptop';
    ```

4.  **Delete a product**:
    ```sql
    DELETE FROM products WHERE name = 'Mouse';
    ```

5.  **Check the `express-app` logs**:
    After each of these operations, you should see a new message in the logs of the `express-app` service, showing the captured change data in JSON format.
    ```bash
    docker-compose logs -f express-app
    ```

## Services

*   **PostgreSQL**: `localhost:5432`
*   **RabbitMQ Management UI**: `http://localhost:15672` (user: `user`, pass: `password`)
*   **Express.js app**: `http://localhost:3000` (no routes, just a log consumer)
*   **Debezium Server**: No external port, but logs can be checked with `docker-compose logs -f debezium-server`.
