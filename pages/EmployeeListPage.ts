import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeListPage extends BasePage {

    private readonly employeeNameInput: Locator;
    private readonly employeeIdInput: Locator;
    private readonly employmentStatusDropdown: Locator;
    private readonly includeDropdown: Locator;
    private readonly searchButton: Locator;
    private readonly resetButton: Locator;
    private readonly recordsFoundText: Locator;
    private readonly tableRows: Locator;

    // Column order in the results table, left to right: 0=checkbox, 1=Id, 2=First Name,
    // 3=Last Name, 4=Job Title, 5=Employment Status, 6=Sub Unit, 7=Supervisor, 8=Actions.
    private static readonly EMPLOYMENT_STATUS_CELL_INDEX = 5;

    constructor(page: Page) {
        super(page);

        // Employee Name is an autocomplete input with no name/id attribute - scoped via its
        // label text, same pattern used on AddEmployeePage/PersonalDetailsPage for label-only fields.
        this.employeeNameInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Employee Name' }) })
            .locator('input');

        this.employeeIdInput = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Employee Id' }) })
            .locator('input');

        this.employmentStatusDropdown = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Employment Status' }) })
            .locator('.oxd-select-text');

        this.includeDropdown = page
            .locator('.oxd-input-group')
            .filter({ has: page.locator('label', { hasText: 'Include' }) })
            .locator('.oxd-select-text');

        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        // The record-count text ("(N) Records Found" / "No Records Found") is rendered inside
        // this padding wrapper directly above the table. Scoping to it (rather than a bare
        // text-based locator) avoids incidentally matching the near-identical "No Records Found"
        // toast notification that also briefly appears elsewhere in the DOM after a zero-result search.
        this.recordsFoundText = page.locator('.orangehrm-horizontal-padding.orangehrm-vertical-padding span').first();

        this.tableRows = page.locator('.oxd-table-body .oxd-table-card');
    }

    public async goto(): Promise<void> {
        await this.navigate('/web/index.php/pim/viewEmployeeList');
        await this.page.locator('.oxd-table').waitFor({ state: 'visible' });

        // The Employment Status dropdown's option list is populated by a background XHR that
        // isn't awaited by the page's 'load'/'domcontentloaded' events. Opening the dropdown
        // before that request resolves briefly shows a "No Records Found" placeholder instead
        // of the real options, so wait for the network to settle before interacting with filters.
        await this.page.waitForLoadState('networkidle');
    }

    public async fillEmployeeName(name: string): Promise<void> {
        await this.employeeNameInput.fill(name);
        // Dismiss the autocomplete suggestion dropdown without selecting a suggestion,
        // since these scenarios only need the typed value, not an autocomplete match.
        await this.page.keyboard.press('Escape');
    }

    public async getEmployeeName(): Promise<string> {
        return this.employeeNameInput.inputValue();
    }

    public async fillEmployeeId(id: string): Promise<void> {
        await this.employeeIdInput.fill(id);
    }

    public async getEmployeeId(): Promise<string> {
        return this.employeeIdInput.inputValue();
    }

    private async openDropdown(dropdown: Locator): Promise<Locator> {
        const optionsList = this.page.locator('.oxd-select-dropdown .oxd-select-option');

        // Re-clicking this custom Vue select immediately after it was just closed (e.g. via
        // Escape) is unreliable - the click can be swallowed mid-transition and never reopen
        // the list. Skip the click entirely if the dropdown is already open from a prior call.
        const alreadyOpen = await optionsList.first().isVisible().catch(() => false);
        if (!alreadyOpen) {
            await dropdown.click();
            await optionsList.first().waitFor({ state: 'visible' });
        }

        return optionsList;
    }

    public async getEmploymentStatusOptions(): Promise<string[]> {
        // Deliberately left open (not closed via Escape) - closing and immediately reopening this
        // custom select is flaky (see openDropdown), so the dropdown is left open for a subsequent
        // selectEmploymentStatus() call to reuse via the alreadyOpen check above.
        const optionsList = await this.openDropdown(this.employmentStatusDropdown);
        const options = await optionsList.allTextContents();
        return options.map(o => o.trim());
    }

    public async selectEmploymentStatus(status: string): Promise<void> {
        const optionsList = await this.openDropdown(this.employmentStatusDropdown);
        // Exact match avoids "Full-Time Contract" also matching "Full-Time Contract Something"-style substrings
        await optionsList.getByText(status, { exact: true }).click();
    }

    public async getEmploymentStatusValue(): Promise<string> {
        return (await this.employmentStatusDropdown.locator('.oxd-select-text-input').textContent())?.trim() ?? '';
    }

    public async selectInclude(option: string): Promise<void> {
        const optionsList = await this.openDropdown(this.includeDropdown);
        await optionsList.getByText(option, { exact: true }).click();
    }

    public async getIncludeValue(): Promise<string> {
        return (await this.includeDropdown.locator('.oxd-select-text-input').textContent())?.trim() ?? '';
    }

    public getJobTitleValue(): Locator {
        return this.getSelectValueLocator('Job Title');
    }

    public getSubUnitValue(): Locator {
        return this.getSelectValueLocator('Sub Unit');
    }

    private getSelectValueLocator(labelText: string): Locator {
        return this.page
            .locator('.oxd-input-group')
            .filter({ has: this.page.locator('label', { hasText: labelText }) })
            .locator('.oxd-select-text-input');
    }

    public async clickSearch(): Promise<void> {
        await this.searchButton.click();
        // Wait for either a populated table row or the "No Records Found" state to settle,
        // instead of a fixed sleep, since result re-render timing varies on the shared demo instance.
        await this.recordsFoundText.waitFor({ state: 'visible' });
    }

    public async clickReset(): Promise<void> {
        await this.resetButton.click();
        // Reset triggers its own background re-fetch of the default result list, so wait for
        // the network to settle before reading field values/results, otherwise assertions can
        // race the stale "No Records Found" state left over from the prior filtered search.
        await this.page.waitForLoadState('networkidle');
    }

    public async getRecordsFoundText(): Promise<string> {
        return (await this.recordsFoundText.textContent())?.trim() ?? '';
    }

    public async getRowCount(): Promise<number> {
        return this.tableRows.count();
    }

    public async isNoRecordsFound(): Promise<boolean> {
        const text = await this.getRecordsFoundText();
        return /no records found/i.test(text);
    }

    /**
     * Returns the Employment Status column value for every currently visible row.
     */
    public async getAllRowEmploymentStatuses(): Promise<string[]> {
        const rowCount = await this.tableRows.count();
        const statuses: string[] = [];

        for (let i = 0; i < rowCount; i++) {
            const cell = this.tableRows
                .nth(i)
                .locator('.oxd-table-cell')
                .nth(EmployeeListPage.EMPLOYMENT_STATUS_CELL_INDEX);
            statuses.push((await cell.textContent())?.trim() ?? '');
        }

        return statuses;
    }

}
