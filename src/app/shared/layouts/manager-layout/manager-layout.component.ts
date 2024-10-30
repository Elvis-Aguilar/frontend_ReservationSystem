import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { signOut } from '../../../store/session/actions/session.actions';
import { PermissionDTO } from '../../../modules/manager/utils/models/collaborators';
import { CallaboratorService } from '../../../modules/manager/utils/services/callaborator.service';
import { ManagmentService } from '../../../modules/manager/utils/services/managment.service';
import { BusinessConfigurationDto } from '../../../modules/manager/utils/models/business-congifuration.dto';
@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './manager-layout.component.html',
  styleUrl: './manager-layout.component.scss'
})
export class ManagerLayoutComponent implements OnInit{
  isSidebarOpen = false;
  role: string | null = null;
  permissions: PermissionDTO[] = []; // Cambié a tipo PermissionDTO
  companyName: string = '';

  constructor(private store: Store, private CallaboratorService: CallaboratorService, private managementService: ManagmentService) {}

  ngOnInit() {
    this.loadCompanyName();
    const userData = localStorage.getItem('session');
    console.log(userData);

    if (userData) {
      const user = JSON.parse(userData);
      this.role = user.role; // Obtener el rol del usuario

      // Llamar al método del servicio para obtener permisos
      this.getUserPermissions(user.id);
    }
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

  getUserPermissions(userId: number) {
    this.CallaboratorService.getUserPermissions(userId).subscribe({
      next: (permissions) => {
        this.permissions = permissions; // Asigna los permisos obtenidos
      },
      error: (error) => {
        console.error('Error al obtener permisos', error);
      }
    });
  }

  canAccess(permission: string): boolean {
    return this.role !== 'EMPLEADO' || this.permissions.some(p => p.name === permission);
  }

  logout() {
    this.store.dispatch(signOut());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
