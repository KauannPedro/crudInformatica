import { Routes } from '@angular/router';
import { prodComponent } from './pages/produtos/prod-service.components';
import { ProdutoFormComponent } from './pages/produto-form/produto-form.component';

export const routes: Routes = [
    { path: '', component: prodComponent },
    { path: 'admin-produtos-listar', component: prodComponent },
    { path: 'prod-service', component: prodComponent },
    { path: 'produto-cadastro', component: ProdutoFormComponent },
    { path: 'admin-produtos-editar/:id', component: ProdutoFormComponent }
];
