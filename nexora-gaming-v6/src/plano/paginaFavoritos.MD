# Planejamento — Favoritos

**Arquivo:** `src/public/paginas/favoritos.html`  
**Rota Express:** `/favoritos`

## Objetivo
Dar à pessoa uma lista pessoal para guardar produtos e revisitar antes de decidir o que colocar na sacola demonstrativa.

## Estrutura e comportamento
- A página apresenta um estado vazio com orientação e link para o catálogo.
- Os produtos salvos são renderizados em cartões reutilizados pelo catálogo.
- A ação de salvar/remover pode ser feita nos cartões ou na página de detalhes.
- A lista e o contador do cabeçalho são sincronizados por `localStorage` no navegador atual.
- O controle de limpar a lista só aparece quando há itens salvos.

## Acessibilidade e limites
- Botões informam seu estado com `aria-pressed` e texto acessível atualizado.
- A área vazia e o total da lista comunicam seu estado ao leitor de tela.
- Favoritos ficam somente no dispositivo e não são enviados a um servidor.
