import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.css'
})
export class ListEmployeeComponent {


  constructor(private toastr: ToastrService){}

  showToaster(){
    this.toastr.success("Mensaje enviado con éxito");
  }

}
