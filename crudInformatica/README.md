# HeroBayADO2

CRUD de produtos da Hero Bay para a ADO 2 de Projeto Integrador II.

## Executar

Abra os terminais na pasta que contém este README e o `package.json`.

Instale as dependências:

```powershell
npm.cmd install
```

No primeiro terminal, inicie o JSON Server:

```powershell
npm.cmd run api
```

No segundo terminal, inicie o Angular:

```powershell
npm.cmd start
```

Acesse http://localhost:4200. A API fica em http://localhost:3000/Produtos.
Mantenha os dois terminais abertos. Se a API já estiver rodando na porta 3000, use a instância existente.

Também é possível iniciar a API como nos slides: entre em `backend` e execute `npx.cmd json-server db.json`.

## Funcionamento

- A página inicial lista os produtos da API.
- Novo produto abre o formulário de cadastro.
- Editar abre o mesmo formulário, carregando o produto pelo ID da rota.
- Excluir pede confirmação e remove o registro da API e da tabela.
- O JSON Server grava as alterações em `backend/db.json`.
- O formulário exige nome, descrição, preço positivo e quantidade inteira não negativa.

## Arquivos principais

| Parte | Arquivo |
| --- | --- |
| Modelo | `src/app/model/produto.ts` |
| Serviço HTTP | `src/app/service/produtos.service.ts` |
| Listagem | `src/app/pages/produtos/prod-service.components.ts`, `.html` e `.css` |
| Cadastro e edição | `src/app/pages/produto-form/produto-form.component.ts`, `.html` e `.css` |
| Rotas | `src/app/app.routes.ts` |
| Configuração HTTP | `src/app/app.config.ts` |
| Menu e rodapé | `src/app/components/menu` e `src/app/components/footer` |
| Banco simulado | `backend/db.json` |

## Relação com as aulas

- Aula 5, página 10: projeto Angular sem SSR.
- Aula 6, páginas 7, 20 e 21: vinculação de propriedades, `FormsModule` e `ngModel`.
- Aula 7, páginas 7, 8 e 12: rotas, `RouterLink` e `router-outlet`.
- Aula 8, páginas 15 a 21: serviço injetável, interface, `OnInit` e listagem com `@for`.
- CRUD Parte 2, páginas 12 a 21: JSON Server, `provideHttpClient`, `HttpClient` e `Observable`.
- CRUD Parte 2, páginas 23 a 27: `subscribe`, exclusão com confirmação e formulário de inclusão.
- CRUD Parte 3, páginas 9 a 14: consulta por ID, PUT e formulário compartilhado para cadastro e alteração.

O projeto usa os campos `id`, `nome`, `descricao`, `preco` e `quantidade` da ADO. A quantidade representa o estoque exibido na tela. Os produtos existentes foram preservados.

A identidade visual, o logo e a imagem do computador vêm do [PI Hero Bay](https://github.com/KauannPedro/hero-bay). A fonte Archivo está em `public/fonts`, junto da licença. O código da ADO usa a camada de serviços e a API exigidas na atividade.

O nome do projeto Angular é `HeroBayADO2`; a pasta existente foi mantida como `crudInformatica` para preservar o caminho de trabalho.

## Conferência manual

1. Cadastre um produto e confira a listagem e o `db.json`.
2. Recarregue a página e confirme que o produto continua cadastrado.
3. Edite o preço e a quantidade e recarregue novamente.
4. Cancele uma exclusão e confira que o produto permanece.
5. Confirme a exclusão e confira a remoção também no `db.json`.

Para compilar:

```powershell
npm.cmd run build
```

As aulas usam `--skip-tests` na geração dos componentes e orientam testar as operações no navegador. Esta entrega segue essa abordagem, sem arquivos `.spec.ts` ou configuração personalizada de testes. O comando `test` e as dependências de teste originais do Angular permanecem no projeto, mas não há uma suíte automatizada para executar.

PDF e vídeo não fazem parte desta entrega de código.
