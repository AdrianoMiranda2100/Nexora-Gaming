# Plano de arquitetura — Nexora Gaming

## 1. Nicho e escopo
**Nicho:** loja gamer fictícia de jogos digitais, periféricos, áudio, monitores e hardware.

**Objetivo do projeto:** demonstrar arquitetura multipágina com Express, identidade visual consistente, navegação por rotas e interações de front-end sem banco de dados.

## 2. Mapa de rotas

| Página | Arquivo HTML | Rota Express | Conteúdo |
|---|---|---|---|
| Início | `index.html` | `/` | Apresentação, destaques e categorias |
| Produtos | `produtos.html` | `/produtos` | Catálogo, busca e filtros |
| Categorias | `categorias.html` | `/categorias` | Acesso por tipo de produto |
| Ofertas | `ofertas.html` | `/ofertas` | Produtos destacados com valores fictícios |
| Jogos | `jogos.html` | `/jogos` | Vitrine de jogos digitais fictícios |
| Sobre nós | `sobre.html` | `/sobre` | Conceito, propósito e princípios |
| Suporte | `suporte.html` | `/suporte` | Atalhos e perguntas frequentes |
| Contato | `contato.html` | `/contato` | Formulário demonstrativo e canais ilustrativos |
| Sacola | `carrinho.html` | `/carrinho` | Itens, quantidades e resumo local |
| Favoritos | `favoritos.html` | `/favoritos` | Lista pessoal persistida no navegador |
| Setup Lab | `setup.html` | `/setup` | Seleção de itens, perfis e orçamento em tempo real |
| Detalhe do produto | `produto.html` | `/produto?slug=aurora-x` | Detalhe montado no navegador conforme o `slug` |
| Página não encontrada | `404.html` | fallback 404 | Orienta a navegação de volta |

## 3. Identidade visual / design system
- **Primária:** azul oceano `#087DC5`.
- **Secundária:** ciano `#19B7DC`.
- **Acentos:** aqua `#8FF5E6` e verde menta `#BDF8DE`.
- **Fundo:** gradientes de céu, água e menta, com bolhas discretas.
- **Texto:** azul profundo `#123D5C`.
- **Tipografia:** sans-serif contemporânea, priorizando fontes do sistema e SF-style.
- **Tom de voz:** otimista, tecnológico, amigável e direto.
- **Frutiger Aero:** cores aquáticas, brilhos, gradientes, formas orgânicas e otimismo visual da tecnologia dos anos 2000.
- **Liquid Glass:** superfícies translúcidas, blur, saturação, bordas claras, reflexos e camadas de vidro inspiradas na linguagem visual do iOS.
- **Acessibilidade:** contraste legível, labels, foco visível, link para pular ao conteúdo, `aria-live`, responsividade e suporte a `prefers-reduced-motion`.

Os jogos `Neon Rift: Circuito Zero` e `Verdant Odyssey` são fictícios e não incluem chave de ativação ou download real.

## 4. Arquitetura e tecnologias
- HTML5 semântico nas páginas em `src/public/paginas/`.
- CSS puro centralizado em `src/public/css/index.css`.
- JavaScript do navegador em `src/public/js/`.
- Imagens vetoriais locais em `src/public/images/`.
- Express em `server.js`, apenas para servir arquivos estáticos e encaminhar rotas para os respectivos HTML.
- Sem framework front-end e sem banco de dados.

## 5. Prompt Mestre

> Atue como um desenvolvedor Frontend Sênior. Crie uma página HTML para uma loja gamer fictícia chamada Nexora Gaming. Mantenha consistência com o design system Frutiger Aero + Liquid Glass: azul oceano `#087DC5`, ciano `#19B7DC`, aqua `#8FF5E6`, fundo em gradientes claros e texto `#123D5C`. Use tipografia sans-serif, componentes com vidro translúcido, backdrop blur, bordas suaves, reflexos, gradientes aquáticos e formas arredondadas. A página deve ser responsiva, acessível, semanticamente organizada e feita com HTML5, CSS puro e JavaScript sem frameworks front-end. O cabeçalho deve conter links usando rotas Express para `/`, `/produtos`, `/categorias`, `/ofertas`, `/jogos`, `/setup`, `/favoritos`, `/sobre`, `/suporte`, `/contato` e `/carrinho`. O HTML deve ficar em arquivo `.html`, CSS em `src/public/css/index.css`, JavaScript em `src/public/js/` e assets em `src/public/images/`. Não incluir conteúdo HTML dentro de `server.js`: ele deve conter apenas middlewares, rotas que usem `res.sendFile`, página 404 e inicialização do Express. Conteúdo específico desta página: [descrever aqui].

