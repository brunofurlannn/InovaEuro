# InovaEuro — Plataforma Inteligente de Engajamento em Inovação

Projeto desenvolvido para o Challenge Eurofarma com foco em engajamento de colaboradores nos programas de inovação.

## 1. Problema resolvido

Empresas de grande porte têm dificuldade em engajar colaboradores na geração de ideias e nos programas de inovação. A proposta do InovaEuro é oferecer uma plataforma simples, acessível e gamificada para que colaboradores possam:

- enviar ideias de melhoria;
- votar em ideias de outros colaboradores;
- participar de desafios de inovação;
- aprender por microlearning;
- consultar um assistente virtual sobre regras do programa;
- acompanhar ranking, pontos e recompensas.

## 2. Público-alvo

Colaboradores da Eurofarma de diferentes áreas, incluindo equipes administrativas, técnicas, P&D e chão de fábrica.

## 3. Funcionalidades implementadas

- Dashboard com métricas de participação.
- Cadastro de novas ideias.
- Listagem de ideias com busca, filtro por status e votação.
- Desafios de inovação.
- Microlearning com quiz e pontuação.
- Ranking de colaboradores.
- Assistente virtual simulado com perguntas frequentes.
- Persistência local dos dados usando `localStorage`.
- Layout responsivo para desktop e celular.

## 4. Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- LocalStorage para persistência local
- Estrutura SPA simples, sem necessidade de backend

## 5. Como rodar o projeto

### Opção 1 — Abrir direto no navegador

1. Extraia o arquivo `.zip`.
2. Abra a pasta do projeto.
3. Dê dois cliques no arquivo `index.html`.

### Opção 2 — Rodar com servidor local

Com Python instalado, entre na pasta do projeto e execute:

```bash
python -m http.server 5500
```

Depois acesse no navegador:

```text
http://localhost:5500
```

### Opção 3 — Usar Live Server

1. Abra a pasta no VS Code.
2. Instale a extensão Live Server.
3. Clique com o botão direito no `index.html`.
4. Selecione `Open with Live Server`.

## 6. Como demonstrar no vídeo pitch

Fluxo sugerido:

1. Abrir o dashboard e explicar o problema.
2. Mostrar a arquitetura e a estrutura de pastas.
3. Clicar em `+ Enviar ideia` e cadastrar uma ideia.
4. Mostrar a ideia aparecendo no banco de ideias.
5. Votar em uma ideia.
6. Acessar Microlearning e responder o quiz.
7. Mostrar a atualização de pontos no ranking.
8. Abrir Assistente IA e fazer uma pergunta.

## 7. Estrutura do projeto

```text
/eurofarma-inova
├── index.html
├── package.json
├── README.md
├── src
│   ├── app.js
│   ├── styles.css
│   └── assets
├── docs
│   ├── DOCUMENTACAO_PROJETO.md
│   ├── ROTEIRO_VIDEO_PITCH.md
│   ├── CASOS_DE_USO.md
│   └── CHECKLIST_ENTREGA.md
└── entrega
    └── LINKS_ENTREGA.md
```

## 8. Observação sobre o assistente de IA

Nesta versão, o assistente virtual é um protótipo funcional com respostas simuladas por regras em JavaScript. Em uma versão futura, ele poderia ser integrado com uma API de IA generativa e uma base de conhecimento interna da Eurofarma.
