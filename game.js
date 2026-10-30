// ============================================
//  ILHAS PERDIDAS — A Aventura dos 4
// ============================================

// Guarda os dados do herói do jogador
const jogador = {
  nome: "",
  profissao: "",
  icone: "",
  vidaMax: 100,
  vida: 100,

  // --- SISTEMA DE NÍVEL (RPG) ---
  nivel: 1,
  xp: 0,
  xpProximo: 50,   // XP necessário pra subir de nível
  pontos: 0,       // pontos livres pra distribuir

  // atributos que o jogador melhora (começam em 0 de bônus)
  attr: {
    forca: 0,    // +dano no ataque normal
    dano: 0,     // +dano no especial
    especial: 0, // +efeito do especial (cura/poder)
    hp: 0,       // +vida máxima
  },
};

// quanto cada ponto de atributo vale
const VALOR_ATTR = {
  forca: 3,     // cada ponto = +3 de dano no ataque
  dano: 4,      // cada ponto = +4 de dano no especial
  especial: 3,  // cada ponto = +3 de cura/poder especial
  hp: 20,       // cada ponto = +20 de vida máxima
};

const ATTR_INFO = {
  forca:    { emoji: "💪", nome: "Força",    desc: "+3 de dano no ataque normal" },
  dano:     { emoji: "⚔️", nome: "Dano",     desc: "+4 de dano no golpe especial" },
  especial: { emoji: "✨", nome: "Especial", desc: "+3 no poder/cura do especial" },
  hp:       { emoji: "❤️", nome: "HP",       desc: "+20 de vida máxima" },
};

// Dados de cada profissão
// ataque = força do golpe | especial = poder único da profissão
const PROFISSOES = {
  policial:   { icone: "👮",    nome: "Policial",   desc: "Mantém a ordem e enfrenta os capangas de frente. Forte no combate!", ataque: 22, especial: { nome: "Algema!", emoji: "🔗", dano: 35, texto: "prende o inimigo e acerta um golpe pesado" } },
  bombeiro:   { icone: "🚒",    nome: "Bombeiro",   desc: "Apaga incêndios e resgata a equipe de situações perigosas.", ataque: 18, especial: { nome: "Jato d'água!", emoji: "💦", dano: 30, texto: "dispara um jato poderoso no inimigo" } },
  medico:     { icone: "🧑‍⚕️", nome: "Médico",     desc: "Cura os feridos e mantém a equipe viva durante a aventura.", ataque: 15, especial: { nome: "Cura!", emoji: "💊", cura: 35, texto: "aplica um remédio e recupera a própria vida" } },
  cozinheiro: { icone: "🧑‍🍳", nome: "Cozinheiro", desc: "Cozinha pratos que dão energia e força para toda a equipe!", ataque: 17, especial: { nome: "Prato Quente!", emoji: "🍲", cura: 25, dano: 12, texto: "joga um prato fervendo: dá dano e ainda recupera energia" } },
};

// ============================================
//  SISTEMA DE NÍVEL E ATRIBUTOS (RPG) 📊
// ============================================

// salva o progresso do herói no celular
function salvarHeroi() {
  localStorage.setItem("ilhas_heroi", JSON.stringify({
    nivel: jogador.nivel, xp: jogador.xp, xpProximo: jogador.xpProximo,
    pontos: jogador.pontos, attr: jogador.attr,
  }));
}

// carrega o progresso salvo (se existir)
function carregarHeroi() {
  const salvo = JSON.parse(localStorage.getItem("ilhas_heroi") || "null");
  if (salvo) {
    jogador.nivel = salvo.nivel ?? 1;
    jogador.xp = salvo.xp ?? 0;
    jogador.xpProximo = salvo.xpProximo ?? 50;
    jogador.pontos = salvo.pontos ?? 0;
    // garante que todos os atributos existam (protege saves antigos)
    jogador.attr = {
      forca: salvo.attr?.forca ?? 0,
      dano: salvo.attr?.dano ?? 0,
      especial: salvo.attr?.especial ?? 0,
      hp: salvo.attr?.hp ?? 0,
    };
  }
}

// garante que o objeto de atributos sempre exista (protege saves antigos/quebrados)
function garantirAttr() {
  if (!jogador.attr) jogador.attr = {};
  jogador.attr.forca = jogador.attr.forca || 0;
  jogador.attr.dano = jogador.attr.dano || 0;
  jogador.attr.especial = jogador.attr.especial || 0;
  jogador.attr.hp = jogador.attr.hp || 0;
}

// calcula a vida máxima atual (base + bônus de HP)
function calcularVidaMax() {
  garantirAttr();
  jogador.vidaMax = 100 + jogador.attr.hp * VALOR_ATTR.hp;
}

// dano do ataque normal (base da profissão + bônus de força)
function danoAtaqueNormal() {
  garantirAttr();
  const base = PROFISSOES[jogador.profissao].ataque;
  return base + jogador.attr.forca * VALOR_ATTR.forca + Math.floor(Math.random() * 8);
}

