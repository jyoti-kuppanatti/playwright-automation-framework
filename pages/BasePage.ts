import { Page } from '@playwright/test';

export class BasePage {

    constructor(protected page: Page) {
    }

    public async navigate(url: string): Promise<void> {
        await this.page.goto(url,
            {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
    }

}