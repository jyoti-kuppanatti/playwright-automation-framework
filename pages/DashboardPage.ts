import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';


export class DashboardPage extends BasePage {

    private readonly dashboardHeader: Locator;

    constructor(page: Page) {
        super(page);

        this.dashboardHeader = page.locator('h6');
    }

    public async verifyDashboardLoaded(): Promise<void> {
        await expect(this.dashboardHeader).toHaveText('Dashboard');
    }

}