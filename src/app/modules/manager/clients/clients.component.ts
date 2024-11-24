import { Component, inject } from '@angular/core';
import { AppointmentDto } from '../../common-user/utils/models/appointment.dto';
import { employeDto } from '../../common-user/utils/models/employes.dto';
import { clienteReportItem } from '../utils/models/clienteReportItems';
import { AppointmentService } from '../../common-user/utils/services/appointment.service';
import { UserService } from '../utils/services/user.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {

  appointments: AppointmentDto[] = []
  customers: employeDto[] = []
  clientReport: clienteReportItem[] = []

  private readonly appointmentService = inject(AppointmentService)
  private readonly userService = inject(UserService)

  async ngOnInit() {
    await this.getAllAppointment();
    await this.getCustomers()
    this.prepararAppointmesReporfilter()
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

  prepararAppointmesReporfilter() {
    this.customers.forEach(cus => {
      let cantidad = 0
      this.appointments.forEach(app => {
        if (cus.id === app.customer && app.fine === true) {
          cantidad++;
        }
      })
      if (cantidad > 0) {
        this.clientReport.push({
          Cantidad: cantidad,
          cui: cus.cui,
          email: cus.email,
          Nombre: cus.name,
        })
      }
    })
  }


}
