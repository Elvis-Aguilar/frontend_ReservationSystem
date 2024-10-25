import { ServiceDto } from './../../manager/utils/models/service.dto';
import { ServiceService } from './../../manager/utils/services/service.service';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-detail-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './detail-service.component.html',
  styleUrl: './detail-service.component.scss'
})
export class DetailServiceComponent implements OnInit{
  service: ServiceDto | undefined;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) {}


  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Params:', params);
      const serviceId = Number(params['idservice']);
      console.log('Service ID:', serviceId);
      this.loadService(serviceId);
    });
  }
  
  private loadService(id: number) {
    if (!isNaN(id)) {
      this.serviceService.getServiceById(id).subscribe({
        next: (data) => this.service = data,
        error: (err) => {
          console.error('Error al cargar el servicio', err);
          alert('Error al cargar el servicio. Asegúrate de que el ID sea válido.');
        }
      });
    } else {
      console.error('El ID del servicio no es válido:', id);
    }
  }
}
