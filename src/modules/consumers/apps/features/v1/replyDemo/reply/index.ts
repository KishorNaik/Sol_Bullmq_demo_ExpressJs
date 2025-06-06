import { bullMqRedisConnection, runWorkers } from '@/shared/utils/helpers/bullMq/queues';
import { logConstruct, logger } from '@/shared/utils/helpers/loggers';
import { ReplyDemoRequestDto, ReplyDemoResponseDto } from '../contracts';

//@region set Workers
const replyWorkers = runWorkers(
	`replyQueues`,
	async (job) => {
		logger.info(logConstruct('replyWorkers', 'worker', `Job:${job.id}: started`));

		const jobData = job.data as ReplyDemoRequestDto;

		logger.info(logConstruct('replyWorkers', 'worker', `Job for User id:${jobData.id}`));

		// Response
		const response = new ReplyDemoResponseDto();
		response.id = jobData.id;
		response.message = `Reply from Producer Modules Successfully for UserId:${jobData.id}`;

		return response;
	},
	bullMqRedisConnection
);

// Handle errors
replyWorkers.on('failed', (job, err) => {
	logger.error(
		logConstruct(
			'replyWorkers',
			'worker',
			`Job:${job.id} failed for UserId:${job.data?.id}`,
			err
		)
	);
});

replyWorkers.on('completed', (job) => {
	logger.info(
		logConstruct('replyWorkers', 'worker', `Job:${job.id} completed for UserId:${job.data?.id}`)
	);
});
// @endregion