## 6. Testes para a dupla
1. Rodar `npm install` e `npm start` na raiz.
2. Abrir `http://localhost:3000`.
3. Testar cada rota do mapa e todos os links do menu e rodapé.
4. Testar busca/filtros, detalhe por produto, adicionar/remover itens e alterar quantidade na sacola.
5. Testar o layout em desktop e celular.
6. Acessar uma rota inexistente e validar a página 404.
7. Confirmar que os formulários são apenas demonstrativos e não enviam dados.
8. Salvar e remover produtos dos favoritos, conferindo o contador e a página `/favoritos`.
9. Usar ordenação, limite de preço, busca e filtros juntos no catálogo.
10. Alterar perfil e orçamento no Setup Lab, selecionar produtos e atualizar a sacola.


## 7. Equipe e versão
- **Alunos:** Adriano Costa de Miranda e João Cordeiro de Lima Assunção.
- **Versão:** 6.0 — favoritos, Setup Lab, catálogo com ordenação/faixa de preço, temas claro e escuro, emblemas de águia-harpia e tigre e animações em Anime.js.
- **Referências de estudo:** Uiverse (padrões de interface/glassmorphism), Anime.js (animação e timelines) e Web Audio API (síntese de áudio no navegador).
- **Movimento responsável:** animações respeitam a preferência `prefers-reduced-motion`; a interação visual não é necessária para navegar ou usar o catálogo.

## 8. Atualizações da V4
- Fundo com pontos de luz e esferas aqua flutuantes, animado em CSS e reduzido quando o dispositivo solicita menos movimento.
- Trilha ambiente original gerada por osciladores Web Audio. O botão oferece iniciar, pausar e ajustar o volume; não há reprodução automática.
- Ilustração principal do portal Nexora e novas capas vetoriais para `Neon Rift: Circuito Zero` e `Verdant Odyssey`.
- Remoção da dependência de Anime.js e da chamada externa de CDN. Entradas progressivas usam `IntersectionObserver` com transições CSS.
- Dez páginas continuam acessíveis por rotas Express com links de navegação consistentes.

## 9. Atualizações da V5
- O seletor de tema salva a escolha no navegador e inicialmente respeita o tema do dispositivo.
- A página Sobre exibe uma águia-harpia como emblema visual do Adriano e um tigre como emblema visual do João.
- Anime.js usa timelines na entrada da Home e animações escalonadas para conteúdo revelado durante a rolagem, com fallback CSS.
- Cartões, botões, painel de som, formulários e páginas internas recebem estados próprios para o tema escuro.

## 10. Atualizações da V6
- `/favoritos` guarda a lista no armazenamento local do navegador e permite remover itens ou limpar a lista.
- Cartões e detalhe de produto apresentam controles para salvar um item; o contador acompanha as mudanças.
- O catálogo combina pesquisa, filtros de categoria, ordenação por preço/nome e limite máximo de preço.
- `/setup` reúne perfis de uso, orçamento ajustável, seleção de produtos, total e saldo calculados em tempo real.
- A Home apresenta o Nexora Control Center; o detalhe do produto sugere itens da mesma categoria e atalhos para o Setup Lab.
- A preferência de tema anterior da V5 é migrada para a chave da V6 no mesmo navegador.
- A escolha inicial de tema fica em `src/public/js/theme.js`, separada dos documentos HTML para evitar o flash entre temas.
- O código permanece organizado no formato do manual: páginas HTML separadas, CSS puro em `src/public/css/`, scripts em `src/public/js/`, assets locais e rotas Express em `server.js`.
- A inspiração de Uiverse orienta o uso de vidro e microinterações; os emblemas da equipe são ilustrações SVG originais do projeto.
