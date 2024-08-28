import { Routes } from '@angular/router';

import { ListEmployeeComponent } from './domains/employee/pages/list-employee/list-employee.component';
import { AddEmployeeComponent } from './domains/employee/pages/add-employee/add-employee.component';

export const routes: Routes = [
    {
        path: "",
        component: ListEmployeeComponent
    },
    {
        path: "addEmployee",
        component: AddEmployeeComponent
    }
];
