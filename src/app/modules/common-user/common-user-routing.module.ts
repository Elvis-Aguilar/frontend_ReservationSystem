import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppointmentsComponent } from './appointments/appointments.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { SettingsComponent } from './settings/settings.component';
import { DetailServiceComponent } from './detail-service/detail-service.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServicesElectionComponent } from './appoinmet-logic/services-election/services-election.component';
import { SelectPersonalComponent } from './appoinmet-logic/select-personal/select-personal.component';
import { SelectDayComponent } from './appoinmet-logic/select-day/select-day.component';
import { ResumenConfirmComponent } from './appoinmet-logic/resumen-confirm/resumen-confirm.component';
import { SelectHourComponent } from './appoinmet-logic/select-hour/select-hour.component';
const routes: Routes = [
  {
    path:'dashboard', component: DashboardComponent
  },
  {
    path:'citas', component: AppointmentsComponent
  },
  {
    path:'citas/servicio', component: ServicesElectionComponent
  },
  {
    path:'citas/personal', component: SelectPersonalComponent
  },
  {
    path:'citas/day', component: SelectDayComponent
  },
  {
    path:'citas/hora', component: SelectHourComponent
  },
  {
    path:'citas/resumen', component: ResumenConfirmComponent
  },
  {
    path:'reservaciones', component: ReservationComponent
  },
  {
    path:'servicios', component: ServiciosComponent
  },
  {
    path:'configuracion', component: SettingsComponent
  },
  {
    path: 'detail/:idservice', component: DetailServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonUserRoutingModule { }
