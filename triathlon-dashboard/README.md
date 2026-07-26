# Dashboard Triatlo

Dashboard para o coach (admin) geris atletas, publicares treinos (corrida, técnica,
ginásio, alongamentos) e acompanhares os treinos de cada atleta — incluindo import de
ficheiros `.tcx` exportados do TrainingPeaks.

Site estático (HTML/CSS/JS puro, sem build step) com **Firebase** (Authentication +
Firestore) para login e dados partilhados na nuvem, no plano gratuito (Spark).

## 1. Criar o projeto Firebase (uma vez só)

1. Vai a [console.firebase.google.com](https://console.firebase.google.com) e cria um projeto novo (nome livre, ex. "triatlo-dashboard").
2. **Authentication** → separador "Sign-in method" → ativa **Email/Password**.
3. **Firestore Database** → "Criar base de dados" → modo produção → escolhe a região mais próxima (ex. `eur3`).
4. Ainda no Firestore, separador **Regras**, cola o conteúdo do ficheiro [`firestore.rules`](./firestore.rules) deste projeto e publica.
5. **Definições do projeto** (ícone de engrenagem) → em baixo, "Os teus apps" → clica no ícone `</>` para adicionar uma app Web → dá um nome → copia o objeto `firebaseConfig` que aparece.
6. Cola esses valores em [`js/firebase-config.js`](./js/firebase-config.js), substituindo os placeholders `COLA_AQUI...`.

## 2. Criar a tua conta de admin (uma vez só)

Não há registo aberto na app — as contas são sempre criadas manualmente para evitar
que estranhos se registem:

1. Firebase Console → **Authentication** → "Adicionar utilizador" → mete o teu email e uma password.
2. Firebase Console → **Firestore Database** → "Iniciar coleção" → nome `users` → ID do documento = o **UID** desse utilizador (aparece na lista de Authentication) → adiciona os campos:
   - `role` (string) = `admin`
   - `name` (string) = o teu nome
   - `email` (string) = o teu email
3. Abre `index.html` e entra com essas credenciais — deves cair na dashboard do coach.

As contas dos **atletas** já não precisam disto: crias diretamente na aba "Atletas" da dashboard admin (nome, email, password temporária), o resto é automático.

## 3. Testar localmente

```bash
cd triathlon-dashboard
python3 -m http.server 8000
# depois abrir http://localhost:8000
```

## 4. Publicar (link para os atletas)

Tal como o outro painel deste repositório, publica esta pasta como site estático —
GitHub Pages, Netlify ou Vercel, todos grátis. Aponta o site para a pasta
`triathlon-dashboard/`. O link de login (`index.html`) é o que partilhas com os atletas.

## Como importar treinos do TrainingPeaks

O TrainingPeaks não tem uma API pública aberta a terceiros sem aprovação de partner,
por isso o import é feito por ficheiro:

1. No TrainingPeaks, abre o treino → **Exportar** → escolhe formato `.tcx`.
2. Na dashboard, aba **"Os meus treinos"** (conta de atleta) → "Importar do TrainingPeaks" → escolhe o ficheiro.
3. A app lê automaticamente distância, duração, ritmo médio e FC média/máxima.

Treinos sem ficheiro (ginásio, alongamentos, etc.) registam-se no formulário manual
logo a seguir, na mesma aba.

Se mais tarde encontrares nas definições da tua conta TP um link de calendário `.ics`
público ("subscribe/share calendar"), envia-mo — dá para ligar isso automaticamente
sem precisares de exportar ficheiro a ficheiro.
