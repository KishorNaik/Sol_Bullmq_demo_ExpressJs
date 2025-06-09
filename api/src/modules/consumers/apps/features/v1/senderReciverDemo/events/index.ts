import { NotificationData, NotificationHandler, notificationHandler } from 'mediatr-ts';
import { SenderReceiverRequestDto } from '../contracts';
import {
	bullMqRedisConnection,
	delay,
	sealed,
	SenderReceiverConsumerBullMq,
} from '@kishornaik/utils';
import { logger } from '@/shared/utils/helpers/loggers';
import { RABBITMQ_URL } from '@/config';
import { mediator } from '@/shared/utils/helpers/medaitR';

const queueName = 'sender-receiver-demo-queue';
const senderReceiverConsumerBullMq = new SenderReceiverConsumerBullMq(bullMqRedisConnection);

export class SenderReceiverIntegrationEventService extends NotificationData {
	private readonly _request: SenderReceiverRequestDto;

	public constructor(request: SenderReceiverRequestDto) {
		super();
		this._request = request;
	}

	public get Request(): SenderReceiverRequestDto {
		return this._request;
	}
}

@sealed
@notificationHandler(SenderReceiverIntegrationEventService)
export class PubSubDemoIntegrationEventServiceHandler
	implements NotificationHandler<SenderReceiverIntegrationEventService>
{
	public async handle(notification: SenderReceiverIntegrationEventService): Promise<void> {
		logger.info(
			`PubSubDemoIntegrationEventServiceHandler`,
			'handle',
			`Request:${JSON.stringify(notification.Request)}`
		);
	}
}

// Event
export const senderReceiverDemoEventListener = async () => {
	const worker = await senderReceiverConsumerBullMq.startConsumingAsync<SenderReceiverRequestDto>(
		queueName,
		async (message) => {
			console.log(`[App - PubSubConsumer] Received message:`, message.data);
			//await delay(5000);

			await mediator.publish(new SenderReceiverIntegrationEventService(message.data.data));

			//await delay(5000);
			console.log(`[App - PubSubConsumer] Finished processing message.`);
		}
	);

	worker.on('completed', (job) => {
		console.log(`[App - PubSubConsumer] Job completed: ${job.id}`);
	});

	worker.on('failed', (job, err) => {
		console.error(`[App - PubSubConsumer] Job failed: ${job.id}, Error: ${err.message}`);
	});
};
