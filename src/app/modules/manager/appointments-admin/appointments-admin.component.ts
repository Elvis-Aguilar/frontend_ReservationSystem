import { Component, inject } from '@angular/core';
import { AppointmentDto } from '../../common-user/utils/models/appointment.dto';
import { ServiceService } from '../utils/services/service.service';
import { EmployeeService } from '../../common-user/utils/services/employe.service';
import { AppointmentService } from '../../common-user/utils/services/appointment.service';
import { UserService } from '../utils/services/user.service';
import { ServiceDto } from '../utils/models/service.dto';
import { employeDto } from '../../common-user/utils/models/employes.dto';
import { appointmentReportDto } from '../utils/models/appointment.dto';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { ManagmentService } from '../utils/services/managment.service';
import { BusinessConfigurationDto } from '../utils/models/business-congifuration.dto';

@Component({
  selector: 'app-appointments-admin',
  standalone: true,
  imports: [],
  templateUrl: './appointments-admin.component.html',
  styleUrl: './appointments-admin.component.scss'
})
export class AppointmentsAdminComponent {

  appointments: AppointmentDto[] = []
  services: ServiceDto[] = [];
  employee: employeDto[] = []
  customers: employeDto[] = []
  appointmenReports: appointmentReportDto[] = []
  role = ''
  id = 1
  dropdownStates: boolean[] = [];
  businessConfiguration!: BusinessConfigurationDto


  private readonly serviceService = inject(ServiceService)
  private readonly employeService = inject(EmployeeService)
  private readonly appointmentService = inject(AppointmentService)
  private readonly userService = inject(UserService)
  private readonly managmetService = inject(ManagmentService)

  async ngOnInit() {
    this.id = JSON.parse(localStorage.getItem("session") || "{'id': ''}").id
    this.role = JSON.parse(localStorage.getItem("session") || "{'role': ''}").role
    await this.getEmployees();
    await this.getServices();
    await this.getAllAppointment();
    await this.getCustomers()
    await this.getBusinessConfiguration();
    this.prepararAppointmesReport();
  }

  getAllAppointment(): Promise<void> {
    return new Promise((resolve) => {
      this.appointmentService.getAllAppointment().subscribe({
        next: value => {
          this.appointments = value;
          resolve();
        }
      });
    });
  }

  getServices(): Promise<void> {
    return new Promise((resolve) => {
      this.serviceService.getServicesAvailable().subscribe({
        next: value => {
          this.services = value;
          resolve();
        }
      });
    });
  }

  getEmployees(): Promise<void> {
    return new Promise((resolve) => {
      this.employeService.getEmployeesExcluding().subscribe({
        next: value => {
          this.employee = value;
          resolve();
        }
      });
    });
  }

  getCustomers(): Promise<void> {
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

  async completed(id: number) {
    Swal.fire({
      title: "Esta seguro de Marcar como Completada la cita?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si, continuar",
      denyButtonText: `No, cancelar!`
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          await firstValueFrom(this.appointmentService.completed(id));
          this.msgOK()
          this.appointmenReports = [];
          await this.getAllAppointment();
          this.prepararAppointmesReport();
        } catch (error) {
          this.msgOKSinFactura()
          console.log(error);
          this.appointmenReports = [];
          await this.getAllAppointment();
          this.prepararAppointmesReport();
          console.error('Error al completar la cita:', error);
        }
      } else if (result.isDenied) {
        Swal.fire("No se realizo ninguan accions", "", "info");
      }
    });
  }


  async canceled(id: number) {
    Swal.fire({
      title: "Esta seguro de Marcar como Cancelada la cita?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si, continuar",
      denyButtonText: `No, cancelar!`
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          await firstValueFrom(this.appointmentService.canceled(id));
          this.msgOKCanceled()
          this.appointmenReports = [];
          await this.getAllAppointment();
          this.prepararAppointmesReport();
        } catch (error) {
          this.msgOKSinNotifi()
          console.log(error);
          this.appointmenReports = [];
          await this.getAllAppointment();
          this.prepararAppointmesReport();
          console.error('Error al completar la cita:', error);
        }
      } else if (result.isDenied) {
        Swal.fire("No se realizo ninguan accions", "", "info");
      }
    });

  }


  getDateOnly(dateTime: string): string {
    return dateTime.split("T")[0];
  }

  getTimeOnly(dateTime: string): string {
    return dateTime.split("T")[1];
  }

  findCustormer(id: number): string {
    return this.customers.find(cus => cus.id === id)?.name || ''
  }

  findEmployee(id: number): string {
    return this.employee.find(cus => cus.id === id)?.name || ''
  }

  findService(id: number): ServiceDto | undefined {
    return this.services.find(cus => cus.id === id)
  }

  traducirEstad(estad: string): string {
    switch (estad) {
      case 'RESERVED':
        return 'RESERVADO'
      case 'COMPLETED':
        return 'COMPLETADO'
      case 'CANCELED':
        return 'CANCELED'
      default:
        return 'RESERVADO'

    }
  }


  toggleDropdown(index: number) {
    // Solo abre el dropdown correspondiente y cierra los demás
    this.dropdownStates = this.dropdownStates.map((state, i) => (i === index ? !state : false));
  }

  calculoPrice(appoin: AppointmentDto, price: number): number {

    if (appoin.fine === undefined) return price;

    return appoin.fine ? (this.businessConfiguration.cancellationSurcharge + price) : price
  }

  prepararAppointmesReport() {
    if (this.role === 'ADMIN') {
      this.appointments.forEach(app => {
        const service = this.findService(app.service)
        this.appointmenReports.push({
          fecha: this.getDateOnly(app.startDate),
          horaInicio: this.getTimeOnly(app.startDate),
          cliente: this.findCustormer(app.customer),
          estado: this.traducirEstad(app.status),
          servicio: service?.name || '',
          empleado: this.findEmployee(app.employeeId),
          appointment: app,
          price: this.calculoPrice(app, service?.price || 1)
        })
      })
    } else {
      this.appointments.forEach(app => {
        if (app.employeeId === this.id) {
          const service = this.findService(app.service)
          this.appointmenReports.push({
            fecha: this.getDateOnly(app.startDate),
            horaInicio: this.getTimeOnly(app.startDate),
            cliente: this.findCustormer(app.customer),
            estado: this.traducirEstad(app.status),
            servicio: service?.name || '',
            empleado: this.findEmployee(app.employeeId),
            appointment: app,
            price: this.calculoPrice(app, service?.price || 1)
          })
        }
      })
    }
    this.dropdownStates = Array(this.appointmenReports.length).fill(false);
  }

  msgOK() {
    Swal.fire({
      title: "Proceso completado",
      text: "La cita se a marcado como completado y se le envio la factura con exito!",
      icon: "success"
    });
  }

  msgOKCanceled() {
    Swal.fire({
      title: "Proceso completado",
      text: "La cita se a marcado como Cancelada y se le envio la notificacion al correo del usuario!",
      icon: "info"
    });
  }

  msgOKSinNotifi() {
    Swal.fire({
      title: "Proceso completado",
      text: "La cita se a marcado como Cancelada y No se le envio la notificacion al correo del usuario!",
      icon: "info"
    });
  }

  msgOKSinFactura() {
    Swal.fire({
      title: "Proceso completado",
      text: "La cita se a marcado como completado, pero no se pudo enviar la factura, la podra ver desde la pagina!",
      icon: "info"
    });
  }

}