// ganhar XP (e subir de nível se encher)
function ganharXp(qtd) {
  jogador.xp += qtd;
  let subiu = false;
  while (jogador.xp >= jogador.xpProximo) {
    jogador.xp -= jogador.xpProximo;
    jogador.nivel++;
    jogador.pontos += 3; // 3 pontos por nível (reforço pra encarar os chefões difíceis)
    jogador.xpProximo = Math.round(jogador.xpProximo * 1.4); // cada nível exige mais
    subiu = true;
  }
  salvarHeroi();
  atualizarHudNivel();
  if (subiu) avisarSubiuNivel();
}

function avisarSubiuNivel() {
  mostrarPopupConquista({
    emoji: "⬆️",
    titulo: `Subiu para o Nível ${jogador.nivel}!`,
    desc: `Você ganhou pontos! Abra o 📊 Status para distribuir.`,
  });
  // pisca o botão de status pra chamar atenção
  const b = document.getElementById("btn-status-batalha");
  if (b) { b.classList.add("piscando"); }
}

// mostra nível/XP no topo da batalha
function atualizarHudNivel() {
  const el = document.getElementById("hud-nivel");
  if (el) el.textContent = `Nv.${jogador.nivel}  XP ${jogador.xp}/${jogador.xpProximo}`;
  const badge = document.getElementById("pontos-badge");
  if (badge) {
    badge.textContent = jogador.pontos;
    badge.style.display = jogador.pontos > 0 ? "inline-block" : "none";
  }
}

// --- TELA DE STATUS / UPGRADE ---
function abrirStatus(voltarPara) {
  window._statusVoltar = voltarPara || "tela-batalha";
  renderStatus();
  mostrarTela("tela-status");
}

function fecharStatus() {
  mostrarTela(window._statusVoltar || "tela-batalha");
  // tira o "piscando" do botão quando o jogador já olhou
  const b = document.getElementById("btn-status-batalha");
  if (b) b.classList.remove("piscando");
}

function renderStatus() {
  const p = PROFISSOES[jogador.profissao];
  document.getElementById("status-cabecalho").textContent =
    `${p.icone} ${jogador.nome} — Nível ${jogador.nivel}`;
  document.getElementById("status-xp").textContent =
    `XP: ${jogador.xp} / ${jogador.xpProximo}`;
  document.getElementById("status-pontos").textContent =
    `Pontos disponíveis: ${jogador.pontos}`;

  const lista = document.getElementById("status-atributos");
  lista.innerHTML = "";
  for (const [chave, info] of Object.entries(ATTR_INFO)) {
    const valor = jogador.attr[chave];
    const linha = document.createElement("div");
    linha.className = "attr-linha";
    linha.innerHTML = `
      <span class="attr-emoji">${info.emoji}</span>
      <span class="attr-nome">${info.nome}
        <small>${info.desc}</small>
      </span>
      <span class="attr-valor">Nv ${valor}</span>
      <button class="attr-mais" ${jogador.pontos > 0 ? "" : "disabled"}
        onclick="distribuirPonto('${chave}')">+</button>
    `;
    lista.appendChild(linha);
  }
}

// apaga o progresso salvo e volta o herói pro nível 1 (resolve save bugado)
function resetarProgresso() {
  if (!confirm("Tem certeza? Isso zera nível, XP e pontos do herói.")) return;
  localStorage.removeItem("ilhas_heroi");
  jogador.nivel = 1;
  jogador.xp = 0;
  jogador.xpProximo = 50;
  jogador.pontos = 0;
  jogador.attr = { forca: 0, dano: 0, especial: 0, hp: 0 };
  calcularVidaMax();
  jogador.vida = jogador.vidaMax;
  atualizarHudNivel();
  renderStatus();
  alert("Pronto! Herói recomeçado no Nível 1. 🔄");
}

function distribuirPonto(chave) {
  if (jogador.pontos <= 0) return;
  jogador.pontos--;
  jogador.attr[chave]++;

  // se mexeu no HP, atualiza vida máxima (e cura a diferença)
  if (chave === "hp") {
    const antes = jogador.vidaMax;
    calcularVidaMax();
    jogador.vida += (jogador.vidaMax - antes); // ganha a vida nova na hora
    if (document.getElementById("tela-batalha").classList.contains("ativa")) atualizarBarras();
  }

  salvarHeroi();
  renderStatus();
  atualizarHudNivel();
}

