import { Component, inject } from '@angular/core';
import { CitasChatComponent } from '../citas-chat/citas-chat.component';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../utils/services/service.service';
import { EmployeeService } from '../../../common-user/utils/services/employe.service';
import { AppointmentService } from '../../../common-user/utils/services/appointment.service';
import { UserService } from '../../utils/services/user.service';
import { AppointmentDto } from '../../../common-user/utils/models/appointment.dto';
import { ServiceDto } from '../../utils/models/service.dto';
import { employeDto } from '../../../common-user/utils/models/employes.dto';
import { ManagmentService } from '../../utils/services/managment.service';
import { BusinessConfigurationDto } from '../../utils/models/business-congifuration.dto';
import { CompledCitasChartComponent } from '../compled-citas-chart/compled-citas-chart.component';

@Component({
  selector: 'app-dash-layout',
  standalone: true,
  imports: [CitasChatComponent, FormsModule, CompledCitasChartComponent],
  templateUrl: './dash-layout.component.html',
  styleUrl: './dash-layout.component.scss'
})
export class DashLayoutComponent {

  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  //arreglos para iterar y calcular los valores
  appointments: AppointmentDto[] = []
  services: ServiceDto[] = [];
  employee: employeDto[] = []
  customers: employeDto[] = []
  businessConfiguration!: BusinessConfigurationDto

  //filtros
  mesReport: string
  filterService: number
  filterEmpleado: number

  //tatos cards
  totolIngreso = 0
  totalClientersRegistrados = 0
  totalCitasCompletadas = 0
  topServiceDash = ''
  topEmpleadoDash = ''


  mostrarHtml = false

  private readonly serviceService = inject(ServiceService)
  private readonly employeService = inject(EmployeeService)
  private readonly appointmentService = inject(AppointmentService)
  private readonly userService = inject(UserService)
  private readonly managmetService = inject(ManagmentService)


  constructor() {
    this.filterEmpleado = 0
    this.filterService = 0
    this.mesReport = this.getCurrentMonth()
  }

  async ngOnInit() {
    await this.getEmployees();
    await this.getServices();
    await this.getAllAppointment();
    await this.getCustomers()
    await this.getBusinessConfiguration()
    //listo para calcular elementos del dashboard
    this.generarDatosDashobard()
  }

  private getCurrentMonth(): string {
    const currentDate = new Date();
    return this.months[currentDate.getMonth()];
  }

