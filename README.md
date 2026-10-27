# Painel de Controlo de Trabalho

Dashboard pessoal para gerir tarefas, projetos e gerar relatórios de progresso para partilhar com a chefia.

## Funcionalidades

- **Visão geral** — indicadores principais (tarefas pendentes, atrasadas, projetos em curso, conclusão média), próximos prazos e progresso dos projetos.
- **Projetos** — criar, editar e eliminar projetos, com estado, progresso (%) e prazo.
- **Tarefas** — lista filtrável por projeto, estado e prioridade; deteta automaticamente tarefas atrasadas.
- **Relatório para chefia** — resumo pronto a imprimir/exportar em PDF, com o que foi concluído, próximos prazos, atrasos e bloqueios.
- **Exportar / Importar dados** — ficheiro JSON para fazer cópia de segurança ou partilhar o estado atual com outra pessoa/dispositivo.
- **Modo claro/escuro.**
- **Modalidades FC Porto** — Andebol, Basquetebol e Hóquei em Patins com plantel, calendário e classificação atualizados automaticamente (botão "Atualizar dados", que vai buscar os dados ao site oficial do FC Porto). Futsal e Voleibol ficam com plantel/calendário de introdução manual, já que o FC Porto não tem essas modalidades na sua app/API oficial.

## Treino Físico (triatlo)

A pasta [`treino-fisico/`](treino-fisico/) tem um site à parte para os atletas de triatlo: sessões e exercícios de força, core, mobilidade e prevenção, e a escala RPE. Ver [`treino-fisico/README.md`](treino-fisico/README.md).

## Plataforma de treino com login

A pasta [`plataforma/`](plataforma/) tem a versão com contas: o treinador atribui treinos a cada atleta e os atletas registam o RPE. Configuração em [`plataforma/README.md`](plataforma/README.md).

## Como usar

Não precisa de instalação nem de servidor: basta abrir `index.html` num browser.

Para servir localmente (opcional, evita restrições de alguns browsers a `file://`):

```bash
python3 -m http.server 8000
# depois abrir http://localhost:8000
```

Os dados ficam guardados no `localStorage` do browser (só nesse computador/browser).

## Hospedar e partilhar um link

Para teres um link que podes enviar aos teus chefes, podes publicar esta pasta como site estático, por exemplo com o **GitHub Pages** (Settings → Pages → Deploy from branch), Netlify ou Vercel — todos têm plano gratuito e não precisam de configuração de servidor.

**Importante:** como os dados vivem no `localStorage` de cada browser, um link publicado mostra o que estiver nesse dispositivo/browser — não é ainda sincronização em tempo real entre ti e os teus chefes. Para isso, a forma mais simples é:

1. Clicar em **Exportar dados** e enviar o ficheiro `.json`, ou
2. Usar o separador **Relatório para chefia** e **Imprimir/Exportar PDF** para enviar um resumo periódico.

Se mais tarde quiseres sincronização automática entre dispositivos (sem cada pessoa ter de importar o ficheiro), o próximo passo seria ligar a uma base de dados na nuvem (ex. Firebase ou Supabase, ambos com plano gratuito) — é uma alteração pequena ao `js/app.js`, mantendo o resto igual.
