import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { StatusCodes } from 'http-status-codes';
import {
	Body,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
	Res,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response } from 'express';
import { CreateUserRequestDto } from '../contracts';
import { logConstruct, logger } from '@/shared/utils/helpers/loggers';
import {
	bullMqRedisConnection,
	publishQueuesAsync,
	setQueues,
} from '@/shared/utils/helpers/bullMq/queues';
import { WelcomeEmailNotificationIntegrationEventRequestDto } from '@/modules/consumers/apps/features/v1/welcomeEmail';
import { DataResponseFactory } from '@/shared/models/response/data.Response';

// Set Queues
const sendWelcomeUserEmailIntegrationEventQueues = setQueues(
	'sendWelcomeUserEmailIntegrationEventQueues',
	bullMqRedisConnection
);

@JsonController('/api/v1/users')
@OpenAPI({ tags: ['users'] })
export class CreateUserController {
	@Post()
	@OpenAPI({ summary: 'Create User', tags: ['users'] })
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(CreateUserRequestDto))
	public async createAsync(@Body() request: CreateUserRequestDto, @Res() res: Response) {
		logger.info(
			logConstruct(
				'CreateUserController',
				'createAsync',
				`Request:${JSON.stringify(request)}`
			)
		);

		// Some Database related code....

		// Publish:Send an Welcome email Notification(Consumer)
		const jobRequest: WelcomeEmailNotificationIntegrationEventRequestDto =
			new WelcomeEmailNotificationIntegrationEventRequestDto();
		jobRequest.email = request.email;
		jobRequest.fullName = request.fullName;
		await publishQueuesAsync(
			sendWelcomeUserEmailIntegrationEventQueues,
			`send-welcome-user-email`,
			jobRequest
		);

		// Response
		const response = DataResponseFactory.Response(
			true,
			StatusCodes.CREATED,
			'Data Created Successfully'
		);
		return res.status(response.StatusCode).json(response);
	}
}
