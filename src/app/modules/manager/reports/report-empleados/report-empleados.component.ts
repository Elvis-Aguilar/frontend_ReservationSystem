import { Component, inject } from '@angular/core';
import { AppointmentDto } from '../../../common-user/utils/models/appointment.dto';
import { employeDto } from '../../../common-user/utils/models/employes.dto';
import { clienteReportItem, clietnReportSend } from '../../utils/models/clienteReportItems';
import { CancellationSurchargeDto } from '../../utils/models/cancellationDto';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../common-user/utils/services/appointment.service';
import { CancellarionService } from '../../utils/services/cancellarion.service';
import { UserService } from '../../utils/services/user.service';
import { EmployeeService } from '../../../common-user/utils/services/employe.service';

@Component({
  selector: 'app-report-empleados',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-empleados.component.html',
  styleUrl: './report-empleados.component.scss'
})
export class ReportEmpleadosComponent {

  appointments: AppointmentDto[] = []
  employees: employeDto[] = []
  clientReport: clienteReportItem[] = []
  selectedFilter = 'Todos'
  totol = 0
  cancellarions: CancellationSurchargeDto[] = []

  startDate = '2000-01-01';
  endDate = '2099-12-31';


  private readonly appointmentService = inject(AppointmentService)
  private readonly cancellationService = inject(CancellarionService)
  private readonly employeService = inject(EmployeeService)
  private readonly userService = inject(UserService)


  async ngOnInit() {
    await this.getAllAppointment();
    await this.getEmployees()
    await this.getAllCancellarion()
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

  getAllCancellarion(): Promise<void> {
    return new Promise((resolve) => {
      this.cancellationService.getAllCancellation().subscribe({
        next: value => {
          this.cancellarions = value;
          resolve();
        }
      });
    });
  }


  getEmployees(): Promise<void> {
    return new Promise((resolve) => {
      this.employeService.getEmployeesExcluding().subscribe({
        next: value => {
          this.employees = value;
          resolve();
        }
      });
    });
  }

  getDateOnly(dateTime: string): string {
    return dateTime.split("T")[0];
  }

  getTimeOnly(dateTime: string): string {
    return dateTime.split("T")[1];
  }

  findCustormer(id: number): string {
    return this.employees.find(cus => cus.id === id)?.name || ''
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

  prepararAppointmesReportTodos() {
    this.employees.forEach(cus => {
      let cantidad = 0
      this.appointments.forEach(app => {
        if (cus.id === app.employeeId) {
          cantidad++;
        }
      })
      this.clientReport.push({
        Cantidad: cantidad,
        cui: cus.cui,
        email: cus.email,
        Nombre: cus.name
      })
    })
  }


  prepararAppointmesReporfilter() {
    this.employees.forEach(cus => {
      let cantidad = 0
      this.cancellarions.forEach(app => {
        if (cus.id === app.customer) {
          cantidad++;
        }
      })
      this.clientReport.push({
        Cantidad: cantidad,
        cui: cus.cui,
        email: cus.email,
        Nombre: cus.name
      })
    })
  }


  realizarReport() {
    this.clientReport = []
    switch (this.selectedFilter) {
      case 'Todos':
        this.prepararAppointmesReportTodos()
        break;
      case 'Mal-Uso':
        this.prepararAppointmesReporfilter()
        break;
    }
  }

  exportPDf() {
    const send: clietnReportSend = {
      items: this.clientReport,
      rangeDate: this.startDate + ' - ' + this.endDate,
      filtro: this.selectedFilter
    }
    this.cancellationService.downloadReport(send)

  }

  exportPNG(){
    const send: clietnReportSend = {
      items: this.clientReport,
      rangeDate: this.startDate + ' - ' + this.endDate,
      filtro: this.selectedFilter
    }
    this.cancellationService.downloadPNGReport(send)
  }

  exportExcel() {
    const send: clietnReportSend = {
      items: this.clientReport,
      rangeDate: this.startDate + ' - ' + this.endDate,
      filtro: this.selectedFilter
    }
    this.cancellationService.downloadReportSalesExcel(send)
  }

}
