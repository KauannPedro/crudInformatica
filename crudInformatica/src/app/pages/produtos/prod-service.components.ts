import { Component, inject, OnInit } from '@angular/core';
import { Produto } from '../../model/produto';
import { ProdutoService } from '../../service/produtos.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-produtos',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './prod-service.components.html',
    styleUrl: './prod-service.components.css'
})
export class prodComponent implements OnInit {
    private service = inject(ProdutoService);

    listaProdutos: Produto[] = [];
    carregando: boolean = true;
    mensagemErro: string = '';
    excluindo: boolean = false;

    ngOnInit(): void {
        this.service.listar().subscribe({
            next: (produtos) => {
                this.listaProdutos = produtos;
                this.carregando = false;
            },
            error: () => {
                this.mensagemErro = 'Não foi possível carregar os produtos.';
                this.carregando = false;
            }
        });
    }
    excluir(id: string) {
        if (this.excluindo) {
            return;
        }
        if (id !== undefined && confirm('Deseja realmente excluir o produto?')) {
            this.excluindo = true;
            this.mensagemErro = '';
            this.service.excluir(id).subscribe({
                next: () => {
                    this.listaProdutos = this.listaProdutos.filter(produto => produto.id !== id);
                    this.excluindo = false;
                },
                error: () => {
                    this.mensagemErro = 'Não foi possível excluir o produto. Tente novamente.';
                    this.excluindo = false;
                }
            });
        }
    }
}
