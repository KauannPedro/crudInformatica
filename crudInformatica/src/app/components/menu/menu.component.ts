import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  itensMenu = [
    { label: 'Produtos', link: '/admin-produtos-listar' },
    { label: 'Novo produto', link: '/produto-cadastro' }
  ];
}
