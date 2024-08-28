import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../shared/models/employee';
import { EmployeeService } from '../../../shared/services/employee.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cargo } from '../../../shared/models/cargo';
import { CargoService } from '../../../shared/services/cargo.service';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})
export class UpdateEmployeeComponent {


  employeeId!: number;
  employeeForm!: FormGroup;
  employee = signal<Employee | null>(null);
  cargos = signal<Cargo[]>([]);
  private employeeService = inject(EmployeeService);
  private cargoService = inject(CargoService);
  private spinnerService = inject(SpinnerService);
  imagePreview: string | ArrayBuffer | null | undefined= null;

  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      id: [],
      fechaIngreso: [],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      idCargo: ['', Validators.required],
      foto: [null]
    });
  }

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getEmployeeById(this.employeeId);
    this.getAllCargos()
  }

  getEmployeeById(id?: number) {
    this.spinnerService.showSpinner.update(() => true);
    this.employeeService.getEmployeeById(id)
      .subscribe({
        next: (employee) => {

          //obtengo la imagen
          employee.foto = employee.foto != null ? "data:image/jpeg;base64," + employee.foto : ""
          this.employee.set(employee);
          this.imagePreview = employee.foto != "" ? this.employee()?.foto : "https://via.placeholder.com/200";

          //seteo los valores del empleado en el formulario
          this.employeeForm.setValue({
            cedula: this.employee()?.cedula,
            nombre: this.employee()?.nombre,
            idCargo: this.employee()?.idCargo,
            foto: this.employee()?.foto,
            id: this.employee()?.id,
            fechaIngreso: this.employee()?.fechaIngreso
          });

          this.spinnerService.showSpinner.update(() => false);
        },
        error: () => {
          this.toastr.error("Error al intentar obtener la informacion del empleado con id: " + id);
          this.spinnerService.showSpinner.update(() => false);
        }
      })
  }

  private getAllCargos() {
    this.cargoService.getAllCargos()
      .subscribe({
        next: (cargos) => {
          this.cargos.set(cargos);
        },
        error: () => {
          this.toastr.error("Error al intentar obtener los cargos");
        }
      })
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  goBack(): void {
    this.router.navigate(['/']);
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async onSubmit(): Promise<void> {

    if (this.employeeForm.valid) {


      //obtengo la foto
      const fileInput = document.getElementById('foto') as HTMLInputElement;
      let fotoBase64 = '';
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        fotoBase64 = await this.convertToBase64(file);
      }

      //guardo el dato
      let eployeeToUpdate: Employee = {
        id:this.employeeForm.get("id")?.value,
        cedula: this.employeeForm.get("cedula")?.value,
        nombre: this.employeeForm.get("nombre")?.value,
        idCargo: this.employeeForm.get("idCargo")?.value,
        foto: fotoBase64
      }

      this.spinnerService.showSpinner.update(() => true);
      this.employeeService.updateEmployee(eployeeToUpdate)
        .subscribe({
          next: (response) => {
            this.toastr.success("Empleado actualizado con exito");
            this.spinnerService.showSpinner.update(() => false);
          },
          error: () => {
            this.toastr.error("Error al actualizar la informacion");
            this.spinnerService.showSpinner.update(() => false);
          }
        })

    }else {
      this.toastr.error("Llena todos los campos obligatorios");
    }
  }

}
