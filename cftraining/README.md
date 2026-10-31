# CF Training — site da marca

Site de apresentação da CF Training (treino online de triatlo e corrida). É um site da marca: não há páginas pessoais.

- `index.html` — página única: método, plataforma, como funciona, resumo da semana, planos (triatlo/corrida), FAQ e candidatura.
- `estilos.css` — identidade visual "água aberta" (Archivo + Geist Mono, verde-azulado e laranja da boia).
- `site.js` — troca de preços triatlo/corrida e envio da candidatura para o Supabase (tabela `candidaturas`).

## Ativar as candidaturas
Correr `../plataforma/sql/04-candidaturas.sql` no SQL Editor do Supabase. As candidaturas aparecem na plataforma, no separador **Candidaturas** (só o treinador vê).

## Antes de divulgar
- Confirmar preços e o que cada plano inclui (estão em `index.html`, secção `#planos`).
- Juntar fotografias reais (água aberta, corrida, ginásio) e testemunhos reais de atletas, com autorização.
- Domínio próprio (ex.: cftraining.pt) e email da marca.
