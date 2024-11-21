import { Component, inject } from '@angular/core';
import { AppointmentService } from '../../utils/services/appointment.service';
import { Router } from '@angular/router';
import { ServiceService } from '../../../manager/utils/services/service.service';
import { ServiceDto } from '../../../manager/utils/models/service.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services-election',
  standalone: true,
  imports: [],
  templateUrl: './services-election.component.html',
  styleUrl: './services-election.component.scss'
})
export class ServicesElectionComponent {

  id: number = 1
  services: ServiceDto[] = [];
  nameService = 'Seleccionar servicio'

  readonly appointmentService = inject(AppointmentService)
  private readonly router = inject(Router)
  private readonly serviceService = inject(ServiceService)



  ngOnInit() {
    this.id = JSON.parse(localStorage.getItem("session") || "{'id': ''}").id
    this.getServices()
  }

  validarPasos(){
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    if (this.appointmentService.appoinmentTemp.service) {
      const servi = this.services.find(ser => ser.id === this.appointmentService.appoinmentTemp?.service)
      this.nameService = servi?.name || 'Seleccionar servicio'
    }
  }



  getServices() {
    // Obtener los servicios disponibles
    this.serviceService.getServicesAvailable().subscribe({
      next: value => {
        this.services = value;
        this.validarPasos()
      }
    });
  }

  goBack(){
    this.router.navigate(['/user/citas'])
  }

  cancel(){
    this.appointmentService.appoinmentTemp = null
    this.router.navigate(['/user/citas'])
  }

  elegir(serviceId: number, name:string){
    this.appointmentService.appoinmentTemp = {service:serviceId}
    this.nameService = name
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Servicio elegido exitosamente",
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/user/citas/day'])

  }

  goSiguiente(){
    if (this.nameService === 'Seleccionar servicio') {
      Swal.fire({
        title: "Sin Servicio?",
        text: "Aun no has elegido un servicio",
        icon: "info"
      });
      return
      
    }
    this.router.navigate(['/user/citas/day'])
  }
}
