import { test, expect } from '@playwright/test';
import { ENV } from '../../config/env';

test('Verify OrangeHRM application is accessible', async ({ request }) => {

    const response = await request.get(ENV.BASE_URL);

    expect(response.status()).toBe(200);

});