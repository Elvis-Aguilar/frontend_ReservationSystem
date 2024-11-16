import { Component, inject } from '@angular/core';
import { CreateRoleDto, PermissionDTO, RoleDTO } from '../utils/models/collaborators';
import { CallaboratorService } from '../utils/services/callaborator.service';
import { PermissionsService } from '../utils/services/permissions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  private readonly callaboratorService = inject(CallaboratorService)

  private readonly permissionsService = inject(PermissionsService);

  isDataLoaded = false;

  permissions: PermissionDTO[] = [];
  roles: RoleDTO[] = [];

  constructor() {

  }

  ngOnInit() {
    this.getRoles();
  }


  getRoles() {
    this.callaboratorService.getRoles().subscribe({
      next: value => {
        this.roles = value;
        this.getPermissions();
      },
      error: err => {
        console.error('Error al obtener los roles:', err);
      }
    });
  }

  getPermissions() {
    this.callaboratorService.getPermission().subscribe({
      next: value => {
        this.permissions = value;
      },
      error: err => {
        console.error('Error al obtener los permisos:', err);
      }
    });
  }

  createRole() {

    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'bg-gray-500', 'bg-opacity-75', 'flex', 'justify-center', 'items-center');

    modal.innerHTML = `
          <div class="bg-white p-5 rounded-lg shadow-lg w-1/2">
          <h2 class="text-lg font-semibold mb-4">Nuevo Rol</h2>
          <form id="createRoleForm" class="space-y-4">
            <div>
              <label for="roleName" class="block text-sm font-medium text-gray-700">Nombre del rol</label>
              <input id="roleName" name="roleName" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="roleDescription" class="block text-sm font-medium text-gray-700">Descripción</label>
              <input id="roleDescription" name="roleDescription" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Permisos</label>
              ${this.permissions.map(permission => `
                <div class="flex items-center">
                  <input type="checkbox" id="permission-${permission.id}" name="permissions" value="${permission.id}" class="mr-2">
                  <label for="permission-${permission.id}" class="text-sm">${permission.name}</label>
                </div>
              `).join('')}
            </div>
          </form>
          <div class="flex justify-end space-x-4 mt-4">
            <button id="saveRole" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
            <button id="closeModal" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cerrar</button>
          </div>
        </div>
  
        `;

    document.body.appendChild(modal);

    document.getElementById('closeModal')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.getElementById('saveRole')?.addEventListener('click', () => {
      const form = document.getElementById('createRoleForm') as HTMLFormElement;
      const formData = new FormData(form);

      const roleName = formData.get('roleName') as string;
      const roleDescription = formData.get('roleDescription') as string;
      const selectedPermissions: Array<number> = Array.from(
        form.querySelectorAll('input[name="permissions"]:checked')
      ).map(input => Number((input as HTMLInputElement).value));

      const newRole: CreateRoleDto = {
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions,
      };

      console.log(newRole);
      //validaciones

      if (this.validaciones(newRole)) return



      // Llamada al servicio para crear el rol

      this.callaboratorService.createRole(newRole).subscribe({
        next: response => {
          document.body.removeChild(modal);
          Swal.fire({
            title: 'Rol Creado',
            text: 'el rol se ha creado con exito, ya puede asignarselo a alguien',
            icon: 'success',
          });
          this.getRoles();
        },
        error: err => {
          console.log(err);
          Swal.fire({
            title: 'Error',
            text: 'No puede crear un rol con el nombre ya existente',
            icon: 'error',
          });
        }
      });

    });
  }

  editarRole(role: RoleDTO) {
    // Obtener los permisos asociados al rol
    this.callaboratorService.getRolePermissions(role.id).subscribe({
      next: (userPermissions: PermissionDTO[]) => {
        const modal = document.createElement('div');
        modal.classList.add('fixed', 'inset-0', 'bg-gray-500', 'bg-opacity-75', 'flex', 'justify-center', 'items-center');

        modal.innerHTML = `
          <div class="bg-white p-5 rounded-lg shadow-lg w-1/2">
            <h2 class="text-lg font-semibold mb-4">Editar Rol</h2>
            <form id="editRoleForm" class="space-y-4">
              <div>
                <label for="roleName" class="block text-sm font-medium text-gray-700">Nombre del rol</label>
                <input id="roleName" name="roleName" type="text" value="${role.name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label for="roleDescription" class="block text-sm font-medium text-gray-700">Descripción</label>
                <input id="roleDescription" name="roleDescription" type="text" value="${role.description}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Permisos</label>
                ${this.permissions.map(permission => `
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      id="permission-${permission.id}" 
                      name="permissions" 
                      value="${permission.id}" 
                      ${userPermissions.some(p => p.id === permission.id) ? 'checked' : ''} 
                      class="mr-2">
                    <label for="permission-${permission.id}" class="text-sm">${permission.name}</label>
                  </div>
                `).join('')}
              </div>
            </form>
            <div class="flex justify-end space-x-4 mt-4">
              <button id="saveRole" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
              <button id="deleteRole" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
              <button id="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cerrar</button>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        // Cerrar modal
        document.getElementById('closeModal')?.addEventListener('click', () => {
          document.body.removeChild(modal);
        });

        // Guardar cambios

        document.getElementById('saveRole')?.addEventListener('click', () => {
          const form = document.getElementById('editRoleForm') as HTMLFormElement;
          const formData = new FormData(form);

          const updatedRole: CreateRoleDto = {
            name: formData.get('roleName') as string,
            description: formData.get('roleDescription') as string,
            permissions: Array.from(
              form.querySelectorAll('input[name="permissions"]:checked')
            ).map(input => Number((input as HTMLInputElement).value)),
          };

          if (this.validaciones(updatedRole)) return;

          this.callaboratorService.updateRolePermissions(updatedRole, role.id).subscribe({
            next: response => {
              document.body.removeChild(modal);
              Swal.fire({
                title: 'Rol Actualizado',
                text: 'Los cambios se han guardado con éxito.',
                icon: 'success',
              });
              this.getRoles();
            },
            error: err => {
              console.error(err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el rol.',
                icon: 'error',
              });
            },
          });
        });


        // Eliminar rol
         document.getElementById('deleteRole')?.addEventListener('click', () => {
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el rol de manera permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.callaboratorService.deletedRol(role.id).subscribe({
                next: () => {
                  document.body.removeChild(modal);
                  Swal.fire('Eliminado', 'El rol ha sido eliminado con éxito.', 'success');
                  this.getRoles();
                },
                error: err => {
                  console.error(err);
                  Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
                },
              });
            }
          });
        });
         
      },
      error: err => {
        console.error('Error al obtener los permisos del rol:', err);
      },
    });
  }


  private validaciones(newRole: CreateRoleDto): boolean {
    if (newRole.name === '' || newRole.description === '') {
      Swal.fire({
        title: 'Campos Obligatorios',
        text: 'Debes llenar todos los campos!!',
        icon: 'question',
      });
      return true
    }

    if (newRole.permissions.length === 0) {
      Swal.fire({
        title: 'Sin permisos',
        text: 'No puedes crear un rol sin permisos',
        icon: 'question',
      });
      return true
    }

    return false
  }


}
