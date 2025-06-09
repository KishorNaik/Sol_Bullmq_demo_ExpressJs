import { senderReceiverDemoEventListener } from './apps/features/v1/senderReciverDemo/events';
import { RequestReplyDemoEventListener } from './apps/features/v1/requestReplyDemo';
import { bullMqRunner } from '@/shared/utils/helpers/bullMq';

export const consumerModules: Function[] = [];
bullMqRunner.registerWorker(senderReceiverDemoEventListener);
bullMqRunner.registerWorker(RequestReplyDemoEventListener);
