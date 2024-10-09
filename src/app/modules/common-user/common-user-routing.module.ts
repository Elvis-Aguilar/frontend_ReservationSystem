import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppointmentsComponent } from './appointments/appointments.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { SettingsComponent } from './settings/settings.component';
import { DetailServiceComponent } from './detail-service/detail-service.component';

const routes: Routes = [
  {
    path:'citas', component: AppointmentsComponent
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
