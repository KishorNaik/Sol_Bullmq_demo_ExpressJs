import { consumerModule } from "./consumers";
import { producerModule } from "./producers";

export const modulesFederation: Function[] = [...producerModule,...consumerModule];
export const modulesFederationPubSubConsumers: Function[] = [];
export const modulesFederationRequestReplyConsumers: Function[] = [];
