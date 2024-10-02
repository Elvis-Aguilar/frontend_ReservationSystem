import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LandingRoutingModule,
    LandingPageComponent
  ]
})
export class LandingModule { }
