import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { signOut } from '../../../store/session/actions/session.actions';
import { ManagmentService } from '../../../modules/manager/utils/services/managment.service';
import { BusinessConfigurationDto } from '../../../modules/manager/utils/models/business-congifuration.dto';
@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent implements OnInit {
  isSidebarOpen = false;
  companyName: string = ''; // Variable para almacenar el nombre de la empresa

  constructor(private store: Store, private managementService: ManagmentService) {}

  ngOnInit(): void {
    this.loadCompanyName();
  }

  loadCompanyName() {
    this.managementService.getBussinesConfiguration().subscribe(
      (config: BusinessConfigurationDto) => {
        this.companyName = config.name;
      },
      (error) => {
        console.error('Error al cargar la configuración de la empresa:', error);
      }
    );
  }

  logout() {
    this.store.dispatch(signOut());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
