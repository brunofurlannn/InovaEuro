const STORAGE_KEY = 'inovaEuroState.v1';

function createId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

const seedState = {
  profile: {
    name: 'Marcos Paulo',
    area: 'P&D',
    score: 85,
    lessonsDone: 1,
    badges: ['Explorador da Inovação']
  },
  ideas: [
    {
      id: createId(),
      title: 'Totem de dúvidas rápidas sobre inovação',
      area: 'Operações',
      description: 'Instalar totens nas fábricas para colaboradores consultarem regras, prêmios e enviarem ideias sem depender de computador.',
      status: 'Em análise',
      votes: 18,
      author: 'Marcos Paulo'
    },
    {
      id: createId(),
      title: 'Quiz semanal de melhoria contínua',
      area: 'RH',
      description: 'Criar quizzes curtos para ensinar conceitos de inovação aberta e recompensar quem participa toda semana.',
      status: 'Aprovada',
      votes: 27,
      author: 'Bruno Furlan'
    },
    {
      id: createId(),
      title: 'Mural digital de ideias reconhecidas',
      area: 'Comunicação Interna',
      description: 'Exibir em TVs e portal interno as ideias com maior impacto, reconhecendo colaboradores por área.',
      status: 'Nova',
      votes: 11,
      author: 'Murilo'
    }
  ],
  ranking: [
    { name: 'Bruno Furlan', area: 'Tecnologia', score: 210 },
    { name: 'Murilo', area: 'Operações', score: 165 },
    { name: 'Ana Souza', area: 'RH', score: 130 },
    { name: 'Marcos Paulo', area: 'P&D', score: 85 }
  ],
  votedIdeas: [],
  quizCompleted: false
};

let state = loadState();

const screens = document.querySelectorAll('.screen');
const navLinks = document.querySelectorAll('.nav-link');
const pageTitle = document.querySelector('#pageTitle');
const sidebar = document.querySelector('.sidebar');
const toast = document.querySelector('#toast');

const challenges = [
  {
    title: 'Experiência do colaborador',
    description: 'Como tornar a participação nos programas de inovação mais simples, inclusiva e frequente?',
    points: 50,
    deadline: 'Aberto até 30/06'
  },
  {
    title: 'Inovação no chão de fábrica',
    description: 'Sugira soluções para reduzir barreiras de acesso à informação nas unidades operacionais.',
    points: 70,
    deadline: 'Aberto até 15/07'
  },
  {
    title: 'Capacitação rápida',
    description: 'Ideias para treinamentos curtos, objetivos e integrados à rotina dos colaboradores.',
    points: 40,
    deadline: 'Aberto até 28/07'
  }
];

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return JSON.parse(JSON.stringify(seedState));
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return JSON.parse(JSON.stringify(seedState));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function navigate(screenId) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === screenId));
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.screen === screenId));
  const activeLabel = document.querySelector(`[data-screen="${screenId}"]`)?.textContent || 'Dashboard';
  pageTitle.textContent = activeLabel;
  sidebar.classList.remove('open');
  renderAll();
}

function renderDashboard() {
  const totalVotes = state.ideas.reduce((sum, idea) => sum + idea.votes, 0);
  document.querySelector('#myScore').textContent = state.profile.score;
  document.querySelector('#metricIdeas').textContent = state.ideas.length;
  document.querySelector('#metricVotes').textContent = totalVotes;
  document.querySelector('#metricLessons').textContent = state.profile.lessonsDone;
  document.querySelector('#metricBadges').textContent = state.profile.badges.length;

  const latest = [...state.ideas].slice(-3).reverse();
  document.querySelector('#latestIdeas').innerHTML = latest.map(idea => `
    <article class="compact-item">
      <div>
        <strong>${escapeHtml(idea.title)}</strong><br>
        <small>${escapeHtml(idea.area)} • ${escapeHtml(idea.status)}</small>
      </div>
      <small>▲ ${idea.votes}</small>
    </article>
  `).join('');
}

