import {
	NotificationData,
	notificationHandler,
	RequestData,
	requestHandler,
	RequestHandler,
} from 'mediatr-ts';
import {
	bullMqRedisConnection,
	ReplyMessageBullMq,
	RequestReplyConsumerBullMq,
	sealed,
} from '@kishornaik/utils';
import { logger } from '@/shared/utils/helpers/loggers';
import { RABBITMQ_URL } from '@/config';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { RequestReplyRequestDto, RequestReplyResponseDto } from '../contracts';
import {
	DataResponse as ApiDataResponse,
	DataResponse,
	DataResponseFactory,
} from '@kishornaik/utils';
import { StatusCodes } from 'http-status-codes';

const requestQueue = 'my_request_queue';
const consumer = new RequestReplyConsumerBullMq(bullMqRedisConnection);

export class RequestReplyDemoIntegrationEventService extends RequestData<
	ApiDataResponse<RequestReplyResponseDto>
> {
	private readonly _request: RequestReplyRequestDto;

	public constructor(request: RequestReplyRequestDto) {
		super();
		this._request = request;
	}

	public get Request(): RequestReplyRequestDto {
		return this._request;
	}
}

@sealed
@requestHandler(RequestReplyDemoIntegrationEventService)
export class RequestReplyDemoIntegrationEventServiceHandler
	implements
		RequestHandler<
			RequestReplyDemoIntegrationEventService,
			ApiDataResponse<RequestReplyResponseDto>
		>
{
	public async handle(
		value: RequestReplyDemoIntegrationEventService
	): Promise<ApiDataResponse<RequestReplyResponseDto>> {
		logger.info(
			`RequestReplyDemoIntegrationEventServiceHandler`,
			'handle',
			`Request:${JSON.stringify(value.Request)}`
		);

		// Here you can implement your logic to handle the request
		// For example, you can return a response based on the request data
		const response = new RequestReplyResponseDto();
		response.message = `Processed request with data: ${JSON.stringify(value.Request)}`;

		return DataResponseFactory.success(StatusCodes.OK, response, response.message);
	}
}

// Event
export const RequestReplyDemoEventListener = async () => {
	const worker = await consumer.startConsumingAsync<RequestReplyRequestDto, string>(
		requestQueue,
		async (reply) => {
			console.log(`[App - PubSubConsumer] Received message:`, reply.data);
			//await delay(5000);
			const response = await mediator.send(
				new RequestReplyDemoIntegrationEventService(reply.data.data)
			);
			//await delay(5000);
			console.log(`[App - PubSubConsumer] Finished processing message.`);

			const message: ReplyMessageBullMq<string> = {
				correlationId: reply.data.correlationId,
				success: true,
				data: response.Data.message,
				message: `Processed request with data: ${JSON.stringify(reply.data.data)}`,
			};

			return message; // Return a string to satisfy the Processor type
		}
	);

	worker.on('completed', (job) => {
		console.log(`[App - PubSubConsumer] Job completed: ${job.id}`);
	});

	worker.on('failed', (job, err) => {
		console.error(`[App - PubSubConsumer] Job failed: ${job.id}, Error: ${err.message}`);
	});
};
