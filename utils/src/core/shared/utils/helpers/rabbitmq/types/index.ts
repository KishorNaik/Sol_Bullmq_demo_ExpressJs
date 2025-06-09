export interface PubSubMessageRabbitMq<T> {
	data: T;
	correlationId?: string;
	timestamp?: string; // ISO 8601 format
}

export interface SenderReceiverMessageRabbitMq<T> extends PubSubMessageRabbitMq<T> {}

export interface RequestReplyMessageRabbitMq<T> {
	correlationId?: string;
	data: T;
}

export interface ReplyMessageRabbitMq<T> {
	correlationId?: string;
	success: boolean;
	data?: T;
	message?: string; // Optional message for success or error
	error?: string;
}
