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
	sealed,
	SenderReceiverProducerBullMq,
	SendReceiverMessageBullMq,
} from '@kishornaik/utils';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { SenderReceiverRequestDto, SenderReceiverResponseDto } from '../contracts';
import { Guid } from 'guid-typescript';
import { RABBITMQ_URL } from '@/config';

const queueName = 'sender-receiver-demo-queue';
const senderReceiverProducerBullMq = new SenderReceiverProducerBullMq(bullMqRedisConnection);
senderReceiverProducerBullMq.setQueues(queueName);

@JsonController('/api/v1/senderreceiver')
@OpenAPI({ tags: ['senderreceiver'] })
export class ProducerSenderReceiverController {
	@Post()
	@OpenAPI({ summary: 'Pub Sub Demo', tags: ['senderreceiver'] })
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(SenderReceiverRequestDto))
	public async demoAsync(@Body() request: SenderReceiverRequestDto, @Res() res: Response) {
		const response = await mediator.send(new SenderReceiverCommand(request));
		return res.status(response.StatusCode).json(response);
	}
}

export class SenderReceiverCommand extends RequestData<ApiDataResponse<SenderReceiverResponseDto>> {
	private readonly request: SenderReceiverRequestDto;

	public constructor(request: SenderReceiverRequestDto) {
		super();
		this.request = request;
	}

	public get Request(): SenderReceiverRequestDto {
		return this.request;
	}
}

@sealed
@requestHandler(SenderReceiverCommand)
export class SenderReceiverCommandHandler
	implements RequestHandler<SenderReceiverCommand, DataResponse<SenderReceiverResponseDto>>
{
	public async handle(
		value: SenderReceiverCommand
	): Promise<ApiDataResponse<SenderReceiverResponseDto>> {
		try {
			//@guard
			if (!value) return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `value is null`);

			// Consumer Call
			const pubSubMessage: SendReceiverMessageBullMq<SenderReceiverRequestDto> = {
				data: value.Request,
				correlationId: Guid.create().toString(),
			};
			await senderReceiverProducerBullMq.sendAsync<SenderReceiverRequestDto>(
				`job-send-receiver-demo`,
				pubSubMessage
			);

			const response = new SenderReceiverResponseDto();
			response.message = `User created`;

			return DataResponseFactory.success(StatusCodes.OK, response, response.message);
		} catch (ex) {
			const error = ex as Error;
			return DataResponseFactory.error(StatusCodes.BAD_REQUEST, error.message);
		}
	}
}
