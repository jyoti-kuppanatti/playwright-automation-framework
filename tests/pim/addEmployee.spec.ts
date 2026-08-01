import { test, expect } from '../../fixtures/baseFixture';
import users from '../../test-data/users.json';

test.describe('PIM > Add Employee', () => {

    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.navigate('/web/index.php/auth/login');
        await loginPage.login(users.adminUser.username, users.adminUser.password);

        // Wait for the post-login redirect to finish before navigating elsewhere,
        // otherwise a subsequent page.goto() can race the login redirect and get aborted.
        await dashboardPage.verifyDashboardLoaded();
    });

    // ADD-01
    test('adds an employee with only required fields and redirects to Personal Details with the auto-generated Employee Id retained', async ({ page, addEmployeePage }) => {
        await addEmployeePage.goto();

        const generatedEmployeeId = await addEmployeePage.getEmployeeId();
        expect(generatedEmployeeId).not.toBe('');

        const lastName = `Tester${Date.now()}`;
        await addEmployeePage.fillEmployeeName('QA', lastName);

        const personalDetailsPage = await addEmployeePage.saveAndGoToPersonalDetails();
        await personalDetailsPage.verifyLoaded();

        // Redirected to the new employee's Personal Details tab
        await expect(page).toHaveURL(/.*\/pim\/viewPersonalDetails\/empNumber\/\d+/);

        // The system-generated Employee Id from the Add Employee form is retained
        expect(await personalDetailsPage.getEmployeeId()).toBe(generatedEmployeeId);
        expect(await personalDetailsPage.getFullName()).toContain(lastName);
    });

    // ADD-04
    test('adds an employee with login details (Enabled) and the new account can log in', async ({ page, addEmployeePage, loginPage, dashboardPage }) => {
        await addEmployeePage.goto();

        const lastName = `LoginTester${Date.now()}`;
        await addEmployeePage.fillEmployeeName('QA', lastName);

        await addEmployeePage.enableCreateLoginDetails();

        // Timestamp-based username so re-runs against this shared demo instance don't collide
        const uniqueUsername = `qa_user_${Date.now()}`;
        const password = 'Str0ng!Pass99';
        await addEmployeePage.fillLoginDetails(uniqueUsername, password, password);

        // Status defaults to Enabled - selected explicitly to make the scenario's intent explicit
        await addEmployeePage.selectStatus('Enabled');

        const personalDetailsPage = await addEmployeePage.saveAndGoToPersonalDetails();
        await personalDetailsPage.verifyLoaded();
        expect(await personalDetailsPage.getFullName()).toContain(lastName);

        // Log out of the admin session and verify the newly created login account works
        await personalDetailsPage.logout();
        await expect(page).toHaveURL(/.*\/auth\/login/);

        await loginPage.login(uniqueUsername, password);
        await dashboardPage.verifyDashboardLoaded();
    });

    // ADD-06
    test('shows inline Required errors for First Name and Last Name and does not navigate away when submitted empty', async ({ page, addEmployeePage }) => {
        await addEmployeePage.goto();

        await addEmployeePage.clickSave();

        await expect(addEmployeePage.getFirstNameError()).toHaveText('Required');
        await expect(addEmployeePage.getLastNameError()).toHaveText('Required');

        // The form did not submit - still on the Add Employee page
        await expect(page).toHaveURL(/.*\/pim\/addEmployee/);
    });

});
