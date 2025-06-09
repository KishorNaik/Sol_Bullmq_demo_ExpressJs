import { App } from '@/app';
import { ValidateEnv, runNodeCluster } from '@kishornaik/utils';
import { modulesFederation } from './modules/app.Module';
import { bullMqRunner } from './shared/utils/helpers/bullMq';
import { rabbitMQRunner } from './shared/utils/helpers/rabbitmq';

ValidateEnv();

const setDatabase = (): Promise<void> => {
	console.log('initializeDatabase Function');
	return Promise.resolve();
};

const runServer = () => {
	const app = new App([...modulesFederation]);
	app.initializeDatabase(setDatabase);
	app.runBullMqWorker(bullMqRunner);
	app.runRabbitMqWorker(rabbitMQRunner);
	app.listen();
};

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	// For Single Core Server : Development Server Only
	runServer();
} else {
	// For Multi Core Server : Production Server Only
	runNodeCluster(() => {
		runServer();
	});
}