  getMonthStartAndEnd(): [string, string] {

    // Buscar el índice del mes
    const monthIndex = this.months.indexOf(this.mesReport);
    if (monthIndex === -1) {
      throw new Error("El mes proporcionado no es válido.");
    }

    const year = new Date().getFullYear(); // Año actual
    const startDate = new Date(year, monthIndex, 1); // Primer día del mes
    const endDate = new Date(year, monthIndex + 1, 0); // Último día del mes

    // Convertir a formato YYYY-MM-DD
    const formatDate = (date: Date): string =>
      `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    return [formatDate(startDate), formatDate(endDate)];
  }

  pasaFiltros(appointments: AppointmentDto): boolean {
    this.filterEmpleado = Number(this.filterEmpleado)
    this.filterService = Number(this.filterService)
    if (this.filterEmpleado > 0 && appointments.employeeId !== this.filterEmpleado) {
      return false
    }

    if (this.filterService > 0 && appointments.service !== this.filterService) {
      return false
    }

    return true
  }

  /**apartado para logica de calclos del dashboard */
  calcularTotalIngresos(filterFechas: [string, string]) {
    this.totolIngreso = 0;
    this.totalCitasCompletadas = 0

    const [startFilterDate, endFilterDate] = filterFechas.map(date => new Date(date)); // Convertir fechas a objetos Date

    for (const appoint of this.appointments) {

      if (!this.pasaFiltros(appoint)) {
        continue
      }

      if (appoint.status !== 'COMPLETED') {
        continue
      }

      // Convertir startDate del appointment a objeto Date
      const appointDate = new Date(appoint.startDate.split("T")[0]);


      // Validar si la fecha está dentro del rango
      if (appointDate >= startFilterDate && appointDate <= endFilterDate) {
        // Sumar el precio si la fecha es válida
        this.totolIngreso += this.services.find(servi => servi.id === appoint.service)?.price || 0;
        this.totalCitasCompletadas++
        if (appoint.fine) {
          this.totolIngreso += this.businessConfiguration.cancellationSurcharge
        }
      }
    }
  }

  calcularClientes(filterFechas: [string, string]) {
    //createdAt : "2024-11-07T00:00:00"

    this.totalClientersRegistrados = 0

    const [startFilterDate, endFilterDate] = filterFechas.map(date => new Date(date)); // Convertir fechas a objetos Date

    for (const customer of this.customers) {
      if (!customer.createdAt) {
        continue
      }

      const customerCreatedAt = new Date(customer.createdAt.split("T")[0]);

      if (customerCreatedAt >= startFilterDate && customerCreatedAt <= endFilterDate) {
        this.totalClientersRegistrados++
      }

    }
  }

  calcularTopServicio(filterFechas: [string, string]): void {
    const [startFilterDate, endFilterDate] = filterFechas.map(date => new Date(date)); // Convertir fechas a objetos Date

    const serviceCount: Record<number, number> = {}; // Objeto para contar la frecuencia de cada servicio
    const employeeCount: Record<number, number> = {}; // Objeto para contar la frecuencia de cada empleado

    for (const appoint of this.appointments) {

      // Convertir startDate del appointment a objeto Date
      const appointDate = new Date(appoint.startDate.split("T")[0]);

      // Validar si la fecha está dentro del rango
      if (appointDate >= startFilterDate && appointDate <= endFilterDate) {
        const serviceId = appoint.service;
        const employeId = appoint.employeeId;

        // Incrementar el contador del servicio
        serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;

        // Incrementar el contador del empleado
        employeeCount[employeId] = (employeeCount[employeId] || 0) + 1;
      }
    }

    // Encontrar el servicio con más repeticiones
    let maxCount = 0;
    let topService: number | null = null; // Propiedad para almacenar el servicio más repetido

    for (const [serviceId, count] of Object.entries(serviceCount)) {
      if (count > maxCount) {
        maxCount = count;
        topService = Number(serviceId); // Guardar el servicio más repetido
      }
    }

    // Encontrar el empleado con más repeticiones
    let maxCountEmploye = 0;
    let topEmployee: number | null = null; // Propiedad para almacenar el servicio más repetido

    for (const [employeId, count] of Object.entries(employeeCount)) {
      if (count > maxCountEmploye) {
        maxCountEmploye = count;
        topEmployee = Number(employeId); // Guardar el servicio más repetido
      }
    }

    this.topServiceDash = this.services.find(servi => servi.id === topService)?.name || 'no registros'
    this.topEmpleadoDash = this.employee.find(empl => empl.id === topEmployee)?.name || 'no registros'

  }

  generarDatosDashobard() {
    const filterFechas = this.getMonthStartAndEnd();
    this.calcularTotalIngresos(filterFechas)
    this.calcularClientes(filterFechas)
    this.calcularTopServicio(filterFechas)
    this.mostrarHtml = true
  }

  /** apartado de obtener del backend la info para crear el dasboard*/
  async getEmployees(): Promise<void> {
    return new Promise((resolve) => {
      this.employeService.getEmployeesExcluding().subscribe({
        next: value => {
          this.employee = value;
          resolve();
        }
      });
    });
  }

  async getAllAppointment(): Promise<void> {
    return new Promise((resolve) => {
      this.appointmentService.getAllAppointment().subscribe({
        next: value => {
          this.appointments = value;
          resolve();
        }
      });
    });
  }

  async getServices(): Promise<void> {
    return new Promise((resolve) => {
      this.serviceService.getServicesAvailable().subscribe({
        next: value => {
          this.services = value;
          resolve();
        }
      });
    });
  }

  async getCustomers(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAllCustomers().subscribe({
        next: value => {
          this.customers = value;
          resolve();
        }
      });
    });
  }

  async getBusinessConfiguration(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.managmetService.getBussinesConfiguration().subscribe({
        next: value => {
          this.businessConfiguration = value;
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

}
