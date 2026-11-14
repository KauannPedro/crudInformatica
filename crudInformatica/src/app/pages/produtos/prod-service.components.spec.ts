import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { prodComponent } from './prod-service.components';

describe('Listagem de produtos', () => {
  let fixture: ComponentFixture<prodComponent>;
  let component: prodComponent;
  let http: HttpTestingController;
  const produto = { id: '7', nome: 'Mouse', descricao: 'Mouse USB', preco: 45, quantidade: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [prodComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(prodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('mostra na tabela os produtos recebidos da API', () => {
    http.expectOne('http://localhost:3000/Produtos').flush([produto]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('Mouse USB');
    expect(component.carregando).toBeFalse();
  });

  it('oferece cadastro quando a lista está vazia', () => {
    http.expectOne('http://localhost:3000/Produtos').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.vazio a').getAttribute('href')).toBe('/produto-cadastro');
  });

  it('informa falha de consulta sem deixar a tela carregando', () => {
    http.expectOne('http://localhost:3000/Produtos').flush('Falha', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(component.carregando).toBeFalse();
  });

  it('não envia exclusão quando a confirmação é cancelada', () => {
    http.expectOne('http://localhost:3000/Produtos').flush([produto]);
    spyOn(window, 'confirm').and.returnValue(false);
    component.excluir('7');
    http.expectNone('http://localhost:3000/Produtos/7');
    expect(component.listaProdutos).toEqual([produto]);
  });

  it('remove somente o produto confirmado depois que a API responde', () => {
    const outro = { ...produto, id: '8', nome: 'Teclado' };
    http.expectOne('http://localhost:3000/Produtos').flush([produto, outro]);
    spyOn(window, 'confirm').and.returnValue(true);
    component.excluir('7');
    component.excluir('7');
    expect(component.listaProdutos.length).toBe(2);
    http.expectOne({ method: 'DELETE', url: 'http://localhost:3000/Produtos/7' }).flush(null);
    expect(component.listaProdutos).toEqual([outro]);
    expect(component.excluindo).toBeFalse();
  });

  it('mantém o produto visível quando a exclusão falha', () => {
    http.expectOne('http://localhost:3000/Produtos').flush([produto]);
    spyOn(window, 'confirm').and.returnValue(true);
    component.excluir('7');
    http.expectOne('http://localhost:3000/Produtos/7').flush('Falha', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(component.listaProdutos).toEqual([produto]);
    expect(component.excluindo).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });
});
