import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { createCalendar, viewDay, viewMonthAgenda, viewMonthGrid, viewWeek,createViewWeek } from '@schedule-x/calendar'
import { CalendarComponent } from "@schedule-x/angular";
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  title = 'angular-example';
  isModalOpen = false;

  calendarApp = createCalendar({
    events: [
      {
        id: '1',
        title: 'Mi Event',
        start: '2024-10-09 03:00',
        end: '2024-10-09 04:00',
      },
      {
        id: '2',
        title: 'Ocupado',
        description: 'Discuss the new project',
        location: 'Mi empresa',
        start: '2024-10-10 04:00',
        end: '2024-10-10 05:00',
        calendarId: 'leisure'
      },
      {
        id: 3,
        title: 'Ski trip',
        start: '2024-12-04 10:05',
        end: '2024-12-04 10:35',
      }
    ],
//Colores, se puede editar cambiando el leisure o agregando otro
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
    }
    //Para las vistas de los calendarios en dias, mes y semana
    , views: [createViewWeek(),  viewDay, viewMonthGrid, viewMonthAgenda],
    //Para ver la fecha al darle click
    plugins:[createEventModalPlugin()]
  })

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
