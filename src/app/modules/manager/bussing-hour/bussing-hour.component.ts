import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusinessHour, UpdateUserBusinessHours, UserHoursDto } from '../utils/models/business-hours.dto';
import { BusinessHoursService } from '../utils/services/business-hours.service';
import Swal from 'sweetalert2';
import { employe, employeDto } from '../../common-user/utils/models/employes.dto';
import { EmployeeService } from '../../common-user/utils/services/employe.service';
import { CallaboratorService } from '../utils/services/callaborator.service';



@Component({
  selector: 'app-bussing-hour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bussing-hour.component.html',
  styleUrl: './bussing-hour.component.scss'
})

export class BussingHourComponent {


  businessHours: BusinessHour[] = []
  specialDays: BusinessHour[] = []
  businessHourForm: FormGroup;
  specialDayForm: FormGroup;
  employees: employe[] = []
  employessHours: UserHoursDto[] = []
  selectedEmployees: Set<number> = new Set();


  isEditing = false;
  isEditingSpecialDay = false;
  formBuilder: any;

  private readonly businessHoursService = inject(BusinessHoursService)
  private readonly employeService = inject(EmployeeService)
  private readonly collaboratorService = inject(CallaboratorService)




  constructor(private fb: FormBuilder) {
    this.getBussinesGeneral()
    this.getAllSpecificDate();
    this.getEmployees()
    this.businessHourForm = this.fb.group({
      id: 1,
      business: 3,
      specificDate: [''],
      dayOfWeek: [''],
      openingTime: [''],
      closingTime: [''],
      status: ['available']
    });

    this.specialDayForm = this.fb.group({
      id: 1,
      business: 3,
      specificDate: ['2024-10-31'],
      dayOfWeek: ['MONDAY'],
      openingTime: ['00:00'],
      closingTime: ['00:00'],
      status: ['AVAILABLE'],
      availableAreas: 1,
      availableWorkers: 1
    });
  }

  getBussinesGeneral() {
    this.businessHoursService.getBussinesConfiguration().subscribe({
      next: value => {
        this.businessHours = value
      }
    })
  }

  traductDayOfWeek(day: string): string {
    switch (day.toUpperCase()) {
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
        return 'Día no válido';
    }
  }


  private initBusinessHourForm() {
    this.businessHourForm = this.formBuilder.group({
      //Estos son los campos visibles en el formulario
      dayOfWeek: [null, Validators.required],
      openingTime: [null, Validators.required],
      closingTime: [null, Validators.required],
      status: ['available', Validators.required],
      //Estos son los campos adicionales que no aparecen en el formulario
      business_id: [null, Validators.required]
    });
  }

  private initSpecialDayForm() {
    this.specialDayForm = this.formBuilder.group({
      //Estos son los campos visibles porque solo interesa el día especial
      date: [null, Validators.required],
      isClosed: [false],

      //Estos son los campos visibles porque solo interesa el día especial
      business_id: [null, Validators.required],
      opening_time: ['00:00:00'],
      closing_time: ['00:00:00'],
      status: ['AVAILABLE', Validators.required]
    });
  }

  saveChanges() {
    const selectedEmployeeList: number[] = Array.from(this.selectedEmployees);
    if (this.businessHourForm.value.status === 'AVAILABLE' && selectedEmployeeList.length === 0) {
      this.msgVacioEmpleados()
      return
    }
    if (!this.businessHourForm.valid) {
      this.msgformInvalid()
      return
    }
    const updateUserBusinesHours: UpdateUserBusinessHours = { users: selectedEmployeeList }
    this.businessHoursService.UpdateUserBussinesHours(updateUserBusinesHours, this.businessHourForm.value.id).subscribe({
      next: value => {
        this.businessHoursService.UpdateBussinesHourt(this.businessHourForm.value, this.businessHourForm.value.id).subscribe({
          next: value => {
            this.msgOk()
            this.getBussinesGeneral();
            const modal = document.getElementById('modal')!;
            modal.classList.add('hidden');
          },
          error: err => {
            this.msgError()
          }
        })
      },
      error: err => {
        const modal = document.getElementById('modal')!;
        modal.classList.add('hidden');
        this.msgError()
      }
    })
  }

  getAllSpecificDate() {
    this.businessHoursService.getHoursBusinessSpecificDate().subscribe({
      next: value => {
        this.specialDays = value
      }
    })
  }