// ============================================
//  ÁLBUM DE CONQUISTAS 🏅
// ============================================
const CONQUISTAS = {
  heroi_criado:   { emoji: "🎖️", titulo: "Nasce um Herói",        desc: "Você criou seu primeiro herói." },
  conheceu_ron:   { emoji: "🐉", titulo: "Melhor Amigo",          desc: "A equipe encontrou o Ron, o mascote dragão." },
  primeiro_almoco:{ emoji: "🍲", titulo: "Primeiro Almoço",       desc: "A equipe fez sua primeira refeição juntos!" },
  primeira_luta:  { emoji: "⚔️", titulo: "Primeira Vitória",      desc: "Você derrotou seu primeiro capanga." },
  ron_fogo:       { emoji: "🔥", titulo: "Cuspe de Fogo",         desc: "O Ron atacou um inimigo com fogo." },
  chefao1:        { emoji: "🦍", titulo: "Caçador de Chefões",    desc: "Você derrotou o chefão da Ilha da Selva." },
  capitulo1:      { emoji: "🏆", titulo: "Capítulo 1 Concluído",  desc: "A primeira ilha foi conquistada!" },
  pirata:         { emoji: "🦜", titulo: "Mares Perigosos",       desc: "Você enfrentou os piratas da segunda ilha." },
  chefao2:        { emoji: "🏴‍☠️", titulo: "Rei dos Mares",        desc: "Você derrotou o Capitão Caveira!" },
  capitulo2:      { emoji: "⚓", titulo: "Capítulo 2 Concluído",  desc: "A Ilha dos Piratas foi conquistada!" },
  assombrado:     { emoji: "👻", titulo: "Caça-Fantasmas",         desc: "Você enfrentou as assombrações da terceira ilha." },
  chefao3:        { emoji: "👹", titulo: "Rei das Trevas",         desc: "Você derrotou Sombrax, o Senhor das Trevas!" },
  capitulo3:      { emoji: "🌟", titulo: "Capítulo 3 Concluído",  desc: "A Ilha Mal-Assombrada foi purificada!" },
  deserto:        { emoji: "🦂", titulo: "Sobrevivente do Deserto", desc: "Você enfrentou os perigos da quarta ilha." },
  chefao4:        { emoji: "👑", titulo: "Conquistador das Areias", desc: "Você derrotou o Faraó Rá!" },
  capitulo4:      { emoji: "🏜️", titulo: "Capítulo 4 Concluído",  desc: "A Ilha Deserta foi conquistada!" },
  tempestade:     { emoji: "⚡", titulo: "Desafiador dos Céus",    desc: "Você enfrentou a fúria da quinta ilha." },
  chefao5:        { emoji: "🌩️", titulo: "Domador de Trovões",     desc: "Você derrotou Zoltrão, o Deus do Trovão!" },
  capitulo5:      { emoji: "🏆", titulo: "Capítulo 5 Concluído",  desc: "A Ilha das Tempestades foi conquistada!" },
  castelo:        { emoji: "🏰", titulo: "Invasor do Castelo",     desc: "Você invadiu o castelo do Rei Bruxo." },
  rei:            { emoji: "🧙‍♂️", titulo: "Herói Lendário",        desc: "Você derrotou o Rei Bruxo e salvou o mundo!" },
  final:          { emoji: "👑", titulo: "A Aventura Termina",     desc: "A equipe voltou para o seu mundo. FIM! 🎉" },
};

// guarda quais conquistas já foram desbloqueadas (salva no celular)
let conquistasFeitas = JSON.parse(localStorage.getItem("ilhas_conquistas") || "[]");

function desbloquear(id) {
  if (conquistasFeitas.includes(id)) return; // já tem
  conquistasFeitas.push(id);
  localStorage.setItem("ilhas_conquistas", JSON.stringify(conquistasFeitas));
  mostrarPopupConquista(CONQUISTAS[id]);
}

function mostrarPopupConquista(c) {
  if (typeof SONS !== "undefined") SONS.conquista();
  const pop = document.getElementById("popup-conquista");
  pop.querySelector(".pop-emoji").textContent = c.emoji;
  pop.querySelector(".pop-titulo").textContent = c.titulo;
  pop.querySelector(".pop-desc").textContent = c.desc;
  pop.classList.add("mostrar");
  clearTimeout(window._popTimer);
  window._popTimer = setTimeout(() => pop.classList.remove("mostrar"), 3200);
}

// monta a tela do álbum
function abrirAlbum(voltarPara) {
  window._albumVoltar = voltarPara || "tela-titulo";
  const grade = document.getElementById("album-grade");
  grade.innerHTML = "";

  const total = Object.keys(CONQUISTAS).length;
  document.getElementById("album-contador").textContent =
    `${conquistasFeitas.length} de ${total} conquistas`;

  for (const [id, c] of Object.entries(CONQUISTAS)) {
    const feita = conquistasFeitas.includes(id);
    const card = document.createElement("div");
    card.className = "conq-card " + (feita ? "feita" : "bloqueada");
    card.innerHTML = `
      <div class="conq-emoji">${feita ? c.emoji : "🔒"}</div>
      <div class="conq-titulo">${feita ? c.titulo : "???"}</div>
      <div class="conq-desc">${feita ? c.desc : "Conquista bloqueada"}</div>
    `;
    grade.appendChild(card);
  }
  mostrarTela("tela-album");
}

function fecharAlbum() {
  mostrarTela(window._albumVoltar || "tela-titulo");
}

