import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { AddEmployeePage } from '../pages/AddEmployeePage'

type Fixtures  = {
    loginPage : LoginPage,
    dashboardPage : DashboardPage,
    addEmployeePage : AddEmployeePage
}

export const test = base.extend<Fixtures>({
    loginPage: async ({page}, use)=>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
},

   dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },

   addEmployeePage: async ({ page }, use) => {
        const addEmployeePage = new AddEmployeePage(page);
        await use(addEmployeePage);
    }
    });

    export { expect };

