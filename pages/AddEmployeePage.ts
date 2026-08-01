import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PersonalDetailsPage } from './PersonalDetailsPage';

export class AddEmployeePage extends BasePage {

    private readonly firstNameInput: Locator;
    private readonly middleNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly employeeIdInput: Locator;
    private readonly employeeIdConflictMessage: Locator;
    private readonly createLoginDetailsToggle: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly saveButton: Locator;
    private readonly cancelButton: Locator;
    private readonly firstNameError: Locator;
    private readonly lastNameError: Locator;

    constructor(page: Page) {
        super(page);

        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');

        // Employee Id has no name/id attribute on this page - scope it via its label text
        this.employeeIdInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Employee Id' }) })
            .locator('input');

        // Shown when the auto-generated/entered Employee Id collides with an existing record
        // (see ADD-09). Text-based locator since this element carries no distinguishing class.
        this.employeeIdConflictMessage = page.getByText('Employee Id already exists');

        this.createLoginDetailsToggle = page.locator('.oxd-switch-wrapper');

        // Username/Password/Confirm Password also have no name/id - scope via label text.
        // Password uses an exact-text filter so it doesn't also match "Confirm Password".
        this.usernameInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Username' }) })
            .locator('input');

        this.passwordInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: /^Password$/ }) })
            .locator('input');

        this.confirmPasswordInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Confirm Password' }) })
            .locator('input');

        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });

        // First/Middle/Last Name each sit inside their own
        // ".oxd-input-group.oxd-input-field-bottom-space" wrapper, which is itself nested
        // inside an outer ".oxd-input-group" for "Employee Full Name". Scoping on the compound
        // class (rather than plain ".oxd-input-group") avoids matching that outer wrapper, which
        // would otherwise incorrectly resolve to both the First Name and Last Name error spans.
        this.firstNameError = page
            .locator('.oxd-input-group.oxd-input-field-bottom-space')
            .filter({ has: page.locator('input[name="firstName"]') })
            .locator('.oxd-input-field-error-message');

        this.lastNameError = page
            .locator('.oxd-input-group.oxd-input-field-bottom-space')
            .filter({ has: page.locator('input[name="lastName"]') })
            .locator('.oxd-input-field-error-message');
    }

    public async goto(): Promise<void> {
        await this.navigate('/web/index.php/pim/addEmployee');
        await this.firstNameInput.waitFor({ state: 'visible' });
    }

    public async getEmployeeId(): Promise<string> {
        // The auto-generated Id is populated asynchronously after the form loads
        await expect(this.employeeIdInput).not.toHaveValue('');
        return this.employeeIdInput.inputValue();
    }

    public async fillEmployeeName(
        firstName: string,
        lastName: string,
        middleName?: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);

        if (middleName) {
            await this.middleNameInput.fill(middleName);
        }

        await this.lastNameInput.fill(lastName);
    }

    public async enableCreateLoginDetails(): Promise<void> {
        await this.createLoginDetailsToggle.click();
        // The username/password fields render asynchronously once the Vue toggle switches on
        await this.usernameInput.waitFor({ state: 'visible' });
    }

    public async fillLoginDetails(
        username: string,
        password: string,
        confirmPassword: string
    ): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    public async selectStatus(status: 'Enabled' | 'Disabled'): Promise<void> {
        await this.page.getByRole('radio', { name: status }).check();
    }

    public async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    public async clickCancel(): Promise<void> {
        await this.cancelButton.click();
    }

    public async saveAndGoToPersonalDetails(): Promise<PersonalDetailsPage> {
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await this.saveButton.click();

            // Explicit wait for the SPA route change instead of an arbitrary sleep
            const navigated = await this.page
                .waitForURL('**/pim/viewPersonalDetails/**', { timeout: 15000 })
                .then(() => true)
                .catch(() => false);

            if (navigated) {
                return new PersonalDetailsPage(this.page);
            }

            // This is a public, shared demo instance: its auto-generated Employee Id sequence
            // can be claimed by another concurrent session between page load and Save, causing
            // an "Employee Id already exists" conflict (see ADD-09) that is outside this test's
            // control. Recover by nudging the Id and retrying, rather than failing on collisions
            // unrelated to the scenario under test.
            const hasConflict = await this.employeeIdConflictMessage.isVisible().catch(() => false);

            if (!hasConflict || attempt === maxAttempts) {
                throw new Error(
                    'Save did not navigate to Personal Details and no recoverable Employee Id conflict was detected.'
                );
            }

            const staleId = await this.employeeIdInput.inputValue();
            const bumpedId = String(Number(staleId) + attempt).padStart(staleId.length, '0');
            await this.employeeIdInput.fill(bumpedId);
        }

        // Unreachable - the loop above always returns or throws
        throw new Error('saveAndGoToPersonalDetails: exhausted retries.');
    }

    public getFirstNameError(): Locator {
        return this.firstNameError;
    }

    public getLastNameError(): Locator {
        return this.lastNameError;
    }

}
