import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSesionService } from '../../services/auth-sesion.service';
import { setSession } from '../../../store/session/actions/session.actions';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

  private readonly authService = inject(AuthSesionService);
  store = inject(Store<AppState>)
  private readonly router = inject(Router);

  code: string = ""

  confirm() {
    if (!this.code) {

      Swal.fire({
        title: "upss!!",
        text: "Debe ingresar el codigo para continuar",
        icon: "info"
      });
      return
    }
    
    const currentUser: string = localStorage.getItem("current_user") || "";
    console.log(currentUser, this.code);
    
    this.authService.signUpConfirmation(currentUser, this.code).subscribe((resp) => {
      if (resp) {        
        this.store.dispatch(setSession({ session: resp }))
        this.router.navigate(['session/autenticacion'])
      }else{
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Ingrese el codigo que le ha llega al correo",
          footer: '<a >si no encuentra el codigo, puede revisar en el area de span</a>'
        });
      }
    })


  }
}