// ============================================
//  NAVEGAÇÃO ENTRE TELAS
// ============================================
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");

  // a música de fundo só toca na batalha; nas outras telas ela para
  // (Status é exceção: continua na batalha por baixo, então não paramos)
  if (typeof pararMusica === "function" && id !== "tela-batalha" && id !== "tela-status") {
    pararMusica();
  }
}

// ============================================
//  TELA DE HISTÓRIA (texto aparece aos poucos)
// ============================================
const HISTORIA = [
  "Há muito tempo, um rei malvado separou o mundo inteiro em pedaços...",
  "Quatro pessoas corajosas encontraram um mundo misterioso, cheio de ilhas espalhadas pelo oceano.",
  "Elas queriam explorar TODAS as ilhas... mas cada uma guardava os capangas de um grande chefão.",
  "Para conseguir voltar para o seu mundo, só havia um caminho:",
  "Derrotar TODOS os chefões de cada ilha. E assim... a aventura começou. ⚔️🏝️",
];
let passoHistoria = 0;

function irParaHistoria() {
  garantirAudio();     // liga o áudio no primeiro toque do usuário
  carregarPrefSom();
  SONS.clique();
  mostrarTela("tela-historia");
  passoHistoria = 0;
  escreverHistoria();
}

function escreverHistoria() {
  const el = document.getElementById("historia-texto");
  const texto = HISTORIA[passoHistoria];
  el.textContent = "";
  let i = 0;
  // efeito de máquina de escrever
  clearInterval(window._typeTimer);
  window._typeTimer = setInterval(() => {
    el.textContent += texto[i];
    i++;
    if (i >= texto.length) clearInterval(window._typeTimer);
  }, 32);

  // última parte muda o botão
  const btn = document.getElementById("btn-historia");
  btn.textContent = (passoHistoria === HISTORIA.length - 1) ? "Criar meu herói ▶" : "Continuar ▶";
}

function proximaHistoria() {
  passoHistoria++;
  if (passoHistoria >= HISTORIA.length) {
    mostrarTela("tela-criar");
    return;
  }
  escreverHistoria();
}

// ============================================
//  CRIAR PERSONAGEM
// ============================================
function escolherProfissao(prof, elemento) {
  jogador.profissao = prof;
  jogador.icone = PROFISSOES[prof].icone;

  // destaque visual
  document.querySelectorAll(".prof").forEach(p => p.classList.remove("selecionada"));
  elemento.classList.add("selecionada");

  // descrição
  document.getElementById("prof-descricao").textContent = PROFISSOES[prof].desc;

  verificarPodeComecar();
}

document.getElementById("input-nome").addEventListener("input", (e) => {
  jogador.nome = e.target.value.trim();
  verificarPodeComecar();
});

function verificarPodeComecar() {
  const btn = document.getElementById("btn-criar");
  btn.disabled = !(jogador.nome.length > 0 && jogador.profissao !== "");
}

// ============================================
//  ILHA INICIAL
// ============================================
function comecarAventura() {
  mostrarTela("tela-ilha");

  carregarHeroi();      // carrega nível/XP/pontos salvos (se houver)
  calcularVidaMax();    // aplica bônus de HP
  jogador.vida = jogador.vidaMax;

  const p = PROFISSOES[jogador.profissao];
  desenharSprite(document.getElementById("heroi-sprite"), jogador.profissao, 7);
  document.getElementById("ilha-info-heroi").textContent = `${p.icone} ${jogador.nome} — ${p.nome}`;

  document.getElementById("ilha-dialogo").textContent =
    `${jogador.nome} abre os olhos numa pequena ilha deserta. De repente, um filhote de dragão 🐉 surge saltitando da areia! "Grrr... au!" — é o Ron, o mascote da equipe! 🎉`;

  desbloquear("heroi_criado");
  setTimeout(() => desbloquear("conheceu_ron"), 3600);
}

let olhadas = 0;
const FALAS_EXPLORAR = [
  "Há uma fogueira ainda acesa — alguém esteve aqui recentemente...",
  "Ao longe, dá pra ver outras ilhas. Em uma delas, uma fumaça escura sobe ao céu. 😨",
  "Olha! Um pequeno barco de madeira encalhado na areia. Dá pra consertar e navegar!",
];

function explorarIlha() {
  const dialogo = document.getElementById("ilha-dialogo");
  const btnOlhar = document.getElementById("btn-olhar");
  const btnViajar = document.getElementById("btn-viajar");

  if (olhadas < FALAS_EXPLORAR.length) {
    dialogo.textContent = FALAS_EXPLORAR[olhadas];
    olhadas++;
  }

  // Quando terminou de explorar tudo, libera a viagem e esconde o "olhar em volta"
  if (olhadas >= FALAS_EXPLORAR.length) {
    btnOlhar.style.display = "none";
    btnViajar.style.display = "inline-block";
  }
}

// Botão de viajar para a primeira ilha
function viajarPrimeiraIlha() {
  const dialogo = document.getElementById("ilha-dialogo");
  dialogo.textContent =
    `${jogador.nome} e sua equipe embarcam no pequeno barco rumo à primeira ilha... 🚢`;
  desenharSprite(document.getElementById("heroi-sprite"), "barco", 7);
  document.getElementById("btn-viajar").style.display = "none";

  // depois de um instante, começa o Capítulo 1
  setTimeout(iniciarCapitulo1, 1800);
}

