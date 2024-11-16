import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSesionService } from '../../services/auth-sesion.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { setSession } from '../../../store/session/actions/session.actions';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent {

  private readonly authService = inject(AuthSesionService)
  private readonly router = inject(Router);

  store = inject(Store<AppState>)


  newPassword: string = ''
  repeatPassword: string = ''

  changePassword() {
    if (this.newPassword === '' || this.repeatPassword === '') {
      this.msgInvalid()
      return
    }

    if (this.newPassword !== this.repeatPassword) {
      this.msgInvalidRepeat()
      return
    }


    try {
      const id = JSON.parse(localStorage.getItem("session") || "{'id': ''}").id
      if (!id) {
        this.acctionInvlid()
        return
      }

      this.authService.recoverPasswordChange(this.newPassword, Number(id)).subscribe({
        next: value => {
          let roleUpper = value.role.toUpperCase()

          this.store.dispatch(setSession({ session: value }))
          switch (roleUpper) {
            case "ADMIN":
              this.router.navigate(['manager/inicio'])
              break
            case "CLIENTE":
              this.router.navigate(['user/dashboard'])
              break
            default:
              this.router.navigate(['manager/inicio'])
              break
          }

        },
        error: err => {
          console.log(err);
          this.acctionInvlid()
        }
      })
    } catch (error) {
      this.acctionInvlid()
    }

  }

  private msgInvalid() {
    Swal.fire({
      icon: "info",
      title: "Oops...",
      text: "Debes de llenar los campos",
    });
  }

  private msgInvalidRepeat() {
    Swal.fire({
      icon: "question",
      title: "Oops...",
      text: "Las contrasenias no conciden, intenta de nuevo",
    });
  }

  private acctionInvlid() {
    Swal.fire({
      icon: "question",
      title: "Accion invalida",
      text: "Para recuperar la contrasenia debe de seguir los pasos adecuados",
    });
  }

}
