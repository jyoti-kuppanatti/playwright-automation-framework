import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import users from '../test-data/users.json';


test('Verify user login successfully', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate('/web/index.php/auth/login');

    await loginPage.login(
        users.adminUser.username,
        users.adminUser.password
    );

    await dashboardPage.verifyDashboardLoaded();

});