// ============================================
//  CAPÍTULOS DA AVENTURA
// ============================================
const CAPITULOS = [
  {
    titulo: "Capítulo 1 — A Ilha da Selva 🌴",
    tema: "tema-selva",
    inimigos: [
      { tipo: "capanga", nome: "Capanga Fominha", sprite: "chefe_selva", emoji: "👹", vidaMax: 50,  ataque: 10 },
      { tipo: "capanga", nome: "Capanga Brutamontes", sprite: "chefe_selva", emoji: "👺", vidaMax: 70,  ataque: 14 },
      { tipo: "chefao",  nome: "GRRRAU, o Chefão da Selva", sprite: "chefe_selva", emoji: "🦍", vidaMax: 130, ataque: 20 },
    ],
  },
  {
    titulo: "Capítulo 2 — A Ilha dos Piratas 🏴‍☠️",
    tema: "tema-pirata",
    inimigos: [
      { tipo: "capanga", nome: "Pirata Perna-de-Pau", sprite: "chefe_pirata", emoji: "🦜", vidaMax: 75,  ataque: 15 },
      { tipo: "capanga", nome: "Pirata Barba-Negra", sprite: "chefe_pirata", emoji: "🧔‍♂️", vidaMax: 95,  ataque: 19 },
      { tipo: "chefao",  nome: "Capitão Caveira, o Rei dos Mares", sprite: "chefe_pirata", emoji: "🏴‍☠️", vidaMax: 170, ataque: 26 },
    ],
  },
  {
    titulo: "Capítulo 3 — A Ilha Mal-Assombrada 👻",
    tema: "tema-assombrado",
    inimigos: [
      { tipo: "capanga", nome: "Fantasma Chorão", sprite: "fantasma", emoji: "👻", vidaMax: 90,  ataque: 18 },
      { tipo: "capanga", nome: "Esqueleto Guerreiro", sprite: "esqueleto", emoji: "💀", vidaMax: 110, ataque: 22 },
      { tipo: "chefao",  nome: "Sombrax, o Senhor das Trevas", sprite: "chefe_assombrado", emoji: "👹", vidaMax: 210, ataque: 30 },
    ],
  },
  {
    titulo: "Capítulo 4 — A Ilha Deserta 🏜️",
    tema: "tema-deserto",
    inimigos: [
      { tipo: "capanga", nome: "Escorpião Venenoso", sprite: "escorpiao", emoji: "🦂", vidaMax: 120, ataque: 24 },
      { tipo: "capanga", nome: "Múmia Amaldiçoada", sprite: "mumia", emoji: "🧟", vidaMax: 145, ataque: 28 },
      { tipo: "chefao",  nome: "Faraó Rá, o Rei das Areias", sprite: "chefe_farao", emoji: "👑", vidaMax: 250, ataque: 34 },
    ],
  },
  {
    titulo: "Capítulo 5 — A Ilha das Tempestades ⚡",
    tema: "tema-tempestade",
    inimigos: [
      { tipo: "capanga", nome: "Nuvem Raivosa", sprite: "nuvem", emoji: "☁️", vidaMax: 150, ataque: 30 },
      { tipo: "capanga", nome: "Águia Trovejante", sprite: "ave", emoji: "🦅", vidaMax: 180, ataque: 34 },
      { tipo: "chefao",  nome: "Zoltrão, o Deus do Trovão", sprite: "chefe_trovao", emoji: "⚡", vidaMax: 300, ataque: 40 },
    ],
  },
  {
    titulo: "Capítulo FINAL — O Castelo do Rei Bruxo 🏰",
    tema: "tema-castelo",
    inimigos: [
      { tipo: "capanga", nome: "Guarda Real", sprite: "guarda", emoji: "🛡️", vidaMax: 200, ataque: 36 },
      { tipo: "capanga", nome: "Guarda Real Veterano", sprite: "guarda", emoji: "⚔️", vidaMax: 230, ataque: 40 },
      { tipo: "chefao",  nome: "Rei Barba-Branca, o Bruxo Supremo", sprite: "rei_bruxo", emoji: "🧙‍♂️", vidaMax: 380, ataque: 46 },
    ],
  },
];

let inimigoAtual = null;
let indiceInimigo = 0;
let capituloAtual = 0;
let turnoDoJogador = true;

