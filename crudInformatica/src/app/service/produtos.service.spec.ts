import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProdutoService } from './produtos.service';
import { Produto } from '../model/produto';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let http: HttpTestingController;
  const produto: Produto = { id: '7', nome: 'Mouse', descricao: 'Mouse USB', preco: 45, quantidade: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProdutoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta os produtos no recurso Produtos da API', () => {
    service.listar().subscribe(produtos => expect(produtos).toEqual([produto]));
    http.expectOne({ method: 'GET', url: 'http://localhost:3000/Produtos' }).flush([produto]);
  });

  it('envia os dados do cadastro usando POST', () => {
    service.incluir(produto).subscribe(resultado => expect(resultado.id).toBe('7'));
    const request = http.expectOne({ method: 'POST', url: 'http://localhost:3000/Produtos' });
    expect(request.request.body).toEqual(produto);
    request.flush(produto);
  });

  it('consulta somente o produto do ID solicitado', () => {
    service.buscarPorId('7').subscribe(resultado => expect(resultado).toEqual(produto));
    http.expectOne({ method: 'GET', url: 'http://localhost:3000/Produtos/7' }).flush(produto);
  });

  it('envia a alteração por PUT ao endereço do produto', () => {
    service.editar({ ...produto, preco: 50 }).subscribe();
    const request = http.expectOne({ method: 'PUT', url: 'http://localhost:3000/Produtos/7' });
    expect(request.request.body.preco).toBe(50);
    expect(request.request.body.id).toBe('7');
    request.flush({ ...produto, preco: 50 });
  });

  it('exclui somente o ID solicitado usando DELETE', () => {
    service.excluir('7').subscribe();
    http.expectOne({ method: 'DELETE', url: 'http://localhost:3000/Produtos/7' }).flush(null);
  });
});
