import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {

}
