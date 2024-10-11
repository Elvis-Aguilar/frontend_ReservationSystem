import { Routes } from '@angular/router';
import { LandingLayoutComponent } from './shared/layouts/landing-layout/landing-layout.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { ClientLayoutComponent } from './shared/layouts/client-layout/client-layout.component';
import { ManagerLayoutComponent } from './shared/layouts/manager-layout/manager-layout.component';
export const routes: Routes = [
    {
        path: '',
        component: LandingLayoutComponent,
        loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
    },
    {
        path: 'session',
        component: AuthLayoutComponent,
        loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'user',
        component: ClientLayoutComponent,
        loadChildren:() => import('./modules/common-user/common-user.module').then(m => m.CommonUserModule)
    },
    {
        path: 'manager',
        component: ManagerLayoutComponent,
        loadChildren:() => import('./modules/manager/manager.module').then(m => m.ManagerModule)
    },
];
