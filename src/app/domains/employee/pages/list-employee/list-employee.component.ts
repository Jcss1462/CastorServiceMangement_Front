import { Component, inject, signal, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../../shared/models/employee';
import { EmployeeService } from '../../../shared/services/employee.service';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.css'
})
export class ListEmployeeComponent {


  employees = signal<Employee[]>([]);

  private  employeeService= inject(EmployeeService);
 
  constructor(private toastr: ToastrService){}

  ngOnInit(){
    this.getAllEmployee();
  }

  
  private getAllEmployee() {
    this.employeeService.getAllEmployeee()
    .subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: () => {
        this.toastr.error("Error al intentar obtener los empleados");
      }
    })
  }

}
