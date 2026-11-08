# CF Training — site da marca

Site de apresentação da CF Training (treino online de triatlo e corrida). É um site da marca, com o tom de uma consultoria de treino: método, processo e o que o atleta recebe todas as semanas. Não há páginas pessoais, preços nem testemunhos inventados.

- `index.html` — página única, por esta ordem:
  hero (proposta + gráfico de periodização da época, em SVG) → a ideia → **01 Método** (quatro pilares + "A base do método": periodização, intensidade controlada, carga medida, força como treino) → **02 Três disciplinas** (faixa de fotografias) → **03 Como funciona** (candidatura → conversa de avaliação → plano em 48 h → feedback) → **04 A tua semana** (ritmo semanal + exemplo de resumo) → **05 Área de atleta** (força de hoje, RPE e comentários, feedback à segunda, TrainingPeaks) → **06 Planos** (Base, Performance, Elite + tabela "Lado a lado", Clube online, extras sob consulta) → **07 FAQ** → **08 Candidatura**. Barra "Candidata-te" fixa no telemóvel.
- `estilos.css` — usa os tokens partilhados de `../marca/tokens.css` (verde claro como preenchimento, Archivo + Geist Mono, tema claro e escuro; zonas `--night` iguais nos dois temas). Inclui fontes de recurso com métricas ajustadas à Archivo para a página não saltar quando a fonte chega.
- `site.js` — menu do telemóvel (Esc, clique fora e saída do foco fecham-no), barra fixa, revelação suave das secções (desligada com "movimento reduzido"), curvas de nível do hero (canvas, decorativo), escolha de plano → campo "Plano" do formulário, e envio da candidatura para o Supabase (tabela `candidaturas`, campos `nome, email, telefone, modalidade, nivel, horas, objetivo, plano, mensagem, consentimento`). A validação no browser segue os limites da tabela (nome 2–120, email 5–200, telefone ≤30, objetivo ≤300, mensagem ≤2000, consentimento obrigatório), mostra o erro junto de cada campo e bloqueia o envio duplo; num erro do servidor os dados ficam no formulário.
- Privacidade: aviso RGPD junto ao consentimento (`#privacidade`, com ligação no rodapé). O feedback semanal é sempre à segunda-feira e só nos planos Performance e Elite (o Base tem resumo mensal) — manter o texto coerente se os planos mudarem.
- Preços: não aparecem no site. Os valores são apresentados na conversa de avaliação; os extras são "sob consulta".

## Fotografias (onde pôr)
Cada lugar está marcado com um comentário `FOTO` no `index.html` e é um `<figure class="foto">`. Basta pôr uma `<img>` dentro da figura (antes da legenda); ela cobre o desenho de substituição automaticamente.
- Faixa "Três disciplinas" (`.foto-disc`, 4:5, mín. 900×1125, ≤180 KB): natação em água aberta; bicicleta em estrada/subida; corrida ou força no ginásio.
- Usar só fotografias reais de atletas CF Training, com autorização escrita; `alt` descritivo em português.

## Ativar as candidaturas
Correr `../plataforma/sql/04-candidaturas.sql` no SQL Editor do Supabase. As candidaturas aparecem na plataforma, no separador **Candidaturas** (só o treinador vê).

## Antes de divulgar
- Imagem de partilha (`og:image`, 1200×630) e `og:url`/`canonical` quando houver domínio.
- Confirmar o que cada plano inclui (`index.html`, secção `#planos`).
- Juntar fotografias reais (ver acima) e, se existirem, testemunhos reais de atletas, com autorização.
- Domínio próprio (ex.: cftraining.pt) e email da marca.
