import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface BusinessHour {
  id: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  isClosed: boolean;
  status: string;
  specificDate?: string;
}

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
  businessHours: BusinessHour[] = [
    { id: 1, dayOfWeek: 'Monday', openingTime: '09:00', closingTime: '18:00', status: "available", isClosed: false },
    { id: 2, dayOfWeek: 'Tuesday', openingTime: '09:00', closingTime: '18:00', status: "available", isClosed: false },
    { id: 3, dayOfWeek: 'Wednesday', openingTime: '09:00', closingTime: '18:00', status: "available", isClosed: false },
    { id: 4, dayOfWeek: 'Thursday', openingTime: '09:00', closingTime: '18:00', status: "available", isClosed: false },
    { id: 5, dayOfWeek: 'Friday', openingTime: '09:00', closingTime: '18:00', status: "available", isClosed: false },
    { id: 6, dayOfWeek: 'Saturday', openingTime: '10:00', closingTime: '14:00', status: "available", isClosed: false },
    { id: 7, dayOfWeek: 'Sunday', openingTime: 'Closed', closingTime: 'Closed', status: "unavailable", isClosed: true },
  ];

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
    this.businessHourForm = this.fb.group({
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
      const formValues = this.businessHourForm.value;

      console.log('Datos del formulario listos para enviar:', formValues);
      alert(formValues)
      // Aquí puedes enviar los datos al backend
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
}
