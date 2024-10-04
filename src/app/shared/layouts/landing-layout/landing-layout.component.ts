import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 

import { LandigNavbarComponent } from '../../components/landig-navbar/landig-navbar.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterModule, LandigNavbarComponent],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss'
})
export class LandingLayoutComponent {

}
