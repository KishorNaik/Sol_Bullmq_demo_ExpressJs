import { consumerModules } from './consumers/consumers.Module';
import { producerModules } from './producers/producers.Module';

export const modulesFederation: Function[] = [...producerModules, ...consumerModules];
