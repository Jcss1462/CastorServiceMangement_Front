import { Component, inject, signal, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../../shared/models/employee';
import { EmployeeService } from '../../../shared/services/employee.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { DomElementSchemaRegistry } from '@angular/compiler';

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
  private spinnerService = inject(SpinnerService);
 
  constructor(private toastr: ToastrService,private router: Router){}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  ngOnChanges(changes: SimpleChanges){
    this.getAllEmployee();
  }

  
  private getAllEmployee() {
    this.spinnerService.showSpinner.update(() => true);
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
        this.spinnerService.showSpinner.update(() => false);
      },
      error: () => {
        this.toastr.error("Error al intentar obtener los empleados");
        this.spinnerService.showSpinner.update(() => false);
      }
    })
  }

  deleteEmployee(id?:number){

    this.spinnerService.showSpinner.update(() => true);
    this.employeeService.deleteEmployee(id)
    .subscribe({
      next: () => {
        this.toastr.success("Empleado con id: "+ id+" eliminado con exito");
        this.spinnerService.showSpinner.update(() => false);
        this.getAllEmployee();
      },
      error: () => {
        this.toastr.error("Error al intentar eliminar el empleado");
        this.spinnerService.showSpinner.update(() => false);
      }
    })

  }

  navigateToAddEmployee() {
    this.router.navigate(['/addEmployee']);
  }
  

}
