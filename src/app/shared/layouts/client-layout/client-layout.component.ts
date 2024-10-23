import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { signOut } from '../../../store/session/actions/session.actions';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {
  isSidebarOpen = false;
  constructor(private store: Store) {}
  logout() {
    this.store.dispatch(signOut());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