function renderIdeas() {
  const query = document.querySelector('#ideaSearch').value.toLowerCase();
  const status = document.querySelector('#statusFilter').value;
  const filtered = state.ideas.filter(idea => {
    const matchesText = `${idea.title} ${idea.area} ${idea.description}`.toLowerCase().includes(query);
    const matchesStatus = status === 'todos' || idea.status === status;
    return matchesText && matchesStatus;
  });

  document.querySelector('#ideasGrid').innerHTML = filtered.map(idea => {
    const voted = state.votedIdeas.includes(idea.id);
    return `
      <article class="idea-card">
        <span class="status ${idea.status.replace(' ', '-')}">${escapeHtml(idea.status)}</span>
        <h3>${escapeHtml(idea.title)}</h3>
        <p>${escapeHtml(idea.description)}</p>
        <small><strong>Área:</strong> ${escapeHtml(idea.area)} • <strong>Autor:</strong> ${escapeHtml(idea.author)}</small>
        <div class="vote-row">
          <strong>${idea.votes} votos</strong>
          <button class="vote-btn" data-vote="${idea.id}" ${voted ? 'disabled' : ''}>${voted ? 'Votado' : 'Votar'}</button>
        </div>
      </article>
    `;
  }).join('') || '<p>Nenhuma ideia encontrada com esse filtro.</p>';
}

function renderChallenges() {
  document.querySelector('#challengeGrid').innerHTML = challenges.map(item => `
    <article class="challenge-card">
      <span class="tag light">+${item.points} pontos</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <small>${escapeHtml(item.deadline)}</small>
      <button class="secondary-btn" data-go="ideias">Enviar ideia para este desafio</button>
    </article>
  `).join('');
}

function renderRanking() {
  const merged = state.ranking.map(person => {
    if (person.name === state.profile.name) return { ...person, score: state.profile.score };
    return person;
  }).sort((a, b) => b.score - a.score);

  document.querySelector('#rankingTable').innerHTML = merged.map((person, index) => `
    <article class="rank-row">
      <strong>#${index + 1}</strong>
      <div>
        <strong>${escapeHtml(person.name)}</strong>
        <small>${escapeHtml(person.area)}</small>
      </div>
      <strong>${person.score} pts</strong>
    </article>
  `).join('');
}

function renderChatIntro() {
  const chat = document.querySelector('#chatWindow');
  if (chat.children.length === 0) {
    addMessage('bot', 'Olá! Sou o assistente virtual do programa de inovação. Posso explicar como enviar ideias, ganhar pontos e participar dos desafios.');
  }
}

function renderAll() {
  renderDashboard();
  renderIdeas();
  renderChallenges();
  renderRanking();
  renderChatIntro();
}

function openModal() {
  document.querySelector('#ideaModal').classList.add('open');
  document.querySelector('#ideaModal').setAttribute('aria-hidden', 'false');
  document.querySelector('#ideaTitle').focus();
}

function closeModal() {
  document.querySelector('#ideaModal').classList.remove('open');
  document.querySelector('#ideaModal').setAttribute('aria-hidden', 'true');
  document.querySelector('#ideaForm').reset();
}

function addIdea(event) {
  event.preventDefault();
  const title = document.querySelector('#ideaTitle').value.trim();
  const area = document.querySelector('#ideaArea').value;
  const description = document.querySelector('#ideaDescription').value.trim();

  if (!title || !description) return;

  state.ideas.push({
    id: createId(),
    title,
    area,
    description,
    status: 'Nova',
    votes: 0,
    author: state.profile.name
  });
  state.profile.score += 25;
  if (state.profile.score >= 100 && !state.profile.badges.includes('Inovador Ativo')) {
    state.profile.badges.push('Inovador Ativo');
  }
  saveState();
  closeModal();
  navigate('ideias');
  showToast('Ideia cadastrada! Você ganhou 25 pontos.');
}

