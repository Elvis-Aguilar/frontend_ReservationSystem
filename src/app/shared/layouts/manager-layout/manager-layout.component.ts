import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './manager-layout.component.html',
  styleUrl: './manager-layout.component.scss'
})
export class ManagerLayoutComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
