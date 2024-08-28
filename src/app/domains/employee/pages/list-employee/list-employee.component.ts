import { Component, inject, signal, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../../shared/models/employee';
import { EmployeeService } from '../../../shared/services/employee.service';
import { Router } from '@angular/router';

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
 
  constructor(private toastr: ToastrService,private router: Router){}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  ngOnChanges(changes: SimpleChanges){
    this.getAllEmployee();
  }

  
  private getAllEmployee() {
    this.employeeService.getAllEmployeee()
    .subscribe({
      next: (employees) => {

        const updatedImagesArray = employees.map(employees => {
          return {
            ...employees, // Copia todas las propiedades del objeto original
            foto: employees.foto!=null?"data:image/jpeg;base64,"+employees.foto:""
          };
        });
        
        this.employees.set(updatedImagesArray);
      },
      error: () => {
        this.toastr.error("Error al intentar obtener los empleados");
      }
    })
  }

  navigateToAddEmployee() {
    this.router.navigate(['/addEmployee']);
  }
  

}
