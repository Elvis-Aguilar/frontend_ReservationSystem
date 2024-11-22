import { Component, inject } from '@angular/core';
import { AppointmentService } from '../../utils/services/appointment.service';
import { Router } from '@angular/router';
import { ServiceService } from '../../../manager/utils/services/service.service';
import { UserService } from '../../../manager/utils/services/user.service';
import { UserDto } from '../../../manager/utils/models/user.dto';
import { ServiceDto } from '../../../manager/utils/models/service.dto';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SendAppointmentCreateDto } from '../../utils/models/appointment.dto';


@Component({
  selector: 'app-resumen-confirm',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resumen-confirm.component.html',
  styleUrl: './resumen-confirm.component.scss'
})
export class ResumenConfirmComponent {

  id: number = 1
  userDto!: UserDto;
  employe!: UserDto;
  service!: ServiceDto;
  metodPay = 'CASH'
  mostrarHtml = false



  readonly appointmentService = inject(AppointmentService)
  private readonly router = inject(Router)
  private readonly serviceService = inject(ServiceService)
  private readonly userService = inject(UserService)



  async ngOnInit() {
    await this.inicilizar()
    this.mostrarHtml = true
  }

  async inicilizar() {
    try {
      this.id = JSON.parse(localStorage.getItem("session") || "{'id': ''}").id;

      // Realizar todas las llamadas asincrónicas
      await this.getMe();
      await this.getEmploy();
      await this.getServiceById();
    } catch (error) {
      console.error("Error durante la inicialización:", error);
    }
  }

  getMe(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getById(Number(this.id)).subscribe({
        next: value => {
          this.userDto = value;
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

  getEmploy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.appointmentService.appoinmentTemp?.employeeId) {
        resolve(); // No hay empleado, resolver la promesa sin hacer nada.
        return;
      }

      const idEmploye: number = Number(this.appointmentService.appoinmentTemp.employeeId);
      this.userService.getById(idEmploye).subscribe({
        next: value => {
          this.employe = value;
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

  async getServiceById(): Promise<void> {
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    if (!this.appointmentService.appoinmentTemp?.service) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.serviceService.getServiceById(this.appointmentService.appoinmentTemp?.service || 1).subscribe({
        next: value => {
          this.service = value;
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

  cancel() {
    this.appointmentService.appoinmentTemp = null
    this.router.navigate(['/user/citas'])
  }

  msgInvalid() {
    Swal.fire({
      title: "Upss!",
      text: "Debe iniciar la reservacion de buena manera",
      icon: "question"
    });
  }

  formatearFechaParaBackend(fecha: string, hora: string): string {
    // Simplemente concatenamos la fecha con la hora en el formato esperado
    const formattedDateTime = `${fecha}T${hora}:00`;

    return formattedDateTime;  // Retorna 'YYYY-MM-DDTHH:MM:SS'
  }


  regiter() {
    if (this.appointmentService.appoinmentTemp === null) {
      this.msgInvalid()
      return
    }
    const startDate = this.formatearFechaParaBackend(this.appointmentService.appoinmentTemp?.day || '', this.appointmentService.appoinmentTemp?.startDate || '')
    const endDate = this.formatearFechaParaBackend(this.appointmentService.appoinmentTemp?.day || '', this.appointmentService.appoinmentTemp?.endDate || '')

    const appoinmenRegister: SendAppointmentCreateDto = {
      customer: this.id,
      employeeId: this.appointmentService.appoinmentTemp.employeeId || 1,
      endDate,
      startDate,
      paymentMethod: this.metodPay,
      status: 'RESERVED',
      service: this.appointmentService.appoinmentTemp?.service || 1
    }

    //listo para enviar 
    
    this.appointmentService.createAppoinment(appoinmenRegister).subscribe({
      next: value => {        
        this.msgOK()
        this.router.navigate(['/user/citas'])
      },
      error: err => {
        this.msgError()
      }
    })
  }

  msgOK() {
    Swal.fire({
      title: "Excelente",
      text: "Su reservacion fue realizada con exito!!",
      icon: "success"
    });
  }

  msgError() {
    Swal.fire({
      title: "Upss!",
      text: "En esta fecha no se puede reservar, intente mas tarde",
      icon: "error"
    });
  }

}
