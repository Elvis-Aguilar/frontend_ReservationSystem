import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SignUpDto } from '../../interfaces/auth-sesion';
import { AuthSesionService } from '../../services/auth-sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly authService = inject(AuthSesionService);
  private readonly router = inject(Router);

  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initRegisterFrom()
  }

  private initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      password: [null, Validators.required],
      cui: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      nit: [null, Validators.required],
      passwordConfirm: [null, Validators.required]
    })
  }

  private maperSignUpDto(): SignUpDto {
    const { name, password, cui, email, phone, nit } = this.registerForm.value;

    const safeTrim = (value: any): string => {
      return typeof value === 'string' ? value.trim() : String(value || '');
    };

    return {
      name: safeTrim(name),
      password: safeTrim(password),
      cui: safeTrim(cui),
      email: safeTrim(email),
      phone: safeTrim(phone),
      nit: safeTrim(nit)
    };
  }

  register() {
    //valid paswword equals
    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      Swal.fire({
        title: "Confirmar Contrasenia",
        text: "Las contrasenias no considen",
        icon: "info"
      });
      return
    }
    //TODO: validaciones de otros tipos, IMPLEMENTAR @DAVID

    const signUpDto: SignUpDto = this.maperSignUpDto();
    this.authService.signUp(signUpDto).subscribe({
      next: value =>{
        localStorage.setItem("current_user", value.email)
        this.router.navigate(["session/confirmacion"])
      },
      error: err =>{
        //TODO: manejar el error, ejemplo, que el correo no sea unico, el nit, o el cui *MOSTRAR MENSAJE*
      }
    })

  }


}
