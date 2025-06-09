import { ProducerSenderReceiverController } from './apps/features/v1/senderReciverDemo';
import { ProducerRequestReplyController } from './apps/features/v1/requestReplyDemo';

export const producerModules: Function[] = [
	ProducerSenderReceiverController,
	ProducerRequestReplyController,
];
