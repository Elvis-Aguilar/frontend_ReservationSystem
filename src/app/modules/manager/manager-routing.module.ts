import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppointmentsAdminComponent } from './appointments-admin/appointments-admin.component';
import { BillingComponent } from './billing/billing.component';
import { BusinessComponent } from './business/business.component';
import { ClientsComponent } from './clients/clients.component';
import { EmployeesComponent } from './employees/employees.component';
import { SettingsComponent } from './settings/settings.component';
import { ServiceComponent } from './service/service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { BussingHourComponent } from './bussing-hour/bussing-hour.component';
const routes: Routes = [
  {
    path:'citas-admin', component: AppointmentsAdminComponent
  },
  { 
    path:'reportes', component: BillingComponent
  },
  {
    path:'config-negocio', component: BusinessComponent
  },
  {
    path:'edit-usuario', component: ClientsComponent
  },
  {
    path:'empleados', component: EmployeesComponent
  },
  {
    path:'configuracion', component: SettingsComponent
  },
  {
    path:'servicios', component: ServiceComponent
  },
  { path:'Hora/:idEmpresa', component: BussingHourComponent}
  ,
  {
    path: 'nuevo-servicio/:idservicio/:action', component: EditServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
