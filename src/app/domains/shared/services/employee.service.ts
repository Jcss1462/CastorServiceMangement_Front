import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);

  constructor() { }

  getAllEmployeee() {

    const url=new URL(environment.castorApi+"/Empleado/GettAllEmpleados");

    let response: Observable<Employee[]> = this.http.get<Employee[]>(url.toString())

    return response;
  }

  createEmployee(employee: Employee) {
    return this.http.post<void>( environment.castorApi+"/Empleado/createEmpleado", employee);  
  }

  deleteEmployee(id?: number) {
    return this.http.delete<void>( environment.castorApi+"/Empleado/"+id);  
  }

  getEmployeeById(id? : number) {
    const url=new URL(environment.castorApi+"/Empleado/GetEmpleadoById/"+id);
    let response: Observable<Employee> = this.http.get<Employee>(url.toString())
    return response;
  }

  updateEmployee(employee: Employee) {
    return this.http.put<void>( environment.castorApi+"/Empleado/"+employee.id, employee);  
  }


}
