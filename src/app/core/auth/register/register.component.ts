import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SignUpDto } from '../../interfaces/auth-sesion';
import { AuthSesionService } from '../../services/auth-sesion.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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

  private validateForm() {
    const formValues = this.registerForm.value;
    const errors: string[] = [];

    // Validar que 'name' sea un string
    if (typeof formValues.name !== 'string' || formValues.name.trim() === '') {
      errors.push('El campo "name" debe ser un texto válido.');
    }

    // Validar que 'cui', 'nit' y 'phone' sean números válidos
    ['cui', 'nit', 'phone'].forEach((field) => {
      if (isNaN(Number(formValues[field]))) {
        errors.push(`El campo "${field}" debe ser un número válido.`);
      }
    });

    // Validar que 'email' sea un email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      errors.push('El campo "email" debe contener un email válido.');
    }

    // Mostrar errores con SweetAlert si los hay
    if (errors.length > 0) {
      Swal.fire({
        title: 'Errores en el formulario',
        icon: 'error',
        html: `<ul>${errors.map((error) => `<li>${error}</li>`).join('')}</ul>`,
        confirmButtonText: 'Entendido',
      });
      return false;
    }

    // Si todo es válido
    return true;
  }


  register() {
    console.log("register() fue llamado");

    //Para validar si todo esta vacio en cuestion de los inputs  
    if (!this.registerForm.valid) {
      const hasEmptyFields = Object.keys(this.registerForm.controls).some(
        (key) => this.registerForm.get(key)?.invalid
      );

      if (hasEmptyFields) {
        Swal.fire({
          title: "Error en el Registro",
          text: "Por favor, completa todos los campos obligatorios.",
          icon: "error"
        });
      }

      return;
    }

    if (!this.validateForm()) return;

    // Valida si las contraseñas coinciden
    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      Swal.fire({
        title: "Error de Contraseña",
        text: "Las contraseñas no coinciden.",
        icon: "error"
      });
      return;
    }

    // Continúa con el registro
    const signUpDto: SignUpDto = this.maperSignUpDto();
    this.authService.signUp(signUpDto).subscribe({
      next: value => {
        localStorage.setItem("current_user", value.email);
        this.router.navigate(["session/confirmacion"]);
      },
      error: err => {
        // Maneja errores del backend
        if (err.status === 400 && err.error.message.includes('Email')) {
          Swal.fire({
            title: "Error de Registro",
            text: "El correo electrónico ya está en uso.",
            icon: "error"
          });
        } else if (err.status === 400 && err.error.message.includes('CUI')) {
          Swal.fire({
            title: "Error de Registro",
            text: "El CUI ya está registrado.",
            icon: "error"
          });
        } else if (err.status === 400 && err.error.message.includes('NIT')) {
          Swal.fire({
            title: "Error de Registro",
            text: "El NIT ya está registrado.",
            icon: "error"
          });
        } else {
          Swal.fire({
            title: "Revise su correo Inesperado",
            text: "Se detecto un error al intentar mandar el correo, por favor verifique, si su correo llego, sino intnte mas tarde",
            icon: "question"
          });
        }
      }
    });
  }

}
