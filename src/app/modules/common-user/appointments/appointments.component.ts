import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createCalendar, viewDay, viewMonthAgenda, viewMonthGrid, viewWeek,createViewWeek } from '@schedule-x/calendar'
import { CalendarComponent } from "@schedule-x/angular";
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  title = 'angular-example';
  calendarApp = createCalendar({
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2024-10-09 03:00',
        end: '2024-10-09 04:00',
      },
      {
        id: '2',
        title: 'Event 2',
        description: 'Discuss the new project',
        location: 'Starbucks',
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
    calendars: {
      leisure: {
        colorName: 'leisure',
        lightColors: {
          main: '#1c7df9',
          container: '#d2e7ff',
          onContainer: '#002859',
        },
        darkColors: {
          main: '#c0dfff',
          onContainer: '#dee6ff',
          container: '#426aa2',
        },
      },
    }
    , views: [createViewWeek(),  viewDay, viewMonthGrid, viewMonthAgenda],
    plugins:[createEventModalPlugin()]
  })
}
