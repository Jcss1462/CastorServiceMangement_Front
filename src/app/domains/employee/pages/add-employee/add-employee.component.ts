import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cargo } from '../../../shared/models/cargo';
import { CargoService } from '../../../shared/services/cargo.service';
import { Employee } from '../../../shared/models/employee';
import { EmployeeService } from '../../../shared/services/employee.service';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {

  employeeForm!: FormGroup;
  cargos = signal<Cargo[]>([]);

  private cargoService = inject(CargoService);
  private employeeService = inject(EmployeeService);
  private spinnerService = inject(SpinnerService);

  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.employeeForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      idCargo: ['', Validators.required],
      foto: [null]
    });
  }

  ngOnInit(): void {
    this.getAllCargos();
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

  clearImage() {
    // Limpiar la vista previa de la imagen
    this.imagePreview = null;

    // Limpiar el input file
    const inputFile = document.getElementById('foto') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
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
      let newEmployee: Employee = {
        cedula: this.employeeForm.get("cedula")?.value,
        nombre: this.employeeForm.get("nombre")?.value,
        idCargo: this.employeeForm.get("idCargo")?.value,
        foto: fotoBase64
      }

      this.spinnerService.showSpinner.update(() => true);
      this.employeeService.createEmployee(newEmployee)
        .subscribe({
          next: (response) => {
            this.toastr.success("Empleado creado con exito");
            this.employeeForm.reset();
            this.clearImage();
            this.spinnerService.showSpinner.update(() => false);
          },
          error: (err) => {
            console.log(err);
            this.toastr.error("Error al guardar empleado: \n" +err.error.split("at")[0]);
            this.spinnerService.showSpinner.update(() => false);
          }
        })


    } else {
      this.toastr.error("Llena todos los campos obligatorios");
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
