import {
	Body,
	Delete,
	Get,
	HttpCode,
	JsonController,
	OnUndefined,
	Param,
	Post,
	QueryParams,
	Res,
	UseBefore,
} from 'routing-controllers';
import { Response } from 'express';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestData, RequestHandler, requestHandler } from 'mediatr-ts';
import {
	DataResponse as ApiDataResponse,
	DataResponse,
	DataResponseFactory,
	PaginationDataResponseModel,
} from '@/shared/models/response/data.Response';
import mediatR from '@/shared/medaitR/index';
import { StatusCodes } from 'http-status-codes';
import {
	bullMqRedisConnection,
	getReplyAsync,
	publishQueuesAsync,
	setQueueEvents,
	setQueues,
} from '@/shared/utils/helpers/bullMq/queues';
import {
	ReplyDemoRequestDto,
	ReplyDemoResponseDto,
} from '@/modules/consumers/apps/features/v1/replyDemo';
import { QueueEvents } from 'bullmq';

// Set Queues
const replyQueues = setQueues('replyQueues', bullMqRedisConnection);

// Create a QueueEvents instance for the replyQueues
const replyQueueEvents = setQueueEvents(`replyQueues`, bullMqRedisConnection);

// #region Controller
@JsonController('/api/v1/users')
@OpenAPI({ tags: ['users'] })
export class RequestDemoController {
	@Get('')
	@OpenAPI({ summary: 'Request Demo', tags: ['users'] })
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	public async getAsync(@Res() res: Response) {
		// Publish Request
		const jobRequest = new ReplyDemoRequestDto();
		jobRequest.id = 1;

		// Publish:Send an Request Demo(Consumer)
		const job = await publishQueuesAsync(replyQueues, `request-reply-demo`, jobRequest);

		// wait for the job to complete
		const jobResult = await getReplyAsync<ReplyDemoResponseDto>(job, replyQueueEvents);
		console.log(`Job published with ID: ${job.id}`);
		console.log(`Job result: ${JSON.stringify(jobResult)}`);
		console.log(`Job result ID: ${jobResult.id} - Job result Message: ${jobResult.message}`);

		// Response
		const response = DataResponseFactory.Response(
			true,
			StatusCodes.OK,
			jobResult,
			'Get Reply from Producer Modules Successfully'
		);
		return res.status(response.StatusCode).json(response);
	}
}
//endregion
