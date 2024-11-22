import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../utils/services/appointment.service';
import { BusinessHoursService } from '../../../manager/utils/services/business-hours.service';
import { BusinessHour, UserHoursDto } from '../../../manager/utils/models/business-hours.dto';
import { ServiceService } from '../../../manager/utils/services/service.service';
import { ServiceDto } from '../../../manager/utils/models/service.dto';
import { AppointmentDto } from '../../utils/models/appointment.dto';
import { AvailableSlots } from '../utils/interfaces/avaiableBloks';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-select-hour',
  standalone: true,
  imports: [],
  templateUrl: './select-hour.component.html',
  styleUrl: './select-hour.component.scss'
})
export class SelectHourComponent {
  availableSlots: AvailableSlots[] = [];

  nameService = 'Seleccionar servicio'
  employessHours: UserHoursDto[] = []
  service!: ServiceDto
  appointments: AppointmentDto[] = []
  businessHours: BusinessHour | undefined

  readonly appointmentService = inject(AppointmentService)
  private readonly router = inject(Router)
  private readonly businessHoursService = inject(BusinessHoursService)
  private readonly serviceService = inject(ServiceService)

  constructor() { }

  async ngOnInit() {
    await this.loadInitialData();
    //logica de dividir los bloques
    if (!this.businessHours) {
      return
    }
    this.generateTimeBlocks(this.businessHours.openingTime, this.businessHours.closingTime, this.service.duration)
  }

  private async loadInitialData() {
    try {
      await this.getServiceById();
      await this.getAppoinmentsByEmployeeId();
      await this.getBussinesGeneral()
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  generateTimeBlocks(openingTime: string, closingTime: string, duration: string) {
    // Convertir las horas a minutos
    const [openHours, openMinutes] = openingTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closingTime.split(':').map(Number);
    const [durationHours, durationMinutes] = duration.split(':').map(Number);

    const openTimeInMinutes = openHours * 60 + openMinutes;
    const closeTimeInMinutes = closeHours * 60 + closeMinutes;
    const durationInMinutes = durationHours * 60 + durationMinutes;

    let currentStartTime = openTimeInMinutes;

    // Generar bloques
    while (currentStartTime <= closeTimeInMinutes) {
      const currentEndTime = currentStartTime + durationInMinutes;

      const startHours = Math.floor(currentStartTime / 60);
      const startMinutes = currentStartTime % 60;
      const endHours = Math.floor(currentEndTime / 60);
      const endMinutes = currentEndTime % 60;

      const slot: AvailableSlots = {
        start: `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`,
        end: `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
        disponible: false
      }

      //compobar si esta disponible o no
      slot.disponible = this.disponible(slot)

      this.availableSlots.push(slot);

      // Incrementar el tiempo para el siguiente bloque
      currentStartTime = currentEndTime + 1; // Un minuto de descanso entre bloques
    }

  }

  disponible(slot: AvailableSlots): boolean {
    const slotStart = this.timeToMinutes(slot.start);
    const slotEnd = this.timeToMinutes(slot.end);
  
    for (let appointment of this.appointments) {
      console.log(appointment);
  
      // Extraer las horas y minutos directamente del formato ISO 8601
      const appointmentStart = this.timeToMinutes(appointment.startDate.split('T')[1].slice(0, 5));
      const appointmentEnd = this.timeToMinutes(appointment.endDate.split('T')[1].slice(0, 5));
  
      // Verificar si el bloque se solapa con la reserva
      if (appointmentStart < slotEnd && appointmentEnd > slotStart) {
        return false; // No disponible
      }
    }
  
    return true; // Disponible
  }
  
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
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

  async getAppoinmentsByEmployeeId(): Promise<void> {
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    if (!this.appointmentService.appoinmentTemp?.employeeId) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.appointmentService.getAllAppointmentByEmployeeId(this.appointmentService.appoinmentTemp?.employeeId || 1).subscribe({
        next: value => {
          this.limpiarAppointmens(value)
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

  async getBussinesGeneral(): Promise<void> {
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    return new Promise((resolve, reject) => {
      this.businessHoursService.getBussinesConfiguration().subscribe({
        next: value => {
          this.businessHours = value.find(va => va.id === this.appointmentService.appoinmentTemp?.hoursId)
          resolve();
        },
        error: err => reject(err)
      })
    })

  }

  private limpiarAppointmens(appointments: AppointmentDto[]) {
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    const day = this.appointmentService.appoinmentTemp?.day || ''
    appointments.forEach(app => {
      const date = app.startDate.split('T')[0]
      if (date === day) {
        this.appointments.push(app)
      }
    })
  }

  chooseSlot(slot: AvailableSlots) {
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    this.appointmentService.appoinmentTemp.startDate = slot.start
    this.appointmentService.appoinmentTemp.endDate = slot.end
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Horal elegida con exito!",
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/user/citas/resumen'])
  }
}
