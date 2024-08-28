import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Cargo } from '../models/cargo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private http = inject(HttpClient);

  constructor() { }

  getAllCargos() {
    const url=new URL(environment.castorApi+"/Cargos/GetAllCargos");
    let response: Observable<Cargo[]> = this.http.get<Cargo[]>(url.toString())
    return response;
  }
}
