# CF Training — site da marca

Site de apresentação da CF Training (treino online de triatlo e corrida). É um site da marca: não há páginas pessoais.

- `index.html` — página única: método, Área de atleta (o que o atleta vê: força de hoje, RPE e comentários, feedback à segunda, TrainingPeaks), como funciona, resumo da semana, planos (triatlo/corrida + tabela de comparação), FAQ e candidatura. Barra "Candidata-te" fixa no telemóvel.
- `estilos.css` — usa os tokens partilhados de `../marca/tokens.css` (verde claro como cor de referência, Archivo + Geist Mono, tema claro e escuro). Cabeçalho escuro igual ao da plataforma.
- `site.js` — menu do telemóvel, troca de preços triatlo/corrida, barra fixa e envio da candidatura para o Supabase (tabela `candidaturas`).

## Ativar as candidaturas
Correr `../plataforma/sql/04-candidaturas.sql` no SQL Editor do Supabase. As candidaturas aparecem na plataforma, no separador **Candidaturas** (só o treinador vê).

## Antes de divulgar
- Confirmar preços e o que cada plano inclui (estão em `index.html`, secção `#planos`).
- Juntar fotografias reais (água aberta, corrida, ginásio) e testemunhos reais de atletas, com autorização.
- Domínio próprio (ex.: cftraining.pt) e email da marca.
