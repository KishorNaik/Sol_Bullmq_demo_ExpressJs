import { Processor, Queue, Worker, ConnectionOptions, QueueEvents } from 'bullmq';
import { getIORedisConnection } from '../../redis';

export const bullMqRedisConnection = getIORedisConnection();

export const setQueues = (name: string, connection: ConnectionOptions = bullMqRedisConnection) => {
	return new Queue(name, {
		connection: connection,
	});
};

export const setQueueEvents = (
	name: string,
	connection: ConnectionOptions = bullMqRedisConnection
) => {
	return new QueueEvents(name, {
		connection: connection,
	});
};

export const publishQueuesAsync = <T extends Object>(
	queue: Queue<any, any, string, any, any, string>,
	jobName: string,
	data: T
) => {
	return queue.add(jobName, data as T, {
		removeOnComplete: true,
		removeOnFail: true,
		attempts: 3,
	});
};

export const runWorkers = (
	queueName: string,
	queueJob: string | URL | Processor<any, any, string>,
	connection: ConnectionOptions = bullMqRedisConnection
) => {
	return new Worker(queueName, queueJob, { connection: connection, removeOnFail: { count: 0 } });
};
