import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from './domains/shared/services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CastorServiceMangement_Front';

  private  spinnerService= inject(SpinnerService);
  showSpinner=this.spinnerService.showSpinner;
}
