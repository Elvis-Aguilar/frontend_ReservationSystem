import { Component, inject } from '@angular/core';
import { ServiceDto } from '../../../manager/utils/models/service.dto';
import { AppointmentService } from '../../utils/services/appointment.service';
import { Router } from '@angular/router';
import { ServiceService } from '../../../manager/utils/services/service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { BusinessHour } from '../../../manager/utils/models/business-hours.dto';
import { BusinessHoursService } from '../../../manager/utils/services/business-hours.service';

@Component({
  selector: 'app-select-day',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-day.component.html',
  styleUrl: './select-day.component.scss'
})
export class SelectDayComponent {

  id: number = 1
  businessHours: BusinessHour[] = []
  nameService = 'Seleccionar servicio'

  selectedDate: Date | null = null;
  currentMonth: Date = new Date();
  calendar: (Date | null)[][] = [];

  readonly appointmentService = inject(AppointmentService)
  private readonly router = inject(Router)
  private readonly businessHoursService = inject(BusinessHoursService)

  ngOnInit() {
    this.getBussinesGeneral()
    this.generateCalendar(this.currentMonth);
  }

  getBussinesGeneral() {
    this.businessHoursService.getBussinesConfiguration().subscribe({
      next: value => {
        this.businessHours = value
      }
    })
  }

  goBack() {
    this.router.navigate(['/user/citas/servicio'])
  }

  cancel() {
    this.appointmentService.appoinmentTemp = null
    this.router.navigate(['/user/citas'])
  }


  goSiguiente() {
    if (!this.appointmentService.appoinmentTemp?.day) {
      Swal.fire({
        title: "Sin Fecha?",
        text: "Aun no has elegido una fecha valida",
        icon: "info"
      });
      return
    }
    this.router.navigate(['/user/citas/personal'])
  }

  generateCalendar(date: Date): void {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    // Rellenar con días vacíos antes del inicio del mes
    for (let i = 0; i < startingDay; i++) {
      week.push(null);
    }

    // Rellenar con los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(new Date(date.getFullYear(), date.getMonth(), day));
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Rellenar la última semana con días vacíos si es necesario
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    this.calendar = calendar; // Actualizar el calendario
  }

  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectDate(date: Date | null) {
    if (!date) return;

    if (this.appointmentService.appoinmentTemp === null) {
      Swal.fire({
        icon: 'question',
        title: 'upss',
        text: 'Debes de elegir primero el servicio',
        confirmButtonText: 'OK',
      });
      return
    }

    const today = new Date();
    // Eliminar la parte de tiempo para comparar solo las fechas
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      Swal.fire({
        icon: 'question',
        title: 'Fecha invalida',
        text: 'No se puede reservar en una fecha pasada',
        confirmButtonText: 'OK',
      });
      return;
    }


    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const selectedDay = daysOfWeek[date.getDay()];

    const hoursBusiness = this.businessHours.find(bus => bus.dayOfWeek === selectedDay)
    if (hoursBusiness && hoursBusiness.status === 'UNAVAILABLE') {
      Swal.fire({
        icon: 'question',
        title: 'Fecha invalida',
        text: 'No se puede rervar en esta fecha, el negocio esta cerrado, consulte el calendario',
        confirmButtonText: 'OK',
      });
      return;
    }

    //TODO:  validar tambien en las fechas especificas 
    this.selectedDate = date;

    this.appointmentService.appoinmentTemp.day = this.formatDateToISO(this.selectedDate)
    this.appointmentService.appoinmentTemp.hoursId = hoursBusiness?.id || 0
  }


  isSelected(date: Date | null): boolean {
    if (!date || !this.selectedDate) return false;
    return (
      date.getFullYear() === this.selectedDate.getFullYear() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getDate() === this.selectedDate.getDate()
    );
  }


  changeMonth(direction: number): void {
    // Cambiar el mes actual
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + direction,
      1
    );
    this.generateCalendar(this.currentMonth); // Regenerar el calendario
  }


}
