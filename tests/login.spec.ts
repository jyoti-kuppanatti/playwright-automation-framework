import { test } from '../fixtures/baseFixture';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import users from '../test-data/users.json';


test('Verify user login successfully', async ({ page, loginPage, dashboardPage}) => {

    await loginPage.navigate('/web/index.php/auth/login');

    await loginPage.login(
        users.adminUser.username,
        users.adminUser.password
    );

    await dashboardPage.verifyDashboardLoaded();

});