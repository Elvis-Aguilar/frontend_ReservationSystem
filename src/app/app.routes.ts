import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
    },
    {
        path: 'session',
        loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'user',
        loadChildren:() => import('./modules/common-user/common-user.module').then(m => m.CommonUserModule)
    },
    {
        path: 'manager',
        loadChildren:() => import('./modules/manager/manager.module').then(m => m.ManagerModule)
    },
];
