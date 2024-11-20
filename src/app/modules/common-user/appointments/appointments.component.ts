import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { createCalendar, viewDay, viewMonthAgenda, viewMonthGrid, viewWeek, createViewWeek, CalendarEvent } from '@schedule-x/calendar'
import { CalendarComponent } from "@schedule-x/angular";
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'
import { BusinessHour } from '../../manager/utils/models/business-hours.dto';
import { BusinessHoursService } from '../../manager/utils/services/business-hours.service';
import { firstValueFrom } from 'rxjs';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ServiceService } from '../../manager/utils/services/service.service';
import { ServiceDto } from '../../manager/utils/models/service.dto';
import { ManagmentService } from '../../manager/utils/services/managment.service';
import { BusinessConfigurationDto } from '../../manager/utils/models/business-congifuration.dto';
import { employe, employeDto } from '../utils/models/employes.dto';
import { EmployeeService } from '../utils/services/employe.service';
import { UserService } from '../../manager/utils/services/user.service';
import { UserDto } from '../../manager/utils/models/user.dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import Swal from 'sweetalert2';
import { AppointmentService } from '../utils/services/appointment.service';
import { AppointmentDto } from '../utils/models/appointment.dto';
import { CallaboratorService } from '../../manager/utils/services/callaborator.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {


  appointments: AppointmentDto[] = []
  businessHours: BusinessHour[] = []
  specialDays: BusinessHour[] = []
  services: ServiceDto[] = [];
  employee: employe[] = []
  businessConfiguration!: BusinessConfigurationDto
  serviceTmp!: ServiceDto | undefined;

  title = 'angular-example';
  isModalOpen = false;
  isModalOpen2 = false;
  id: number = 1

  userDto!: UserDto;
  calendar: any;
  events: CalendarEvent[] = [];

  registerForm!: FormGroup;
  calendarControls: any;

  horasAtencion = '00:00 - 00:00'
  montoPreliminar = ''

  titleCalendar = 'Calendario General'

  imagenAux = 'https://res.cloudinary.com/ddkp3bobz/image/upload/v1732054787/periflFake_srsq5b.webp'

  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;


  private readonly businessHoursService = inject(BusinessHoursService)
  private readonly serviceService = inject(ServiceService)
  private readonly managmetService = inject(ManagmentService)
  private readonly employeService = inject(EmployeeService)
  private readonly userService = inject(UserService)
  private readonly appointmentService = inject(AppointmentService)
  private readonly collaboratorService = inject(CallaboratorService)


  constructor(private formBuilder: FormBuilder) {
    this.getBusinessConfiguration()
    this.calendarControls = createCalendarControlsPlugin()
  }

  ngOnInit() {
    this.id = JSON.parse(localStorage.getItem("session") || "{'id': ''}").id
    this.getMe()
    this.getEmployees()
    this.getServices()
    this.initializeCalendar()
    this.initializeBusinessHoursAndSpecialDays()
  }

  async initializeBusinessHoursAndSpecialDays() {
    await this.getBussinesGeneral();
    await this.getAllSpecificDate();
    await this.addClosedEventsForWeekends();
    this.addEventSpeficiDay()
    this.initForm()
  }

  getRandomEmployee(): employeDto | undefined {
    if (this.employee.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * this.employee.length);
    return this.employee[randomIndex];
  }

  obtenerDiaDeLaSemana(fecha: string): string {
    const diasSemana = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    // Convertir la cadena en un objeto Date
    const dateObj = new Date(fecha);

    // Obtener el índice del día de la semana
    const diaSemanaIndex = dateObj.getDay();

    // Devolver el nombre del día en mayúsculas
    return diasSemana[diaSemanaIndex];
  }

  calcularEndDate(startDate: string, duration: string): string {

    // Dividir startDate en horas y minutos
    const [startHours, startMinutes] = startDate.split(':').map(Number);

    // Dividir duration en horas, minutos y segundos
    const [durationHours, durationMinutes] = duration.split(':').map(Number);

    // Crear un objeto Date para la hora de inicio
    const fechaInicio = new Date();
    fechaInicio.setHours(startHours);
    fechaInicio.setMinutes(startMinutes);

    // Añadir la duración a la fecha de inicio
    fechaInicio.setHours(fechaInicio.getHours() + durationHours);
    fechaInicio.setMinutes(fechaInicio.getMinutes() + durationMinutes);

    // Obtener el nuevo tiempo (hora y minutos)
    const horasFinales = fechaInicio.getHours().toString().padStart(2, '0');
    const minutosFinales = fechaInicio.getMinutes().toString().padStart(2, '0');

    // Devolver el resultado en formato HH:MM
    return `${horasFinales}:${minutosFinales}`;
  }

  formatearFechaParaBackend(fecha: string, hora: string): string {
    // Simplemente concatenamos la fecha con la hora en el formato esperado
    const formattedDateTime = `${fecha}T${hora}:00`;

    return formattedDateTime;  // Retorna 'YYYY-MM-DDTHH:MM:SS'
  }

  register() {

    const date = this.calendarControls.getDate()

    let endDate = this.calcularEndDate(this.registerForm.value.startDate, this.serviceTmp?.duration || '')

    const startDate = this.formatearFechaParaBackend(date, this.registerForm.value.startDate)

    endDate = this.formatearFechaParaBackend(date, endDate)

    this.registerForm.value.endDate = endDate
    this.registerForm.value.startDate = startDate
    this.registerForm.value.service = Number(this.registerForm.value.service)

    //validar si   se puede elegir empleado o hacerlo random
    if (!this.businessConfiguration.employeeElection) {
      this.registerForm.value.employeeId = Number(this.getRandomEmployee()?.id || 1)
    } else {
      this.registerForm.value.employeeId = Number(this.registerForm.value.employeeId)
    }

    //TODO: hacer resto de validaciones, como no escoger una hora fuera del horario del dia permitido

    //listo para enviar
    this.appointmentService.createAppoinment(this.registerForm.value).subscribe({
      next: value => {
        this.msgOK()
        this.getAllAppointment()
        this.closeModal()
      },
      error: err => {
        this.msgError()
        this.closeModal()
      }
    })
  }

  async getBussinesGeneral(): Promise<void> {
    return firstValueFrom(this.businessHoursService.getBussinesConfiguration())
      .then(value => {
        this.businessHours = value;
      });
  }

  async getAllSpecificDate(): Promise<void> {
    return firstValueFrom(this.businessHoursService.getHoursBusinessSpecificDate())
      .then(value => {
        this.specialDays = value;
      });
  }

  getServices() {
    // Obtener los servicios disponibles
    this.serviceService.getServicesAvailable().subscribe({
      next: value => {
        this.services = value;
      }
    });
  }

  getBusinessConfiguration() {
    this.managmetService.getBussinesConfiguration().subscribe({
      next: value => {
        this.businessConfiguration = value;
      }, error: err => {
      }
    })
  }

  getEmployees() {
    this.employeService.getEmployeesExcluding().subscribe({
      next: value => {
        this.obtenerProfecionales(value)
      }
    })
  }

  //limpiar a los profecianels con permisos de gestionar citas!!
  async obtenerProfecionales(empl: employeDto[]) {
    // Creamos promesas para cada empleado y esperamos que todas se resuelvan
    const promises = empl.map(async emp => {
      const permissions = await this.collaboratorService.getRolePermissionsUserId(emp.id).toPromise();
      const citasPermiso = permissions?.find(permiss => permiss.name === 'CITAS');
      if (citasPermiso) {
        this.employee.push({
          ...emp,
          permissions: permissions || []
        });
      }
    });

    // Esperamos que todas las promesas se completen
    await Promise.all(promises);

    // Ahora ejecutamos `getAllAppointment` después de terminar el procesamiento
    this.getAllAppointment();
  }


  getCorrelativoNumber(dayOfWeek: string): number {
    switch (dayOfWeek) {
      case 'MONDAY':
        return 1;
      case 'TUESDAY':
        return 2;
      case 'WEDNESDAY':
        return 3;
      case 'THURSDAY':
        return 4;
      case 'FRIDAY':
        return 5;
      case 'SATURDAY':
        return 6;
      case 'SUNDAY':
        return 0;
      default:
        return 0;
    }
  }

  isClosed(dayOfWeek: number): boolean {
    for (let index = 0; index < this.businessHours.length; index++) {
      if (this.businessHours[index].status === 'UNAVAILABLE' && this.getCorrelativoNumber(this.businessHours[index].dayOfWeek) === dayOfWeek) {
        return true
      }
    }
    return false;
  }

  getMe() {
    this.userService.getById(Number(this.id)).subscribe({
      next: value => {
        this.userDto = value;
      }
    })
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      customer: [this.userDto.id],
      service: [null, Validators.required],
      employeeId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      status: ['RESERVED'],
      paymentMethod: [null, Validators.required]
    })
  }

  // Método para generar eventos "Cerrado" los fines de semana
  async addClosedEventsForWeekends(): Promise<void> {
    const startYear = 2024;
    const endYear = 2024;  // Puedes ajustar este rango según lo necesites

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          const dayOfWeek = currentDate.getDay();  // 0 = Domingo, 6 = Sábado

          if (this.isClosed(dayOfWeek)) {
            const formattedDate = currentDate.toISOString().split('T')[0];  // yyyy-mm-dd

            this.calendar.eventsService.add({
              id: this.id++,
              title: 'Cerrado',
              start: `${formattedDate} 00:00`,
              end: `${formattedDate} 23:59`,
              allDay: true,
              calendarId: 'leisure'
            })

          }
        }
      }
    }
  }

  addEventSpeficiDay() {
    this.specialDays.forEach(specifi => {
      if (specifi.status === "UNAVAILABLE" && specifi.specificDate) {
        const formattedDate = specifi.specificDate.split('T')[0]; // Formateamos la fecha como yyyy-mm-dd.

        // Agregamos el evento de día cerrado al calendario.
        this.calendar.eventsService.add({
          id: this.id++,
          title: 'Cerrado',
          start: `${formattedDate} 00:00`,
          end: `${formattedDate} 23:59`,
          allDay: true,
          calendarId: 'leisure'
        });
      }
    });
  }

  // Inicializar el calendario
  initializeCalendar() {
    const eventsServicePlugin = createEventsServicePlugin();
    this.calendar = createCalendar({
      events: [
      ],
      calendars: {
        leisure: {
          colorName: 'leisure',
          lightColors: {
            main: '#fd2f02',
            container: '#ec7a61',
            onContainer: '#002859',
          },
          darkColors: {
            main: '#c0dfff',
            onContainer: '#dee6ff',
            container: '#426aa2',
          },
        },
        oter: {
          colorName: 'oter',
          lightColors: {
            main: '#2ecc71',        // Verde principal
            container: '#a3e4d7',   // Color de fondo más suave
            onContainer: '#145a32', // Color de texto en el fondo suave
          },
          darkColors: {
            main: '#27ae60',        // Verde oscuro
            onContainer: '#d1f2eb', // Color de texto en el fondo oscuro
            container: '#196f3d',   // Color de fondo oscuro
          },
        },
      },
      locale: 'es-ES',
      views: [createViewWeek(), viewDay, viewMonthGrid, viewMonthAgenda],
      plugins: [eventsServicePlugin, createEventModalPlugin(), this.calendarControls],
    });
  }

  dayAvaible(dayOfWeek: string): BusinessHour | null {
    const day = this.businessHours.find(bus => bus.dayOfWeek === dayOfWeek)
    if (day?.status === 'AVAILABLE') {
      return day
    }
    return null;
  }

  claclMontoPreliminar() {
    const id = this.registerForm.value.service
    this.serviceTmp = this.services.find(ser => ser.id === Number(id));
    this.montoPreliminar = this.serviceTmp?.price.toString() || ''
  }

  openModal() {
    const day = this.obtenerDiaDeLaSemana(this.calendarControls.getDate())
    const dayVerif = this.dayAvaible(day)
    if (dayVerif) {
      this.horasAtencion = `${dayVerif.openingTime} - ${dayVerif.closingTime}`
      this.isModalOpen = true;
    } else {
      this.msgNotAvailabe();
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal2() {
    this.isModalOpen2 = true;
  }
  closeModal2() {
    this.isModalOpen2 = false;
  }

  formatDateTime(dateTime: string): string {
    // Primero, dividimos la fecha y la hora en dos partes: fecha y hora
    const [date, time] = dateTime.split('T');

    // Dividimos la parte de la hora por los segundos y tomamos solo los primeros 5 caracteres (HH:mm)
    const formattedTime = time.substring(0, 5);

    // Devolvemos la fecha y la hora en el formato deseado
    return `${date} ${formattedTime}`;
  }

  getEmpleado(id: number): string {
    const restult = this.employee.find(emp => emp.id === id)?.name || ''
    return restult;
  }

  addEventesReservationsCalendar() {
    this.appointments.forEach(appoin => {
      if (appoin.customer === this.userDto.id) {
        this.calendar.eventsService.add({
          id: this.id++,
          title: 'MI RESERVACION',
          description: `Este horario esta reservado. Empleado que atendera: ${this.getEmpleado(appoin.employeeId)}`,
          start: `${this.formatDateTime(appoin.startDate)}`,
          end: `${this.formatDateTime(appoin.endDate)}`,
          allDay: true,
          idEmploye: appoin.employeeId
        })
      } else {
        this.calendar.eventsService.add({
          id: this.id++,
          title: 'RESERVADO',
          description: `Este horario esta reservado. Empleado que atendera: ${this.getEmpleado(appoin.employeeId)}`,
          start: `${this.formatDateTime(appoin.startDate)}`,
          end: `${this.formatDateTime(appoin.endDate)}`,
          allDay: true,
          idEmploye: appoin.employeeId,
          calendarId: 'oter'
        })
      }
    })
  }

  getAllAppointment() {
    this.appointmentService.getAllAppointment().subscribe({
      next: value => {
        this.appointments = value;
        this.addEventesReservationsCalendar()
      }
    })
  }

  msgNotAvailabe() {
    Swal.fire({
      title: "Upss",
      text: "No es posible apartar esta fecha",
      icon: "info"
    });
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
      icon: "question"
    });
  }

  traducirDia(day: string): string {
    switch (day.toUpperCase()) { // Convertir a mayúsculas para asegurar coincidencia
      case 'MONDAY':
        return 'Lunes';
      case 'TUESDAY':
        return 'Martes';
      case 'WEDNESDAY':
        return 'Miércoles';
      case 'THURSDAY':
        return 'Jueves';
      case 'FRIDAY':
        return 'Viernes';
      case 'SATURDAY':
        return 'Sábado';
      case 'SUNDAY':
        return 'Domingo';
      default:
        return 'Día no válido'; // Para manejar errores
    }
  }


  getImagenProfesional(imag: string): string {
    if (imag === null) {
      return this.imagenAux
    }
    return imag
  }


  scrollLeft() {
    const container = this.carouselContainer.nativeElement;
    container.scrollBy({ left: -container.offsetWidth / 4, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.carouselContainer.nativeElement;
    container.scrollBy({ left: container.offsetWidth / 4, behavior: 'smooth' });
  }

  async calendarioEmpleado(empleadoId: number, name:string): Promise<void> {
    const eventos: Array<any> = this.calendar.eventsService.getAll();
  
    if (!eventos) {
      return;
    }
  
    // Elimina eventos existentes y espera a que termine
    await this.eliminarEventosAsync(eventos);
  
    // Agrega nuevos eventos basados en las citas
    this.agregarEventos(empleadoId);
    this.titleCalendar = `Calendario del Profesional -> ${name}`
  }
  
  private async eliminarEventosAsync(eventos: Array<any>): Promise<void> {
    for (const evento of eventos) {
      if (evento.idEmploye) {
        await this.calendar.eventsService.remove(evento.id); // Asegúrate de que `remove` sea una función asíncrona
      }
    }
  }
  
  private agregarEventos(empleadoId: number): void {
    for (const appointment of this.appointments) {
      if (appointment.employeeId !== empleadoId) {
        continue;
      }
  
      const isUserReservation = appointment.customer === this.userDto.id;
  
      this.calendar.eventsService.add({
        id: this.id++,
        title: isUserReservation ? 'MI RESERVACION' : 'RESERVADO',
        description: `Este horario está reservado. Empleado que atenderá: ${this.getEmpleado(appointment.employeeId)}`,
        start: this.formatDateTime(appointment.startDate),
        end: this.formatDateTime(appointment.endDate),
        allDay: true,
        idEmploye: appointment.employeeId,
        calendarId: isUserReservation ? undefined : 'oter'
      });
    }
  }
  

}
