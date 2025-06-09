# BullMq (Queues and Workers)

BullMQ is a high-performance, Redis-based distributed queue system for Node.js, designed for reliability and scalability. It enables efficient job processing with features like prioritization, concurrency control, delayed jobs, repeatable jobs, and automatic retries. BullMQ is optimized for microservices architectures, ensuring exactly-once queue semantics and horizontal scalability by allowing multiple workers to process jobs in parallel. It also supports parent-child dependencies, rate limiting, and telemetry for monitoring job execution.
https://bullmq.io/

## Messaging Patterns Implemented
This demo explores two essential BullMq patterns:
#### Sender and Receiver (Point-to-Point Communication)
- A simple messaging pattern where a sender pushes a message into a queue, and a single receiver consumes it.
- Ideal for scenarios where only one consumer should process a given message.

#### Request and Reply (RPC Pattern)
- A synchronous request-response pattern using BullMq.
- The producer sends a request message, and the consumer processes it and replies via a correlation ID.
- Useful for operations requiring a direct response, such as fetching data from a microservice.

## Roles in the System
BullMq handles two primary roles in messaging:
#### Producer
- Responsible for sending messages to bullMq queues.
- Implements logic to structure data before transmission.
- Examples: API service triggering an event, event publisher.

#### Consumer
- Subscribes to queues and processes incoming messages asynchronously.
- Can acknowledge receipt, ensuring message durability.
- Examples: Background worker processing tasks, microservice reacting to events.

## Installation
#### Install Docker Desktop
- Download and install Docker: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

#### Setup Redis Using Docker
- Run the following commands to start a Redis container:
```bash
docker pull redis
docker run --name my-redis -d -p 6379:6379 redis
```

#### Project Setup
- Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-directory>
``` 
- Setup `util` Service
    - Move into the util solution and create an .env file:
    ```bash
    NODE_ENV=development

    # Redis
    REDIS_HOST = 127.0.0.1
    #Local Docker
    #DB_HOST=host.docker.internal
    #REDIS_USERNAME = username
    #REDIS_PASSWORD = password
    REDIS_DB = 0
    REDIS_PORT = 6379

    ```
    - Install dependencies:
    ```bash
    npm i
    ```
    - Build the utility package:
    ```bash
    npm run build
    ```
    - Link the package:
    ```bash
    npm link
    ```
- Setup `api` Service
    - Move into the api solution and create an .env file:
    ```bash
    NODE_ENV=development
    PORT=3000

    # Logging
    LOG_FORMAT=dev
    LOG_DIR=logs

    # CORS Config
    ORIGIN=*
    CREDENTIALS=true

    # Redis
    REDIS_HOST = 127.0.0.1
    #Local Docker
    #DB_HOST=host.docker.internal
    #REDIS_USERNAME = username
    #REDIS_PASSWORD = password
    REDIS_DB = 0
    REDIS_PORT = 6379

    # Rate Limiter
    RATE_LIMITER=1000
    ```
    - Install dependencies:
    ```bash
    npm i
    ```
    - Link the `util` package:
    ```bash
    npm link <utilurl>
    ```
    - Build the Api service:
    ```bash
    npm run build
    ```
    - Run the API in development mode:
    ```bash
    npm run dev
    ```

