import { Component, inject } from '@angular/core';
import { AppointmentService } from '../../utils/services/appointment.service';
import { Router } from '@angular/router';
import { CallaboratorService } from '../../../manager/utils/services/callaborator.service';
import { employe, employeDto } from '../../utils/models/employes.dto';
import { EmployeeService } from '../../utils/services/employe.service';
import Swal from 'sweetalert2';
import { BusinessConfigurationDto } from '../../../manager/utils/models/business-congifuration.dto';
import { ManagmentService } from '../../../manager/utils/services/managment.service';
import { UserHoursDto } from '../../../manager/utils/models/business-hours.dto';
import { BusinessHoursService } from '../../../manager/utils/services/business-hours.service';

@Component({
  selector: 'app-select-personal',
  standalone: true,
  imports: [],
  templateUrl: './select-personal.component.html',
  styleUrl: './select-personal.component.scss'
})
export class SelectPersonalComponent {

  nameService = 'Seleccionar servicio'

  mostrarHtml = false


  employee: employe[] = []
  employessHours: UserHoursDto[] = []
  businessConfiguration!: BusinessConfigurationDto
  employeeSelect!: employe


  readonly appointmentService = inject(AppointmentService)
  private readonly router = inject(Router)
  private readonly collaboratorService = inject(CallaboratorService)
  private readonly employeService = inject(EmployeeService)
  private readonly managmetService = inject(ManagmentService)
  private readonly businessHoursService = inject(BusinessHoursService)




  async ngOnInit() {
    await this.loadInitialData();
    if (this.businessConfiguration.employeeElection) {
      this.mostrarHtml = true
    }else{
      this.balancearCarga()
    }
  }
  
  private async loadInitialData() {
    try {
      await this.getBusinessConfiguration();
      await this.getEmployees();
      await this.getEmployesHours();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
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
  
  async getEmployesHours(): Promise<void> {
    if (this.appointmentService.appoinmentTemp === null) {
      return
    }
    if (!this.appointmentService.appoinmentTemp?.hoursId) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.businessHoursService.getUserBusinessHours(this.appointmentService.appoinmentTemp?.hoursId || 1).subscribe({
        next: value => {
          this.employessHours = value;
          resolve();
        },
        error: err => reject(err)
      });
    });
  }
  
  async getEmployees(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.employeService.getEmployeesExcluding().subscribe({
        next: async value => {
          await this.obtenerProfecionales(value);
          resolve();
        },
        error: err => reject(err)
      });
    });
  }
  
  async obtenerProfecionales(empl: employeDto[]): Promise<void> {
    const promises = empl.map(async emp => {
      try {
        const permissions = await this.collaboratorService.getRolePermissionsUserId(emp.id).toPromise();
        const citasPermiso = permissions?.find(permiss => permiss.name === 'CITAS');
        if (citasPermiso) {
          this.employee.push({
            ...emp,
            permissions: permissions || []
          });
        }
      } catch (error) {
        console.error('Error fetching permissions for employee:', emp.id, error);
      }
    });
  
    await Promise.all(promises);
  }

  disponble(id:number):boolean{
    const exist = this.employessHours.find(emph => emph.id === id)
    return exist ? true : false
  }

  elegir(id:number){
    if (this.appointmentService.appoinmentTemp === null) {
      Swal.fire({
        title: "Secuencia violada",
        text: "Ah violado la secuencia de la reservacion de citas",
        icon: "info"
      });
      this.router.navigate(['/user/citas/servicio'])
      return
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Profesional elegido con exito",
      showConfirmButton: false,
      timer: 1500
    });
    this.appointmentService.appoinmentTemp.employeeId = id
    this.router.navigate(['/user/citas/hora'])

  }

  balancearCarga() {
    if (this.appointmentService.appoinmentTemp === null) {
      Swal.fire({
        title: "Secuencia violada",
        text: "Ah violado la secuencia de la reservacion de citas",
        icon: "info"
      });
      this.router.navigate(['/user/citas/servicio'])
      return
    }
    const empleadoDisponibles: employe[] = [];
  
    this.employee.forEach(em => {
      if (this.disponble(em.id)) {
        empleadoDisponibles.push(em);
      }
    });
  
    if (empleadoDisponibles.length === 0) {
      console.warn('No hay empleados disponibles.');
      return
    }
  
    // Obtener un índice aleatorio.
    const randomIndex = Math.floor(Math.random() * empleadoDisponibles.length);
  
    // Retornar el empleado seleccionado aleatoriamente.
    const empleadoSeleccionado = empleadoDisponibles[randomIndex];

    this.employeeSelect = empleadoSeleccionado
    
    this.appointmentService.appoinmentTemp.employeeId = empleadoSeleccionado.id

    this.mostrarHtml = true
  }
  
  

  goBack(){
    this.router.navigate(['/user/citas/day'])
  }

  cancel(){
    this.appointmentService.appoinmentTemp = null
    this.router.navigate(['/user/citas'])
  }


  goSiguiente() {
    if (!this.appointmentService.appoinmentTemp?.employeeId) {
      Swal.fire({
        title: "Sin Fecha?",
        text: "Aun no has elegido una fecha valida",
        icon: "info"
      });
      return
    }
    this.router.navigate(['/user/citas/hora'])
  }


}
