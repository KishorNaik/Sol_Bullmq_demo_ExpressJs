# BullMq (Queues and Workers)

BullMQ is a high-performance, Redis-based distributed queue system for Node.js, designed for reliability and scalability. It enables efficient job processing with features like prioritization, concurrency control, delayed jobs, repeatable jobs, and automatic retries. BullMQ is optimized for microservices architectures, ensuring exactly-once queue semantics and horizontal scalability by allowing multiple workers to process jobs in parallel. It also supports parent-child dependencies, rate limiting, and telemetry for monitoring job execution.

## Redis setup

### Step 1: Install Docker Desktop

https://www.docker.com/products/docker-desktop/

### Step 2: Pull and Run the Redis Docker Image

- Open a terminal or command prompt.
- Run the following command to pull the Redis Docker image:

```bash
docker pull redis
```

- Run the following command to start a Redis container:

```bash
docker run --name my-redis -d -p 6379:6379 redis
```

- --name my-redis: Names the container my-redis.

- -d: Runs the container in detached mode (in the background).

- -p 6379:6379: Maps port 6379 on your local machine to port 6379 in the container (Redis's default port)

- Verify that the Redis container is running by running the following command:

```bash
docker ps
```

## .env file

- Create a .env file in the root directory of your project and add the following environment variables:

```bash
# PORT
PORT = 3000

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true

# Database
DB_HOST = localhost
#Local Docker
#DB_HOST=host.docker.internal
DB_PORT = 5432
DB_USERNAME = postgres
DB_PASSWORD = YOUR_DB_PASSWORD
DB_DATABASE = todo

# Redis
REDIS_HOST = 127.0.0.1
REDIS_DB = 0
REDIS_PORT = 6379

#AES
ENCRYPTION_KEY=RWw5eic0WzjW0i0T2ZTShcYu44fRI5M6
```
