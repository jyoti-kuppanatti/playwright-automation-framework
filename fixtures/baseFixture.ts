import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

type Fixtures  = {
    loginPage : LoginPage,
    dashboardPage : DashboardPage
}

export const test = base.extend<Fixtures>({
    loginPage: async ({page}, use)=>{
        const loginPage = new LoginPage(page); 
        await use(loginPage);
},

   dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    }
    });

    export { expect };

