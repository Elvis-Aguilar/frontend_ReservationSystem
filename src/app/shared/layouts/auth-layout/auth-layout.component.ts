import { Component } from '@angular/core';
import { AuthNavbarComponent } from '../../components/auth-navbar/auth-navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule, AuthNavbarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
