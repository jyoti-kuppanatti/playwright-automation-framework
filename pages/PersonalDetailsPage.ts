import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';

export class PersonalDetailsPage extends BasePage {

    private readonly employeeIdInput: Locator;
    private readonly employeeNameHeader: Locator;
    private readonly personalDetailsTab: Locator;
    private readonly userDropdownTab: Locator;
    private readonly logoutMenuItem: Locator;

    constructor(page: Page) {
        super(page);

        // Employee Id has no name/id attribute in the DOM, so it is scoped via its label text
        this.employeeIdInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Employee Id' }) })
            .locator('input');

        this.employeeNameHeader = page.locator('.orangehrm-edit-employee-name h6');
        this.personalDetailsTab = page.getByRole('tab', { name: 'Personal Details' });
        this.userDropdownTab = page.locator('.oxd-userdropdown-tab');
        this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    }

    public async verifyLoaded(): Promise<void> {
        // Explicit URL wait instead of a fixed sleep - the SPA route changes asynchronously after save
        await expect(this.page).toHaveURL(/.*\/pim\/viewPersonalDetails\/empNumber\/\d+/);
        await expect(this.personalDetailsTab).toBeVisible();
    }

    public async getEmployeeId(): Promise<string> {
        // The field is populated asynchronously after the SPA route change, so wait for a
        // non-empty value instead of reading inputValue() immediately (which doesn't auto-retry).
        await expect(this.employeeIdInput).not.toHaveValue('');
        return this.employeeIdInput.inputValue();
    }

    public async getFullName(): Promise<string> {
        // The name header renders asynchronously after the SPA route change, so wait for
        // non-empty text instead of reading textContent immediately (which doesn't auto-retry).
        await expect(this.employeeNameHeader).not.toHaveText('');
        return (await this.employeeNameHeader.textContent())?.trim() ?? '';
    }

    public async logout(): Promise<LoginPage> {
        await this.userDropdownTab.click();
        await this.logoutMenuItem.click();
        return new LoginPage(this.page);
    }

}
