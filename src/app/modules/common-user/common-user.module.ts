import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonUserRoutingModule } from './common-user-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { SettingsComponent } from './settings/settings.component';
import { ResumenConfirmComponent } from './appoinmet-logic/resumen-confirm/resumen-confirm.component';
import { SelectDayComponent } from './appoinmet-logic/select-day/select-day.component';
import { SelectPersonalComponent } from './appoinmet-logic/select-personal/select-personal.component';
import { ServicesElectionComponent } from './appoinmet-logic/services-election/services-election.component';
import { SelectHourComponent } from './appoinmet-logic/select-hour/select-hour.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonUserRoutingModule,
    SettingsComponent,
    ServiciosComponent,
    ReservationComponent,
    AppointmentsComponent,
    ResumenConfirmComponent,
    SelectDayComponent,
    SelectPersonalComponent,
    ServicesElectionComponent,
    SelectHourComponent
  ]
})
export class CommonUserModule { }