// inicia um capítulo pelo número (0 = cap 1, 1 = cap 2...)
function iniciarCapitulo(num) {
  capituloAtual = num;
  indiceInimigo = 0;
  ronEnergia = RON_MAX;           // Ron começa pronto

  calcularVidaMax();              // aplica bônus de HP dos atributos

  // no 1º capítulo começa com vida cheia; nos seguintes, descansa e recupera MUITA vida
  if (num === 0) {
    jogador.vida = jogador.vidaMax;
  } else {
    // recupera 70% da vida máxima (a equipe descansa entre as ilhas)
    const cura = Math.round(jogador.vidaMax * 0.7);
    jogador.vida = Math.max(0, jogador.vida); // nunca parte de vida negativa
    jogador.vida = Math.min(jogador.vidaMax, jogador.vida + cura);
    // garante um mínimo decente pra não começar a ilha quase morrendo
    if (jogador.vida < jogador.vidaMax * 0.6) {
      jogador.vida = Math.round(jogador.vidaMax * 0.6);
    }
    jogador._descansou = true; // pra mostrar a mensagem de descanso
  }

  atualizarHudNivel();

  mostrarTela("tela-batalha");

  const p = PROFISSOES[jogador.profissao];
  desenharSprite(document.getElementById("batalha-heroi-sprite"), jogador.profissao, 7);
  document.getElementById("batalha-heroi-nome").textContent = jogador.nome;

  document.getElementById("cap-titulo").textContent = CAPITULOS[num].titulo;

  // aplica o clima/cor de fundo do capítulo na arena
  const arena = document.querySelector(".batalha-arena");
  arena.classList.remove("tema-selva", "tema-pirata", "tema-assombrado", "tema-deserto", "tema-tempestade", "tema-castelo");
  arena.classList.add(CAPITULOS[num].tema);

  // toca a música de fundo da ilha
  const nomeMusica = ["selva", "pirata", "assombrado", "deserto", "tempestade", "castelo"][num];
  tocarMusica(nomeMusica);

  prepararInimigo();
}

// mantém o nome antigo funcionando (vem da viagem de barco)
function iniciarCapitulo1() {
  iniciarCapitulo(0);
}

function prepararInimigo() {
  const lista = CAPITULOS[capituloAtual].inimigos;
  inimigoAtual = { ...lista[indiceInimigo], vida: lista[indiceInimigo].vidaMax };
  turnoDoJogador = true;
  ronEnergia = RON_MAX;   // o Ron começa pronto a cada novo inimigo

  desenharSprite(document.getElementById("batalha-inimigo-sprite"), inimigoAtual.sprite, 7);
  document.getElementById("batalha-inimigo-nome").textContent = inimigoAtual.nome;

  atualizarBarras();

  let intro = inimigoAtual.tipo === "chefao"
    ? `⚠️ O CHEFÃO apareceu! ${inimigoAtual.nome} ruge furioso!`
    : `Um ${inimigoAtual.nome} bloqueia o caminho!`;

  // na 1ª luta de um capítulo (que não seja o primeiro), avisa que a equipe descansou
  if (indiceInimigo === 0 && capituloAtual > 0 && jogador._descansou) {
    intro = `😴 A equipe descansou e recuperou energia! ❤️  ` + intro;
    jogador._descansou = false;
  }

  escreverLog(intro);

  ligarBotoes(true);
}

function atualizarBarras() {
  // vida do herói
  const pHeroi = Math.max(0, (jogador.vida / jogador.vidaMax) * 100);
  document.getElementById("barra-heroi").style.width = pHeroi + "%";
  document.getElementById("vida-heroi-txt").textContent = `${Math.max(0, Math.round(jogador.vida))}/${jogador.vidaMax}`;

  // vida do inimigo
  const pIni = Math.max(0, (inimigoAtual.vida / inimigoAtual.vidaMax) * 100);
  document.getElementById("barra-inimigo").style.width = pIni + "%";
  document.getElementById("vida-inimigo-txt").textContent = `${Math.max(0, Math.round(inimigoAtual.vida))}/${inimigoAtual.vidaMax}`;
}

function escreverLog(txt) {
  document.getElementById("batalha-log").textContent = txt;
}

function ligarBotoes(ligado) {
  document.querySelectorAll(".btn-acao").forEach(b => b.disabled = !ligado);
  atualizarBotaoRon(); // o botão do Ron tem regra própria (energia)
}

// --- AÇÕES DO JOGADOR ---
function acaoAtacar() {
  if (!turnoDoJogador) return;
  SONS.atacar();
  const dano = danoAtaqueNormal(); // base da profissão + bônus de Força
  inimigoAtual.vida -= dano;
  atualizarBarras();               // atualiza a barra ANTES da animação (garante que mostre)
  tremer("batalha-inimigo-sprite");
  escreverLog(`${jogador.nome} atacou e causou ${dano} de dano! 💥`);
  fimDoTurnoJogador();
}

function acaoEspecial() {
  if (!turnoDoJogador) return;
  SONS.especial();
  const esp = PROFISSOES[jogador.profissao].especial;
  let msg = `${jogador.nome} usou ${esp.nome} ${esp.emoji} — ${esp.texto}!`;

  if (esp.dano) {
    // dano base do especial + bônus de Dano
    const dano = esp.dano + jogador.attr.dano * VALOR_ATTR.dano;
    inimigoAtual.vida -= dano;
    tremer("batalha-inimigo-sprite");
  }
  if (esp.cura) {
    // cura base + bônus de Especial
    const cura = esp.cura + jogador.attr.especial * VALOR_ATTR.especial;
    jogador.vida = Math.min(jogador.vidaMax, jogador.vida + cura);
  }
  escreverLog(msg);
  atualizarBarras();
  fimDoTurnoJogador();
}

