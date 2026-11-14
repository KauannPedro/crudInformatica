import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Produto } from '../../model/produto';
import { ProdutoService } from '../../service/produtos.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProdutoFormComponent implements OnInit {
  produto: Produto = {} as Produto;
  private service = inject(ProdutoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  produtoId: string | null = this.route.snapshot.paramMap.get('id');
  carregando: boolean = false;
  salvando: boolean = false;
  produtoEncontrado: boolean = true;
  mensagemErro: string = '';

  ngOnInit() {
    if (this.produtoId) {
      this.carregando = true;
      this.produtoEncontrado = false;
      this.service.buscarPorId(this.produtoId).subscribe({
        next: (produto) => {
          this.produto = produto;
          this.produtoEncontrado = true;
          this.carregando = false;
        },
        error: (erro) => {
          if (erro.status === 404) {
            this.mensagemErro = 'Produto não encontrado.';
          } else {
            this.mensagemErro = 'Não foi possível carregar o produto. Tente novamente.';
          }
          this.carregando = false;
        }
      });
    }
  }

  salvar() {
    if (this.salvando || this.carregando || !this.produtoEncontrado) {
      return;
    }
    if (!this.produto.nome || this.produto.nome.trim() === '') {
      this.mensagemErro = 'Informe o nome do produto.';
      return;
    }
    if (!this.produto.descricao || this.produto.descricao.trim() === '') {
      this.mensagemErro = 'Informe a descrição do produto.';
      return;
    }
    if (this.produto.preco == null || this.produto.preco <= 0) {
      this.mensagemErro = 'Informe um preço maior que zero.';
      return;
    }
    if (this.produto.quantidade == null || this.produto.quantidade < 0 || this.produto.quantidade % 1 !== 0) {
      this.mensagemErro = 'Informe uma quantidade inteira igual ou maior que zero.';
      return;
    }
    this.produto.nome = this.produto.nome.trim();
    this.produto.descricao = this.produto.descricao.trim();
    this.mensagemErro = '';
    this.salvando = true;
    if (this.produtoId) {
      this.service.editar(this.produto).subscribe({
        next: (produto) => {
          this.produto = produto;
          this.router.navigate(['/admin-produtos-listar']);
        },
        error: () => {
          this.mensagemErro = 'Não foi possível alterar o produto. Tente novamente.';
          this.salvando = false;
        }
      });
    } else {
      this.service.incluir(this.produto).subscribe({
        next: (produto) => {
          this.produto = produto;
          alert(`Produto ${this.produto.nome} cadastrado com sucesso!`);
          this.router.navigate(['/admin-produtos-listar']);
        },
        error: () => {
          this.mensagemErro = 'Não foi possível cadastrar o produto. Tente novamente.';
          this.salvando = false;
        }
      });
    }
  }
}
