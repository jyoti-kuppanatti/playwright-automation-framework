import {test as base, expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { AddEmployeePage } from '../pages/AddEmployeePage'
import { EmployeeListPage } from '../pages/EmployeeListPage'

type Fixtures  = {
    loginPage : LoginPage,
    dashboardPage : DashboardPage,
    addEmployeePage : AddEmployeePage,
    employeeListPage : EmployeeListPage
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
    },

   employeeListPage: async ({ page }, use) => {
        const employeeListPage = new EmployeeListPage(page);
        await use(employeeListPage);
    }
    });

    export { expect };

