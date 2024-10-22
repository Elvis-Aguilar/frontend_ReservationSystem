import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadImgService } from '../../../config/services/upload-img.service';
import { ManagmentService } from '../utils/services/managment.service';
import Swal from 'sweetalert2';
import { BusinessConfigurationDto } from '../utils/models/business-congifuration.dto';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-business',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})
export class BusinessComponent {

  registerForm!: FormGroup;
  admin: number = 1;

  file!: File
  formData!: FormData

  mostarForm = false

  businessConfiguration!: BusinessConfigurationDto

  private readonly uploadService = inject(UploadImgService)
  private readonly managmetService = inject(ManagmentService)

  constructor(private formBuilder: FormBuilder) {
    this.mostarForm = false
    this.getBusinessConfiguration()
    this.admin = JSON.parse(localStorage.getItem("session") || "{'id': ''}").id
  }

  private initBusinessExist(): boolean {
    if (this.businessConfiguration) {
      this.registerForm = this.formBuilder.group({
        name: [this.businessConfiguration.name, Validators.required],
        logoUrl: [null],
        admin: [this.businessConfiguration.admin, Validators.required],
        description: [this.businessConfiguration.description, Validators.required],
        businessType: [this.businessConfiguration.businessType, Validators.required],
        maxDaysCancellation: [this.businessConfiguration.maxDaysCancellation, Validators.required],
        maxHoursCancellation: [this.businessConfiguration.maxHoursCancellation, Validators.required],
        cancellationSurcharge: [this.businessConfiguration.cancellationSurcharge, Validators.required],
        maxDaysUpdate: [this.businessConfiguration.maxDaysUpdate, Validators.required],
        maxHoursUpdate: [this.businessConfiguration.maxHoursUpdate, Validators.required],
        employeeElection: [this.businessConfiguration.employeeElection,Validators.required ]
      })
      return true
    }
    return false
  }

  getBusinessConfiguration() {
    this.managmetService.getBussinesConfiguration().subscribe({
      next: value => {
        this.businessConfiguration = value;
        this.initRegisterFrom()
        this.mostarForm = true
      }, error: err => {
        this.mostarForm = true
        this.initRegisterFrom()
      }
    })
  }

  private initRegisterFrom() {
    if (this.initBusinessExist()) return

    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      logoUrl: [null, Validators.required],
      admin: [this.admin, Validators.required],
      description: [null, Validators.required],
      businessType: [null, Validators.required],
      maxDaysCancellation: [null, Validators.required],
      maxHoursCancellation: [null, Validators.required],
      cancellationSurcharge: [null, Validators.required],
      maxDaysUpdate: [null, Validators.required],
      maxHoursUpdate: [null, Validators.required],
      employeeElection : [null, Validators.required],
    })
  }

  validForm(): boolean {

    if (this.registerForm.value.logoUrl === null) {
      this.registerForm.value.logoUrl = this.businessConfiguration ? this.businessConfiguration.logoUrl : null
    }

    if (!this.registerForm.valid || this.registerForm.value.logoUrl === null) {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Todos los campos son obligatorios",
        icon: "info"
      });
      return false
    }
    return true
  }

  private async uplogadImag(): Promise<void> {
    if (this.registerForm.value.logoUrl !== null && this.registerForm.value.logoUrl !== this.businessConfiguration?.logoUrl) {
      try {
        const value = await this.uploadService.saveImg(this.formData).toPromise(); // Convertimos a Promesa
        this.registerForm.value.logoUrl = value.url;
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir la imagen',
          text: 'Ocurrió un problema al intentar subir la imagen. Por favor, intente de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  }

  async register() {

    if (!this.validForm()) return

    await this.uplogadImag();

    if (this.businessConfiguration) {
      this.managmetService.updateBussinesConfig(this.businessConfiguration.id, this.registerForm.value).subscribe({
        next: value => {
          this.businessConfiguration = value
          this.msgOK()
        }, error: err => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la configuración',
            text: 'Ocurrió un problema al intentar actualizar la configuración del negocio. Por favor, intente de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      })
    } else {
      this.managmetService.createBussinesConfig(this.registerForm.value).subscribe({
        next: value => {
          this.businessConfiguration = value
          this.msgOK()
        }, error: err => {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear la configuración',
            text: 'Ocurrió un problema al intentar crear la configuración del negocio. Por favor, intente de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      })
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('file', this.file, this.file.name);
    }
  }

  msgOK() {
    Swal.fire({
      title: "Proceso terminado con Exito",
      text: "Los cambios de la empresa se han actuilzado con exit.",
      icon: "success"
    });
  }

}