function voteIdea(id) {
  if (state.votedIdeas.includes(id)) return;
  const idea = state.ideas.find(item => item.id === id);
  if (!idea) return;
  idea.votes += 1;
  state.votedIdeas.push(id);
  state.profile.score += 5;
  saveState();
  renderAll();
  showToast('Voto registrado! Você ganhou 5 pontos por participar.');
}

function completeQuiz(isCorrect) {
  const feedback = document.querySelector('#quizFeedback');
  if (!isCorrect) {
    feedback.textContent = 'Quase! Uma boa ideia precisa resolver um problema real e gerar impacto.';
    feedback.className = 'feedback error';
    return;
  }

  if (state.quizCompleted) {
    feedback.textContent = 'Você já concluiu esta trilha e os pontos já foram adicionados.';
    feedback.className = 'feedback ok';
    return;
  }

  state.quizCompleted = true;
  state.profile.lessonsDone += 1;
  state.profile.score += 30;
  if (!state.profile.badges.includes('Aprendiz da Inovação')) {
    state.profile.badges.push('Aprendiz da Inovação');
  }
  saveState();
  renderAll();
  feedback.textContent = 'Resposta correta! Trilha concluída e +30 pontos adicionados.';
  feedback.className = 'feedback ok';
  showToast('Microlearning concluído com sucesso!');
}

function addMessage(type, text) {
  const chat = document.querySelector('#chatWindow');
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function getBotAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes('envio') || q.includes('ideia') || q.includes('cadastrar')) {
    return 'Para enviar uma ideia, clique em “+ Enviar ideia”, informe título, área e descrição. A ideia entra como Nova e você ganha pontos pela participação.';
  }
  if (q.includes('ponto') || q.includes('ranking') || q.includes('ganho')) {
    return 'Você ganha pontos ao enviar ideias, votar em sugestões, concluir trilhas de microlearning e participar dos desafios ativos.';
  }
  if (q.includes('quem') || q.includes('participar') || q.includes('colaborador')) {
    return 'Todos os colaboradores podem participar: equipes administrativas, técnicas, P&D e chão de fábrica. A proposta é dar acesso simples para todos.';
  }
  if (q.includes('prêmio') || q.includes('recompensa') || q.includes('badge')) {
    return 'Os pontos podem gerar badges digitais, destaque no mural de inovação, mentorias e reconhecimentos internos do programa.';
  }
  return 'Posso ajudar com envio de ideias, regras de pontuação, desafios, microlearning e recompensas. Tente perguntar: “Como ganho pontos?”.';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

navLinks.forEach(link => link.addEventListener('click', () => navigate(link.dataset.screen)));
document.querySelector('#mobileMenu').addEventListener('click', () => sidebar.classList.toggle('open'));
document.querySelector('#openIdeaModal').addEventListener('click', openModal);
document.querySelector('#closeIdeaModal').addEventListener('click', closeModal);
document.querySelector('#ideaModal').addEventListener('click', event => {
  if (event.target.id === 'ideaModal') closeModal();
});
document.querySelector('#ideaForm').addEventListener('submit', addIdea);
document.querySelector('#ideaSearch').addEventListener('input', renderIdeas);
document.querySelector('#statusFilter').addEventListener('change', renderIdeas);

document.body.addEventListener('click', event => {
  const go = event.target.closest('[data-go]');
  if (go) navigate(go.dataset.go);

  const vote = event.target.closest('[data-vote]');
  if (vote) voteIdea(vote.dataset.vote);

  const question = event.target.closest('[data-question]');
  if (question) {
    const text = question.dataset.question;
    addMessage('user', text);
    setTimeout(() => addMessage('bot', getBotAnswer(text)), 350);
  }

  const quiz = event.target.closest('.quiz-options button');
  if (quiz) completeQuiz(quiz.dataset.correct === 'true');
});

document.querySelector('#chatForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text);
  input.value = '';
  setTimeout(() => addMessage('bot', getBotAnswer(text)), 450);
});

renderAll();
