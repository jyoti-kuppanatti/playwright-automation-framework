import { Locator, Page } from '@playwright/test';
import { DashboardPage } from './DashboardPage';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
    }

    public async login(
        username: string,
        password: string
    ): Promise<DashboardPage> {

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        return new DashboardPage(this.page);
    }

}