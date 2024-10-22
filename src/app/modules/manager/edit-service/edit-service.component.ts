import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessConfigurationDto } from '../utils/models/business-congifuration.dto';
import { ManagmentService } from '../utils/services/managment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadImgService } from '../../../config/services/upload-img.service';
import { ServiceService } from '../utils/services/service.service';
import { ServiceDto } from '../utils/models/service.dto';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent implements OnInit {

  file!: File
  formData!: FormData

  registerForm!: FormGroup;

  businessConfiguration!: BusinessConfigurationDto

  private readonly managmetService = inject(ManagmentService)
  private readonly uploadService = inject(UploadImgService)
  private readonly serviceService = inject(ServiceService)
  private readonly router = inject(Router)

  action: string = '';
  serviceDto!: ServiceDto

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.action = params['action'];

      if (this.action === 'edit') {
        this.loadService(params['id']);
      }
    });
    this.initRegisterFrom()
    this.getBusinessConfiguration()
  }


  validForm(): boolean {
    if (!this.registerForm.valid) {
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
    if (this.formData) {
      try {
        const value = await this.uploadService.saveImg(this.formData).toPromise(); // Convertimos a Promesa
        this.registerForm.value.imageUrl = value.url;
      } catch (err) {
        console.error('Error al subir la imagen: ', err);
        // TODO: manejar errores, por ejemplo, mostrar un mensaje de "intente de nuevo"
      }
    }
  }

  loadService(id: string) {
    // Cargar el servicio :v
  }

  async register() {
    if (!this.validForm()) return

    await this.uplogadImag()

    this.serviceService.createBussinesConfig(this.registerForm.value).subscribe({
      next: value => {
        this.serviceDto = value
        this.msgOK()
        this.router.navigate(['manager/servicios'])
      },
      error: err => {
        //TODO: manejo de errores, error al crear axdxd
        console.log(err);
      }
    })

  }

  updateService() {

  }

  deleteService() {

  }

  private initRegisterFrom() {

    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      duration: [null, Validators.required],
      status: [null, Validators.required],
      location: [null],
      peopleReaches: [null],
      imageUrl: [null],
    })
  }

  getBusinessConfiguration() {
    this.managmetService.getBussinesConfiguration().subscribe({
      next: value => {
        this.businessConfiguration = value;
      }, error: err => {
      }
    })
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('file', this.file, this.file.name);
      this.registerForm.value.imageUrl = 'adfafasdf'
    }
  }

  msgOK() {
    Swal.fire({
      title: "Proceso terminado con Exito",
      text: "Servicio creado con Exito!",
      icon: "success"
    });
  }


}
