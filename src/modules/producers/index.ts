import { CreateUserController } from './apps/features/v1/createUsers';
import { RequestDemoController } from './apps/features/v1/requestDemo';

export const producerModule: Function[] = [CreateUserController,RequestDemoController];
