import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { ProdutoFormComponent } from './produto-form.component';
import { Produto } from '../../model/produto';

describe('ProdutoFormComponent', () => {
  let fixture: ComponentFixture<ProdutoFormComponent>;
  let component: ProdutoFormComponent;
  let http: HttpTestingController;
  let navegar: jasmine.Spy;
  const dados = { nome: 'Mouse', descricao: 'Mouse USB', preco: 45, quantidade: 10 };

  function iniciar(id: string | null = null) {
    TestBed.configureTestingModule({
      imports: [ProdutoFormComponent],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } }
      ]
    });
    http = TestBed.inject(HttpTestingController);
    navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    spyOn(window, 'alert');
    fixture = TestBed.createComponent(ProdutoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => http.verify());

  it('cadastra sem inventar um ID e volta à lista após a resposta da API', () => {
    iniciar();
    component.produto = { ...dados, nome: ' Mouse ' } as Produto;
    component.salvar();
    const request = http.expectOne({ method: 'POST', url: 'http://localhost:3000/Produtos' });
    expect(request.request.body).toEqual(dados);
    expect(navegar).not.toHaveBeenCalled();
    request.flush({ id: '8', ...dados });
    expect(component.produto.id).toBe('8');
    expect(navegar).toHaveBeenCalledWith(['/admin-produtos-listar']);
  });

  it('carrega o ID da rota e salva a edição com PUT', () => {
    iniciar('7');
    expect(component.carregando).toBeTrue();
    http.expectOne({ method: 'GET', url: 'http://localhost:3000/Produtos/7' }).flush({ id: '7', ...dados });
    fixture.detectChanges();
    expect(component.produto.nome).toBe('Mouse');
    expect(fixture.nativeElement.querySelector('#id').disabled).toBeTrue();
    component.produto.preco = 60;
    component.salvar();
    const request = http.expectOne({ method: 'PUT', url: 'http://localhost:3000/Produtos/7' });
    expect(request.request.body.preco).toBe(60);
    request.flush({ id: '7', ...dados, preco: 60 });
    expect(navegar).toHaveBeenCalledWith(['/admin-produtos-listar']);
  });

  for (const caso of [
    { nome: 'nome vazio', valores: { nome: '   ' } },
    { nome: 'descrição vazia', valores: { descricao: '' } },
    { nome: 'preço zero', valores: { preco: 0 } },
    { nome: 'preço negativo', valores: { preco: -1 } },
    { nome: 'estoque negativo', valores: { quantidade: -1 } },
    { nome: 'estoque fracionado', valores: { quantidade: 1.5 } }
  ]) {
    it(`impede cadastro com ${caso.nome}`, () => {
      iniciar();
      component.produto = { ...dados, ...caso.valores } as Produto;
      component.salvar();
      http.expectNone('http://localhost:3000/Produtos');
      expect(component.mensagemErro).not.toBe('');
      expect(navegar).not.toHaveBeenCalled();
    });
  }

  it('aceita produto sem estoque e não duplica uma gravação em andamento', () => {
    iniciar();
    component.produto = { ...dados, quantidade: 0 } as Produto;
    component.salvar();
    component.salvar();
    const request = http.expectOne({ method: 'POST', url: 'http://localhost:3000/Produtos' });
    expect(request.request.body.quantidade).toBe(0);
    request.flush({ id: '8', ...dados, quantidade: 0 });
  });

  it('preserva os dados e permite tentar novamente após falha de cadastro', () => {
    iniciar();
    component.produto = { ...dados } as Produto;
    component.salvar();
    http.expectOne('http://localhost:3000/Produtos').flush('Falha', { status: 500, statusText: 'Server Error' });
    expect(component.produto.nome).toBe('Mouse');
    expect(component.salvando).toBeFalse();
    expect(component.mensagemErro).not.toBe('');
    expect(navegar).not.toHaveBeenCalled();
    component.salvar();
    http.expectOne('http://localhost:3000/Produtos').flush({ id: '8', ...dados });
    expect(navegar).toHaveBeenCalled();
  });

  it('bloqueia a gravação quando o produto da rota não existe', () => {
    iniciar('inexistente');
    http.expectOne('http://localhost:3000/Produtos/inexistente').flush('Não encontrado', { status: 404, statusText: 'Not Found' });
    component.produto = { ...dados } as Produto;
    component.salvar();
    fixture.detectChanges();
    expect(component.produtoEncontrado).toBeFalse();
    expect(fixture.nativeElement.querySelector('button').disabled).toBeTrue();
    http.expectNone(request => request.method === 'POST' || request.method === 'PUT');
    expect(navegar).not.toHaveBeenCalled();
  });
});