function acaoDefender() {
  if (!turnoDoJogador) return;
  SONS.defender();
  jogador._defendendo = true;
  escreverLog(`${jogador.nome} ergueu a guarda! O próximo golpe vai doer menos. 🛡️`);
  fimDoTurnoJogador();
}

function fimDoTurnoJogador() {
  turnoDoJogador = false;
  ligarBotoes(false);

  // inimigo morreu?
  if (inimigoAtual.vida <= 0) {
    setTimeout(inimigoDerrotado, 900);
    return;
  }
  // senão, o inimigo contra-ataca
  setTimeout(turnoDoInimigo, 1000);
}

function turnoDoInimigo() {
  let dano = inimigoAtual.ataque + Math.floor(Math.random() * 6);
  if (jogador._defendendo) {
    dano = Math.floor(dano / 2);
    jogador._defendendo = false;
  }
  jogador.vida -= dano;
  SONS.dano();
  tremer("batalha-heroi-sprite");
  escreverLog(`${inimigoAtual.nome} atacou e causou ${dano} de dano! 😣`);
  atualizarBarras();

  if (jogador.vida <= 0) {
    setTimeout(jogadorDerrotado, 900);
    return;
  }

  // o Ron recarrega um pouco de energia a cada turno
  if (ronEnergia < RON_MAX) ronEnergia++;
  atualizarBotaoRon();

  // volta pro jogador
  turnoDoJogador = true;
  ligarBotoes(true);
}

// --- RON: botão próprio controlado pelo jogador 🐉 ---
let ronEnergia = 2;         // começa pronto
const RON_MAX = 2;          // precisa de 2 de energia pra cuspir fogo (recarrega rápido!)
const RON_CUSTO = 2;

function atualizarBotaoRon() {
  const btn = document.getElementById("btn-ron");
  if (!btn) return;
  const pronto = ronEnergia >= RON_CUSTO && turnoDoJogador;
  btn.disabled = !pronto;
  btn.textContent = pronto
    ? "🐉 Ron: Cuspir Fogo!"
    : `🐉 Ron (${ronEnergia}/${RON_MAX})`;
}

// Ron cospe fogo no inimigo (acionado pelo jogador)
function acaoRon() {
  if (!turnoDoJogador || ronEnergia < RON_CUSTO) return;
  SONS.ron();
  ronEnergia = 0; // zera e precisa recarregar

  const dano = 18 + Math.floor(Math.random() * 12);
  inimigoAtual.vida -= dano;
  tremer("batalha-inimigo-sprite");
  pulaRon();
  escreverLog(`🐉 Ron cospe uma labareda de fogo! 🔥 Causou ${dano} de dano!`);
  atualizarBarras();
  atualizarBotaoRon();
  desbloquear("ron_fogo");

  fimDoTurnoJogador();
}

// faz o Ron pular quando ajuda
function pulaRon() {
  const el = document.getElementById("ron-batalha");
  if (!el) return;
  el.classList.remove("ron-pula");
  void el.offsetWidth;
  el.classList.add("ron-pula");
}

function inimigoDerrotado() {
  const eraChefao = inimigoAtual.tipo === "chefao";
  const lista = CAPITULOS[capituloAtual].inimigos;

  // ganha XP: chefão dá bem mais que capanga (XP reforçado pra subir de nível mais rápido)
  const xpGanho = eraChefao ? 60 : 28;
  ganharXp(xpGanho);

  desbloquear("primeira_luta");           // primeira vitória em combate

  // conquistas que dependem do capítulo
  if (capituloAtual === 1) desbloquear("pirata");
  if (capituloAtual === 2) desbloquear("assombrado");
  if (capituloAtual === 3) desbloquear("deserto");
  if (capituloAtual === 4) desbloquear("tempestade");
  if (capituloAtual === 5) desbloquear("castelo");
  if (eraChefao) desbloquear(["chefao1", "chefao2", "chefao3", "chefao4", "chefao5", "rei"][capituloAtual]);

  SONS.inimigoMorto();
  indiceInimigo++;

  if (indiceInimigo < lista.length) {
    const proximoEhChefao = lista[indiceInimigo].tipo === "chefao";
    if (proximoEhChefao) {
      // DESCANSO antes do chefão: regenera vida (e o cozinheiro cozinha!)
      descansarAntesDoChefao();
    } else {
      escreverLog(`${inimigoAtual.nome} foi derrotado! 🎉 Mas vem mais um...`);
      setTimeout(prepararInimigo, 1400);
    }
  } else {
    // venceu o capítulo
    mostrarVitoriaCapitulo();
  }
}

