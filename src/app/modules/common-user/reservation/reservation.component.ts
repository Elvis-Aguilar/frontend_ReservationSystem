import { Component, OnInit, inject } from '@angular/core';
import { AppointmentService } from '../utils/services/appointment.service';
import { AppointmentDto } from '../utils/models/appointment.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceDto } from '../../manager/utils/models/service.dto';
import { employeDto } from '../utils/models/employes.dto';
import { ServiceService } from '../../manager/utils/services/service.service';
import { EmployeeService } from '../utils/services/employe.service';
import Swal from 'sweetalert2';
import { BusinessConfigurationDto } from '../../manager/utils/models/business-congifuration.dto';
import { ManagmentService } from '../../manager/utils/services/managment.service';
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  userId: number = JSON.parse(localStorage.getItem("session") || '{"id": ""}').id;
  services: ServiceDto[] = [];
  employees: employeDto[] = [];
  businessConfiguration!: BusinessConfigurationDto


  private readonly appointmentService = inject(AppointmentService);
  private readonly serviceService = inject(ServiceService);
  private readonly employeService = inject(EmployeeService);
  private readonly managmetService = inject(ManagmentService);


  ngOnInit() {
    this.loadServices();
    this.loadEmployees();
    this.loadUserAppointments();
    this.getBusinessConfiguration();
  }

  getBusinessConfiguration() {
    this.managmetService.getBussinesConfiguration().subscribe({
      next: value => {
        this.businessConfiguration = value;
      }
    });
  }

  loadServices() {
    this.serviceService.getServicesAvailable().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => console.error('Error al cargar los servicios:', error)
    });
  }

  loadEmployees() {
    this.employeService.getEmployeesExcluding().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => console.error('Error al cargar los empleados:', error)
    });
  }

  loadUserAppointments() {
    this.appointmentService.getAllAppointment().subscribe({
      next: (appointments) => {
        this.appointments = appointments.filter(
          (appointment) => appointment.customer === this.userId
        );
      },
      error: (error) => console.error('Error al cargar las citas:', error)
    });
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find((s) => s.id === serviceId);
    return service ? service.name : 'Servicio no encontrado';
  }

  getEmployeeName(employeeId: number): string {
    const employee = this.employees.find((e) => e.id === employeeId);
    return employee ? employee.name : 'Empleado no encontrado';
  }

  isCancellationAllowed(appointment: AppointmentDto): boolean {
    const now = new Date();
    const endDate = new Date(appointment.endDate);
    const timeRemaining = endDate.getTime() - now.getTime();
    return timeRemaining > 0; // Permitir la cancelación si aún está en el rangos
}

  showPdfMessage(appointmentId: number) {
    this.appointmentService.downloadBill(appointmentId)
  }

  permitirCancelacion(appointment: AppointmentDto): boolean {
    // Obtener la hora máxima en horas antes de la cita
    const horasMaxima = this.businessConfiguration.maxHoursCancellation;
  
    // Parsear la hora de inicio de la cita
    const startDate = new Date(appointment.startDate);
  
    // Obtener la hora actual
    const now = new Date();
  
    // Calcular la diferencia en milisegundos
    const diffInMillis = startDate.getTime() - now.getTime();
  
    // Convertir la diferencia a horas
    const diffInHours = diffInMillis / (1000 * 60 * 60);
  
    // Verificar si la diferencia es mayor o igual a las horas máximas permitidas
    return diffInHours >= horasMaxima;
  }
  
  

  cancelAppointment(appointment: AppointmentDto) {
    const permitir = this.permitirCancelacion(appointment)
    Swal.fire({
        title: '¿Estás seguro?',
        text: permitir? 'Usted se encuentra en el rango permitido para cancelar sin multas': 'Al cancelar la cita esta incumpliendo con las politicas, por lo que se le cobrara una multa en su proxima cita, se le notificara ',
        icon: permitir? 'question': 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si queda menos de una hora, usamos `canceled`
            const cancelObservable = permitir
                ? this.appointmentService.cancelAppointment(appointment.id)
                : this.appointmentService.canceled(appointment.id);

            cancelObservable.subscribe({
                next: () => {
                    Swal.fire('Cancelado!', 'La cita ha sido cancelada.', 'success');
                    this.loadUserAppointments();
                },
                error: (error) => {
                    Swal.fire('Error!', 'No se pudo cancelar la cita.', 'error');
                    console.error('Error al cancelar la cita:', error);
                }
            });
        }
    });
}


translateStatus(status: string): string {
  switch (status) {
    case 'RESERVED':
      return 'RESERVADO';
    case 'CANCELED':
      return 'CANCELADO';
    case 'COMPLETED':
      return 'COMPLETADO'; 
    default:
      return 'Estado desconocido';
  }
}

translatePaymentMethod(paymentMethod: string): string {
  switch (paymentMethod) {
    case 'CASH':
      return 'EFECTIVO';
    case 'CARD':
      return 'TARJETA';
    default:
      return 'Método de pago desconocido';
  }
}
}