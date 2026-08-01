import { test, expect } from '../../fixtures/baseFixture';
import users from '../../test-data/users.json';

// Confirmed live via PIM > Employee List > Employment Status dropdown (see docs/test-scenarios-pim.md, ESRCH-14)
const EXPECTED_EMPLOYMENT_STATUS_OPTIONS = [
    'Freelance',
    'Full-Time Contract',
    'Full-Time Permanent',
    'Full-Time Probation',
    'Part-Time Contract',
    'Part-Time Internship'
];

// The app renders the singular "Record" instead of "Records" when the count is exactly 1
// (e.g. "(1) Record Found" vs "(4) Records Found"), so both forms are accepted here.
const RECORDS_FOUND_PATTERN = /^\(\d+\) Records? Found$/i;

test.describe('PIM > Employee List > Search Employee', () => {

    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigate('/web/index.php/auth/login');
        await loginPage.login(users.adminUser.username, users.adminUser.password);

        // Wait for the post-login redirect to finish before navigating elsewhere,
        // otherwise a subsequent page.goto() can race the login redirect and get aborted.
        await dashboardPage.verifyDashboardLoaded();
    });

    // ESRCH-14
    test('filters by an Employment Status option so only employees with that exact status are listed', async ({ employeeListPage }) => {
        await employeeListPage.goto();

        const defaultRecordsText = await employeeListPage.getRecordsFoundText();

        // Step 1: open the dropdown and confirm all six documented options exist
        const actualOptions = await employeeListPage.getEmploymentStatusOptions();
        for (const expectedOption of EXPECTED_EMPLOYMENT_STATUS_OPTIONS) {
            expect(actualOptions).toContain(expectedOption);
        }

        // This is a shared public demo instance, so the count of employees per status
        // fluctuates as other anonymous users add/edit/delete records. Rather than hardcoding
        // one status that might legitimately have zero matches at run time, try each option in
        // turn and validate row-level correctness against whichever one currently has data -
        // this keeps the assertion meaningful without depending on a specific record count.
        let verifiedAgainstNonEmptyResult = false;

        for (const status of EXPECTED_EMPLOYMENT_STATUS_OPTIONS) {
            // Step 2: select one option
            await employeeListPage.selectEmploymentStatus(status);
            // Step 3: click Search
            await employeeListPage.clickSearch();

            const recordsText = await employeeListPage.getRecordsFoundText();
            const noRecords = await employeeListPage.isNoRecordsFound();

            if (noRecords) {
                // Record count updated away from the unfiltered default view even when 0 rows match
                expect(recordsText.toLowerCase()).toContain('no records found');
                continue;
            }

            // Record-count text is a valid "(N) Records Found" pattern, and it updated from the default
            expect(recordsText).toMatch(RECORDS_FOUND_PATTERN);
            expect(recordsText).not.toBe(defaultRecordsText);

            const statuses = await employeeListPage.getAllRowEmploymentStatuses();
            expect(statuses.length).toBeGreaterThan(0);

            // Every visible row's Employment Status column must equal exactly the selected status
            for (const rowStatus of statuses) {
                expect(rowStatus).toBe(status);
            }

            verifiedAgainstNonEmptyResult = true;
            break;
        }

        expect(
            verifiedAgainstNonEmptyResult,
            'Expected at least one Employment Status option to currently have matching employees on the shared demo instance'
        ).toBe(true);
    });

    // ESRCH-25
    test('Reset clears all search filters back to their default state and reverts the result list', async ({ employeeListPage }) => {
        await employeeListPage.goto();

        // Confirm the known defaults before making any changes
        expect(await employeeListPage.getEmployeeName()).toBe('');
        expect(await employeeListPage.getEmployeeId()).toBe('');
        expect(await employeeListPage.getEmploymentStatusValue()).toBe('-- Select --');
        expect(await employeeListPage.getIncludeValue()).toBe('Current Employees Only');
        await expect(employeeListPage.getJobTitleValue()).toHaveText('-- Select --');
        await expect(employeeListPage.getSubUnitValue()).toHaveText('-- Select --');

        // Step 1: set Employee Name, Employee Id, Employment Status, Include to non-default values
        await employeeListPage.fillEmployeeName(`NonExistent_${Date.now()}`);
        await employeeListPage.fillEmployeeId('999999');
        await employeeListPage.selectEmploymentStatus('Freelance');
        await employeeListPage.selectInclude('Past Employees Only');

        // Confirm the non-default values actually took effect before resetting
        expect(await employeeListPage.getEmployeeId()).toBe('999999');
        expect(await employeeListPage.getEmploymentStatusValue()).toBe('Freelance');
        expect(await employeeListPage.getIncludeValue()).toBe('Past Employees Only');

        // Run the search with the non-default filters so there is an actual filtered result list
        // to revert from - otherwise "the result list reverts to default" would be untestable,
        // since the table would never have changed in the first place.
        await employeeListPage.clickSearch();
        const filteredRecordsText = await employeeListPage.getRecordsFoundText();

        // Step 2: click Reset
        await employeeListPage.clickReset();

        // Employee Name / Employee Id become empty
        expect(await employeeListPage.getEmployeeName()).toBe('');
        expect(await employeeListPage.getEmployeeId()).toBe('');

        // Employment Status / Job Title / Sub Unit return to "-- Select --"
        expect(await employeeListPage.getEmploymentStatusValue()).toBe('-- Select --');
        await expect(employeeListPage.getJobTitleValue()).toHaveText('-- Select --');
        await expect(employeeListPage.getSubUnitValue()).toHaveText('-- Select --');

        // Include returns to "Current Employees Only"
        expect(await employeeListPage.getIncludeValue()).toBe('Current Employees Only');

        // The result list reverts to the default unfiltered view: a valid, populated
        // "(N) Records Found" state that differs from the filtered (Employee Id 999999 / Freelance
        // / Past Employees Only) result captured just before Reset.
        const revertedRecordsText = await employeeListPage.getRecordsFoundText();
        expect(revertedRecordsText).toMatch(RECORDS_FOUND_PATTERN);
        expect(revertedRecordsText).not.toBe(filteredRecordsText);
    });

});