// Momento de descanso antes de enfrentar o chefão da ilha
function descansarAntesDoChefao() {
  ligarBotoes(false);

  const ehCozinheiro = jogador.profissao === "cozinheiro";

  // regenera vida: cozinheiro cura um pouco a mais (comida boa!)
  const porcentagem = ehCozinheiro ? 0.75 : 0.5;
  const antes = jogador.vida;
  jogador.vida = Math.min(jogador.vidaMax, jogador.vida + Math.round(jogador.vidaMax * porcentagem));
  const curou = jogador.vida - antes;

  if (ehCozinheiro) {
    escreverLog(`🧑‍🍳 ${jogador.nome} prepara um almoço quentinho para a equipe! 🍲 A comida recupera ${curou} de vida! ❤️`);
    desbloquear("primeiro_almoco");   // conquista do primeiro almoço!
    SONS.especial();
  } else {
    escreverLog(`😴 A equipe descansa e recupera as forças antes do grande desafio! ❤️ (+${curou} de vida)`);
    SONS.conquista();
  }
  atualizarBarras();

  // depois do descanso, o chefão aparece
  setTimeout(prepararInimigo, 2600);
}

function jogadorDerrotado() {
  SONS.derrota();
  const num = capituloAtual;
  mostrarTela("tela-fim");
  document.getElementById("fim-titulo").textContent = "Você foi derrotado... 💀";
  document.getElementById("fim-texto").textContent =
    `${jogador.nome} caiu em batalha, mas todo herói merece outra chance!`;
  document.getElementById("btn-fim").textContent = `🔁 Tentar o Capítulo ${num + 1} de novo`;
  document.getElementById("btn-fim").onclick = () => iniciarCapitulo(num);
}

function mostrarVitoriaCapitulo() {
  SONS.vitoria();
  // conquista do capítulo concluído
  desbloquear(["capitulo1", "capitulo2", "capitulo3", "capitulo4", "capitulo5", "final"][capituloAtual]);

  const temProximo = capituloAtual + 1 < CAPITULOS.length;
  const ehFinal = !temProximo; // último capítulo = fim da aventura

  mostrarTela("tela-fim");

  // ===== FINAL DA AVENTURA (venceu o Rei Bruxo) =====
  if (ehFinal) {
    document.getElementById("fim-titulo").textContent = "🎉 VOCÊ VENCEU O JOGO! 🎉";
    document.getElementById("fim-texto").textContent =
      `${jogador.nome} derrotou o Rei Bruxo Barba-Branca! 🧙‍♂️💥 O feitiço que separava o mundo foi quebrado, e a equipe — com o Ron 🐉 — finalmente voltou para o seu mundo! Você é um HERÓI LENDÁRIO! 🏆👑  FIM.`;
    document.getElementById("btn-fim").textContent = "🏅 Ver todas as Conquistas";
    document.getElementById("btn-fim").onclick = () => abrirAlbum("tela-fim");
    return;
  }

  document.getElementById("fim-titulo").textContent =
    `🏆 Capítulo ${capituloAtual + 1} Concluído!`;

  // mensagem de vitória de cada capítulo
  const mensagens = [
    `${jogador.nome} derrotou o chefão da Ilha da Selva! Mas o mar guarda novos perigos... 🏴‍☠️`,
    `${jogador.nome} afundou o Capitão Caveira e libertou a Ilha dos Piratas! ⚓ Mas uma ilha sombria surge na névoa... 👻`,
    `${jogador.nome} purificou a Ilha Mal-Assombrada e derrotou Sombrax! 🌟 Ao longe, dunas de areia brilham ao sol... 🏜️`,
    `${jogador.nome} derrotou o Faraó Rá e dominou a Ilha Deserta! 🏜️👑 Mas no horizonte, raios cortam o céu escuro... ⚡`,
    `${jogador.nome} derrotou Zoltrão e venceu a Ilha das Tempestades! ⚡🏆 Mas uma última ilha surge... com um castelo sombrio! 🏰`,
  ];
  document.getElementById("fim-texto").textContent = mensagens[capituloAtual];

  const prox = capituloAtual + 1;
  const ehUltimoAntesDoFinal = prox === CAPITULOS.length - 1;
  document.getElementById("btn-fim").textContent = ehUltimoAntesDoFinal
    ? "⚔️ Enfrentar o Rei Bruxo!"
    : `➡️ Ir para o Capítulo ${prox + 1}`;
  document.getElementById("btn-fim").onclick = () => iniciarCapitulo(prox);
}

// efeitinho de tremer quando leva/dá dano
function tremer(id) {
  const el = document.getElementById(id);
  if (!el) return;              // evita travar se o elemento não existir
  el.classList.remove("tremer");
  void el.offsetWidth; // reinicia a animação
  el.classList.add("tremer");
}

// ============================================
//  DESENHAR OS SPRITES FIXOS AO CARREGAR A PÁGINA
// ============================================
window.addEventListener("DOMContentLoaded", () => {
  // desenha todos os canvas que têm data-sprite (profissões, Ron...)
  document.querySelectorAll("canvas[data-sprite]").forEach(c => {
    desenharSprite(c, c.dataset.sprite, 5);
  });
});
