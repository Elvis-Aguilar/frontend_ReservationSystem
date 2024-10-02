import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonUserRoutingModule } from './common-user-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonUserRoutingModule,
    SettingsComponent,
    ServiciosComponent,
    ReservationComponent,
    AppointmentsComponent
  ]
})
export class CommonUserModule { }
