import { Routes } from '@angular/router';
import { mainComponent } from './pages/main/main.components';
import { registrarComponent } from './pages/cadastro/registrar.components';
import { loginComponent } from './pages/login/login.components';
import { prodComponent } from './pages/produtos/prod-service.components';

export const routes: Routes = [
    {path: '', component: mainComponent},
    {path: '/login', component: loginComponent},
    {path: '/registrar', component: registrarComponent},
    {path: 'prod-service', component: prodComponent}
];
