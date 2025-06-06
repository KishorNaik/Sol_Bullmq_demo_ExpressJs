import { sealed } from '@/shared/utils/decorators/sealed';
import { bullMqRedisConnection, runWorkers } from '@/shared/utils/helpers/bullMq/queues';
import { logConstruct, logger } from '@/shared/utils/helpers/loggers';
import { NotificationData, notificationHandler, NotificationHandler } from 'mediatr-ts';
import { WelcomeEmailNotificationIntegrationEventRequestDto } from '../../contracts';
import medaitR from '@/shared/medaitR';

//@region Integration Event Service
export class WelcomeEmailNotificationIntegrationEventService extends NotificationData {
	private readonly _request: WelcomeEmailNotificationIntegrationEventRequestDto;

	public constructor(request: WelcomeEmailNotificationIntegrationEventRequestDto) {
		super();
		this._request = request;
	}

	public get request(): WelcomeEmailNotificationIntegrationEventRequestDto {
		return this._request;
	}
}
// @endregion

// @region Integration Event Service Handler
@sealed
@notificationHandler(WelcomeEmailNotificationIntegrationEventService)
export class WelcomeEmailNotificationIntegrationEventHandler
	implements NotificationHandler<WelcomeEmailNotificationIntegrationEventService>
{
	public async handle(
		notification: WelcomeEmailNotificationIntegrationEventService
	): Promise<void> {
		try {
			// Send mail Code.
			logger.info(
				`WelcomeEmailNotificationIntegrationEventHandler`,
				'handle',
				`Request:${JSON.stringify(notification.request)}`
			);
		} catch (ex) {
			throw ex;
		}
	}
}
// @endregion

//@region set Workers
const sendWelcomeUserEmailIntegrationEventWorkers = runWorkers(
	`sendWelcomeUserEmailIntegrationEventQueues`,
	async (job) => {
		logger.info(
			logConstruct(
				'sendWelcomeUserEmailIntegrationEventWorkers',
				'worker',
				`Job:${job.id}: started`
			)
		);

		const jobData = job.data as WelcomeEmailNotificationIntegrationEventRequestDto;

		logger.info(
			logConstruct(
				'userCreatedDomainEventWorkers',
				'worker',
				`Job for User email:${jobData.email}`
			)
		);

		await medaitR.publish(new WelcomeEmailNotificationIntegrationEventService(jobData));

		logger.info(
			logConstruct(
				`CreateUserCommandHandler`,
				`UserCreatedDomainEventService`,
				`Domain Event Success`
			)
		);
	},
  bullMqRedisConnection
);

// Handle errors
sendWelcomeUserEmailIntegrationEventWorkers.on('failed', (job, err) => {
	logger.error(
		logConstruct(
			'sendWelcomeUserEmailIntegrationEventWorkers',
			'worker',
			`Job:${job.id} failed for UserId:${job.data?.identifier}`,
			err
		)
	);
});

sendWelcomeUserEmailIntegrationEventWorkers.on('completed', (job) => {
  logger.info(
    logConstruct(
      'sendWelcomeUserEmailIntegrationEventWorkers',
      'worker',
      `Job:${job.id} completed for UserId:${job.data?.identifier}`
    )
  );
});
// @endregion
