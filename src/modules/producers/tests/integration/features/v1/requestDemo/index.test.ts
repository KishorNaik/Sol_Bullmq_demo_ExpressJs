import expect from 'expect';
import request from 'supertest';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { App } from '@/app';
import { modulesFederation } from '@/modules';
import { ValidateEnv } from '@/shared/utils/validations/env';
import { CreateUserRequestDto } from '@/modules/producers/apps/features/v1/createUsers';

process.env.NODE_ENV = 'development';

ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`Request Demo Integration Test`, () => {
	// node --trace-deprecation --test --test-name-pattern='should_return_true_if_all_services_passed' --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/features/v1/requestDemo/index.test.ts
	it(`should_return_true_if_all_services_passed`, async () => {
		const response = await request(app).get('/api/v1/users');
		expect(response.status).toBe(200);
		// setTimeout(() => {
		// 	process.exit(0);
		// }, 50000);
	});
});
