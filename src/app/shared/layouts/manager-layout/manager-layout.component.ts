import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { signOut } from '../../../store/session/actions/session.actions';
@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './manager-layout.component.html',
  styleUrl: './manager-layout.component.scss'
})
export class ManagerLayoutComponent {
  isSidebarOpen = false;

  constructor(private store: Store) {}
  logout() {
    this.store.dispatch(signOut());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