  saveSpecialDayChanges() {

    const selectedEmployeeList: number[] = Array.from(this.selectedEmployees);
    if (this.specialDayForm.value.status === 'AVAILABLE' && selectedEmployeeList.length === 0) {
      this.msgVacioEmpleados()
      return
    }

    if (!this.specialDayForm.valid) {
      this.msgformInvalid()
      return
    }

    const formValues = this.specialDayForm.value;
    if (this.isEditingSpecialDay) {
      const updateUserBusinesHours: UpdateUserBusinessHours = { users: selectedEmployeeList }

      this.businessHoursService.UpdateUserBussinesHours(updateUserBusinesHours, this.specialDayForm.value.id).subscribe({
        next: value => {
          this.businessHoursService.UpdateBussinesHourt(this.specialDayForm.value, this.specialDayForm.value.id)
            .subscribe({
              next: value => {
                const modal = document.getElementById('special-day-modal')!;
                modal.classList.add('hidden');
                this.msgOk()
                this.getAllSpecificDate()
              },
              error: err => {
                const modal = document.getElementById('special-day-modal')!;
                modal.classList.add('hidden');
                this.msgError()
              }
            })
        },
        error: err => {
          const modal = document.getElementById('special-day-modal')!;
          modal.classList.add('hidden');
          this.msgError()
        }
      })

    } else {
      this.businessHoursService.createdBusinessHours(formValues).subscribe({
        next: value => {
          const updateUserBusinesHours: UpdateUserBusinessHours = { users: selectedEmployeeList }
          if (this.specialDayForm.value.status === 'AVAILABLE') {
            this.businessHoursService.UpdateUserBussinesHours(updateUserBusinesHours, value.id).subscribe({
              next: value => {
                this.msgOkCreate();
                this.getAllSpecificDate();
                const modal = document.getElementById('special-day-modal')!;
                modal.classList.add('hidden');
              },
              error: err => {
                const modal = document.getElementById('special-day-modal')!;
                modal.classList.add('hidden');
                this.msgError()
              }
            })
          } else {
            this.msgOkCreate();
            this.getAllSpecificDate();
            const modal = document.getElementById('special-day-modal')!;
            modal.classList.add('hidden');
          }
        },
        error: err => {
          const modal = document.getElementById('special-day-modal')!;
          modal.classList.add('hidden');
          this.msgError()
        }
      })
    }
  }

  //Para abrir los modals

  openModal(day?: BusinessHour) {
    if (day) {
      this.businessHourForm.patchValue(day);
      this.getEmployesHours(day.id)
      this.isEditing = true;
    } else {
      this.businessHourForm.reset();
      this.isEditing = false;
    }
    const modal = document.getElementById('modal')!;
    modal.classList.remove('hidden');
  }

  openSpecialDayModal(day?: BusinessHour) {
    if (day) {
      this.specialDayForm.patchValue(day);
      this.getEmployesHours(day.id)
      this.isEditingSpecialDay = true;
    } else {
      this.selectedEmployees = new Set();
      this.specialDayForm = this.fb.group({
        business: 3,
        specificDate: ['2024-12-31'],
        dayOfWeek: ['MONDAY'],
        openingTime: ['00:00'],
        closingTime: ['23:59'],
        status: ['AVAILABLE'],
        availableAreas: 1,
        availableWorkers: 1
      });
      this.isEditingSpecialDay = false;
    }
    const modal = document.getElementById('special-day-modal')!;
    modal.classList.remove('hidden');
  }


  addSpecialDay() {
    this.openSpecialDayModal();
  }

  getDayOfWeek(date: string): string {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const parsedDate = new Date(date);
    return daysOfWeek[parsedDate.getUTCDay()];
  }

  //Para cerrar los modals que hay
  closeModal() {
    const modal = document.getElementById('modal')!;
    modal.classList.add('hidden');
  }

  closeSpecialDayModal() {
    const modal = document.getElementById('special-day-modal')!;
    modal.classList.add('hidden');
  }


  trackByHour(index: number, item: BusinessHour): number {
    return item.id;
  }

  trackBySpecialDay(index: number, item: BusinessHour): number {
    return item.id;
  }

  msgOk() {
    Swal.fire({
      title: "Actulizacion exitosa",
      text: "Los Cambios de su Horario se realizaron con exito",
      icon: "success"
    });
  }

  msgVacioEmpleados() {
    Swal.fire({
      title: "Upss",
      text: "Tiene que asignar almenos a un empleado para atender ese dia!",
      icon: "info"
    });
  }

  msgformInvalid() {
    Swal.fire({
      title: "Formulario invalido",
      text: "Debe llenar todos los campos correctamente",
      icon: "question"
    });
  }

  msgOkCreate() {
    Swal.fire({
      title: "Horario especifico creado",
      text: "El horario con fecha especifico ha sido creado con exito",
      icon: "success"
    });
  }

  msgError() {
    Swal.fire({
      title: "Error al Editar el Horario",
      text: "No se ha podido realizar la accion, intente mas tarde!",
      icon: "success"
    });
  }

  getEmployees() {
    this.employeService.getEmployeesExcluding().subscribe({
      next: value => {
        this.obtenerProfecionales(value)
      }
    })
  }

  //limpiar a los profecianels con permisos de gestionar citas!!
  obtenerProfecionales(empl: employeDto[]) {
    empl.forEach(emp => {
      this.collaboratorService.getRolePermissionsUserId(emp.id).subscribe({
        next: value => {
          const citasPermiso = value.find(permiss => permiss.name === 'CITAS')
          if (citasPermiso) {
            this.employees.push({
              ...emp,
              permissions: value
            })
          }
        }
      })
    })
  }

  getEmployesHours(bussineshoursId: number) {
    this.businessHoursService.getUserBusinessHours(bussineshoursId).subscribe({
      next: value => {
        this.employessHours = value
        this.selectedEmployees = new Set();
        this.employessHours.forEach(emp => this.selectedEmployees.add(emp.id));
      }
    })
  }

  toggleEmployeeSelection(employeeId: number): void {
    if (this.selectedEmployees.has(employeeId)) {
      this.selectedEmployees.delete(employeeId);
    } else {
      this.selectedEmployees.add(employeeId);
    }
  }

}
