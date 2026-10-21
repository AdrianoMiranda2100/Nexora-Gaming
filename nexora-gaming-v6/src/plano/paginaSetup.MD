# Planejamento — Setup Lab

**Arquivo:** `src/public/paginas/setup.html`  
**Rota Express:** `/setup`

## Objetivo
Permitir que a dupla demonstre uma interação de planejamento de setup, combinando perfis de uso com um orçamento ajustável.

## Estrutura e comportamento
- A pessoa escolhe um perfil: arena competitiva, criação/streaming ou exploração/aventura.
- Cada perfil apresenta uma seleção inicial diferente de produtos ilustrativos.
- Caixas de seleção incluem ou retiram produtos do cálculo.
- Um controle deslizante altera o orçamento; total, saldo, barra de progresso e estado do botão são atualizados em tempo real.
- A ação de adicionar envia a seleção à sacola local já existente.

## Acessibilidade e limites
- O orçamento tem rótulo e descrição; a barra informa progresso com `role="progressbar"`.
- Mudanças de limite são comunicadas em uma região `aria-live`.
- Produtos, valores e combinações são fictícios e não verificam compatibilidade técnica ou estoque real.
