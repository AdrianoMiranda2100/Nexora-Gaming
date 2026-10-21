# Nexora Gaming — Versão 6.0

Loja gamer demonstrativa feita com HTML5, CSS puro, JavaScript e Express. A identidade Frutiger Aero + Liquid Glass ganha nesta edição um catálogo mais útil, uma lista de favoritos e o **Setup Lab**, que ajuda a montar uma seleção dentro de um orçamento.

## Equipe
- Adriano Costa de Miranda
- João Cordeiro de Lima Assunção

## Executar no Windows
1. Extraia o projeto e abra a pasta `nexora-gaming-v6` no VS Code.
2. No terminal, entre na pasta que contém `server.js` e `package.json`.
3. Instale o Express:

```powershell
npm.cmd install
```

4. Inicie o servidor:

```powershell
node server.js
```

5. Abra `http://localhost:3000`.

## Rotas
| Página | Rota |
|---|---|
| Início | `/` |
| Produtos | `/produtos` |
| Categorias | `/categorias` |
| Ofertas | `/ofertas` |
| Jogos | `/jogos` |
| Setup Lab | `/setup` |
| Sobre nós | `/sobre` |
| Suporte | `/suporte` |
| Contato | `/contato` |
| Sacola demonstrativa | `/carrinho` |
| Favoritos | `/favoritos` |
| Detalhe do produto | `/produto?slug=aurora-x` |

## O que mudou na V6
- **Setup Lab:** escolha um perfil, ajuste o orçamento, marque produtos e acompanhe o total e o saldo em tempo real. A seleção pode ser enviada à sacola demonstrativa.
- **Favoritos:** salve produtos pelos cartões ou pela página de detalhes; a lista e o contador ficam sincronizados no navegador.
- **Catálogo avançado:** pesquise, filtre por categoria, ordene por preço ou nome e defina um limite de preço.
- **Detalhes mais ricos:** a página de produto oferece itens relacionados e acesso direto ao Setup Lab.
- **Home expandida:** um painel de descoberta reúne caminhos para configurar, salvar e encontrar produtos.
- Temas claro e escuro, emblema de águia-harpia para Adriano, tigre para João, fundo animado, microinterações e trilha ambiente opcional.
- Busca sem diferenciar letras acentuadas e sincronização de favoritos/sacola entre abas abertas no mesmo navegador.

## Estrutura do projeto
```text
nexora-gaming-v6/
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── public/
    │   ├── css/index.css
    │   ├── js/app.js
    │   ├── js/theme.js
    │   ├── js/products.js
    │   ├── images/
    │   └── paginas/
    └── plano/
```

As páginas HTML permanecem separadas; o CSS fica em `src/public/css/`, o JavaScript do navegador em `src/public/js/`, e o `server.js` contém as rotas Express e a entrega dos arquivos estáticos. O projeto segue sem framework front-end ou banco de dados.

## Inspirações e movimento
- Uiverse — referências de componentes, superfícies e microinterações: https://uiverse.io/
- Anime.js — timelines e animações progressivas: https://animejs.com/documentation/
- Web Audio API — trilha sintetizada localmente no navegador.

Anime.js é carregado por CDN e as entradas têm fallback em CSS/JavaScript. A trilha só começa após interação da pessoa. As animações respeitam `prefers-reduced-motion`.

**Aviso:** a loja, seus jogos, produtos, preços e ofertas são fictícios. A sacola, os formulários e o Setup Lab são demonstrações locais; não há compra nem envio de dados.
