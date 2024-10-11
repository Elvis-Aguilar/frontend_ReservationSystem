import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {
  service: any = {
    name: '',
    price: null,
    duration: '',
    description: '',
    people_reaches: null,
    location: '',
    image: null
  };
  onSubmit() {
    console.log('Servicio creado:', this.service);
    // Aquí va la lógica para guardar el servicio
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Procesar el archivo si es necesario
      this.service.image = file;
    }
  }
}
