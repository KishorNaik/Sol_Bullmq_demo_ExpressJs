import { StatusCodes } from 'http-status-codes';
import {
	Body,
	Get,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
	Res,
	UseBefore,
} from 'routing-controllers';
import { Response } from 'express';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestData, RequestHandler, requestHandler } from 'mediatr-ts';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
	DataResponse as ApiDataResponse,
	bullMqRedisConnection,
	DataResponse,
	DataResponseFactory,
	ReplyMessageBullMq,
	ReplyMessageRabbitMq,
	RequestReplyMessageBullMq,
	RequestReplyProducerBullMq,
	sealed,
} from '@kishornaik/utils';
import { mediator } from '@/shared/utils/helpers/medaitR';

import { Guid } from 'guid-typescript';
import { RequestReplyRequestDto, RequestReplyResponseDto } from '../contracts';
import { RABBITMQ_URL } from '@/config';

const requestQueue = 'my_request_queue';
const producer = new RequestReplyProducerBullMq(bullMqRedisConnection);
producer.setQueues(requestQueue).setQueueEvents();

@JsonController('/api/v1/requestreply')
@OpenAPI({ tags: ['requestreply'] })
export class ProducerRequestReplyController {
	@Post()
	@OpenAPI({ summary: 'Request Reply Demo', tags: ['requestreply'] })
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(RequestReplyRequestDto))
	public async demoAsync(@Body() request: RequestReplyRequestDto, @Res() res: Response) {
		const response = await mediator.send(new RequestReplyCommand(request));
		return res.status(response.StatusCode).json(response);
	}
}

export class RequestReplyCommand extends RequestData<ApiDataResponse<RequestReplyResponseDto>> {
	private readonly request: RequestReplyRequestDto;

	public constructor(request: RequestReplyRequestDto) {
		super();
		this.request = request;
	}

	public get Request(): RequestReplyRequestDto {
		return this.request;
	}
}

@sealed
@requestHandler(RequestReplyCommand)
export class RequestReplyCommandHandler
	implements RequestHandler<RequestReplyCommand, DataResponse<RequestReplyResponseDto>>
{
	public async handle(
		value: RequestReplyCommand
	): Promise<ApiDataResponse<RequestReplyResponseDto>> {
		try {
			//@guard
			if (!value) return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `value is null`);

			// Consumer Call
			const message: RequestReplyMessageBullMq<RequestReplyRequestDto> = {
				correlationId: Guid.create().toString(),
				data: value.Request,
			};

			const result: ReplyMessageBullMq<string> = await producer.sendAsync<
				RequestReplyRequestDto,
				string
			>(`job-request-reply-demo`, message);
			console.log(`Result from Request Reply:`, JSON.stringify(result));
			console.log(`Result from Request Reply:`, result);

			const response = new RequestReplyResponseDto();
			response.message = `User created`;

			return DataResponseFactory.success(StatusCodes.OK, response, response.message);
		} catch (ex) {
			const error = ex as Error;
			return DataResponseFactory.error(StatusCodes.BAD_REQUEST, error.message);
		}
	}
}
