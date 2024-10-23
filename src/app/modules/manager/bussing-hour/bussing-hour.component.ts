import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusinessHour } from '../utils/models/business-hours.dto';
import { BusinessHoursService } from '../utils/services/business-hours.service';
import Swal from 'sweetalert2';


interface SpecialDay {
  id: number;
  date: string;
  isClosed: boolean;
}


@Component({
  selector: 'app-bussing-hour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bussing-hour.component.html',
  styleUrl: './bussing-hour.component.scss'
})

export class BussingHourComponent {


  businessHours: BusinessHour[] = []

  private readonly businessHoursService = inject(BusinessHoursService)

  specialDays: SpecialDay[] = [
    { id: 1, date: '2024-10-31', isClosed: true }, // Halloween
    { id: 2, date: '2024-12-25', isClosed: true }, // Navidad
  ];

  businessHourForm: FormGroup;
  specialDayForm: FormGroup;

  isEditing = false;
  isEditingSpecialDay = false;
  formBuilder: any;

  constructor(private fb: FormBuilder) {
    this.getBussinesGeneral()
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
      date: [''],
      isClosed: [false]
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
      day_of_week: [null],
      opening_time: ['00:00:00'],
      closing_time: ['00:00:00'],
      status: ['AVAILABLE', Validators.required]
    });
  }

  saveChanges() {
    if (this.businessHourForm.valid) {
      this.businessHoursService.UpdateBussinesHourt(this.businessHourForm.value, this.businessHourForm.value.id).subscribe({
        next: value =>{
          this.msgOk()
          console.log('Datos del formulario listos para enviarsssss:', value);
          this.getBussinesGeneral();
        }
      })
    } else {
      console.log('Formulario inválido');
    }
  }

  saveSpecialDayChanges() {
    if (this.specialDayForm.valid) {
      // Aquí asigna si hay valores adicionales antes de enviar al backend
      const formValues = this.specialDayForm.value;

      // Si 'isClosed' está marcado, marcamos el status como 'UNAVAILABLE'
      formValues.status = formValues.isClosed ? 'UNAVAILABLE' : 'AVAILABLE';

      const specificDate = new Date(formValues.date);
      const dayOfWeek = specificDate.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
      formValues.day_of_week = dayOfWeek;

      console.log('Datos del formulario listos para enviar:', formValues);
      //Aqui envialo
    } else {
      console.log('Formulario inválido');
    }
  }

  //Para abrir los modals

  openModal(day?: BusinessHour) {
    if (day) {
      this.businessHourForm.patchValue(day);
      this.isEditing = true;
    } else {
      this.businessHourForm.reset();
      this.isEditing = false;
    }
    const modal = document.getElementById('modal')!;
    modal.classList.remove('hidden');
  }

  openSpecialDayModal(day?: SpecialDay) {
    if (day) {
      this.specialDayForm.patchValue(day);
      this.isEditingSpecialDay = true;
    } else {
      this.specialDayForm.reset();
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

  trackBySpecialDay(index: number, item: SpecialDay): number {
    return item.id;
  }

  msgOk() {
    Swal.fire({
      title: "Actulizacion exitosa",
      text: "Los Cambios de su Horario se realizaron con exito",
      icon: "success"
    });
  }

}
