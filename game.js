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

  const p = PROFISSOES[jogador.profissao];
  document.getElementById("heroi-sprite").textContent = p.icone;
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
  document.getElementById("heroi-sprite").textContent = "⛵";
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
    inimigos: [
      { tipo: "capanga", nome: "Capanga Fominha", emoji: "👹", vidaMax: 50,  ataque: 10 },
      { tipo: "capanga", nome: "Capanga Brutamontes", emoji: "👺", vidaMax: 70,  ataque: 14 },
      { tipo: "chefao",  nome: "GRRRAU, o Chefão da Selva", emoji: "🦍", vidaMax: 130, ataque: 20 },
    ],
  },
  {
    titulo: "Capítulo 2 — A Ilha dos Piratas 🏴‍☠️",
    inimigos: [
      { tipo: "capanga", nome: "Pirata Perna-de-Pau", emoji: "🦜", vidaMax: 75,  ataque: 15 },
      { tipo: "capanga", nome: "Pirata Barba-Negra", emoji: "🧔‍♂️", vidaMax: 95,  ataque: 19 },
      { tipo: "chefao",  nome: "Capitão Caveira, o Rei dos Mares", emoji: "🏴‍☠️", vidaMax: 170, ataque: 26 },
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

  // no 1º capítulo começa com vida cheia; nos seguintes, recupera parte da vida
  if (num === 0) {
    jogador.vida = jogador.vidaMax;
  } else {
    jogador.vida = Math.min(jogador.vidaMax, jogador.vida + 40);
  }

  mostrarTela("tela-batalha");

  const p = PROFISSOES[jogador.profissao];
  document.getElementById("batalha-heroi-sprite").textContent = p.icone;
  document.getElementById("batalha-heroi-nome").textContent = jogador.nome;

  document.getElementById("cap-titulo").textContent = CAPITULOS[num].titulo;

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

  document.getElementById("batalha-inimigo-sprite").textContent = inimigoAtual.emoji;
  document.getElementById("batalha-inimigo-nome").textContent = inimigoAtual.nome;

  atualizarBarras();

  const intro = inimigoAtual.tipo === "chefao"
    ? `⚠️ O CHEFÃO apareceu! ${inimigoAtual.nome} ruge furioso!`
    : `Um ${inimigoAtual.nome} bloqueia o caminho!`;
  escreverLog(intro);

  ligarBotoes(true);
}

function atualizarBarras() {
  // vida do herói
  const pHeroi = Math.max(0, (jogador.vida / jogador.vidaMax) * 100);
  document.getElementById("barra-heroi").style.width = pHeroi + "%";
  document.getElementById("vida-heroi-txt").textContent = `${Math.max(0, jogador.vida)}/${jogador.vidaMax}`;

  // vida do inimigo
  const pIni = Math.max(0, (inimigoAtual.vida / inimigoAtual.vidaMax) * 100);
  document.getElementById("barra-inimigo").style.width = pIni + "%";
  document.getElementById("vida-inimigo-txt").textContent = `${Math.max(0, inimigoAtual.vida)}/${inimigoAtual.vidaMax}`;
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
  const p = PROFISSOES[jogador.profissao];
  const dano = p.ataque + Math.floor(Math.random() * 8); // um pouco de sorte
  inimigoAtual.vida -= dano;
  tremer("batalha-inimigo-sprite");
  escreverLog(`${jogador.nome} atacou e causou ${dano} de dano! 💥`);
  atualizarBarras();
  fimDoTurnoJogador();
}

function acaoEspecial() {
  if (!turnoDoJogador) return;
  const esp = PROFISSOES[jogador.profissao].especial;
  let msg = `${jogador.nome} usou ${esp.nome} ${esp.emoji} — ${esp.texto}!`;

  if (esp.dano) {
    inimigoAtual.vida -= esp.dano;
    tremer("batalha-inimigo-sprite");
  }
  if (esp.cura) {
    jogador.vida = Math.min(jogador.vidaMax, jogador.vida + esp.cura);
  }
  escreverLog(msg);
  atualizarBarras();
  fimDoTurnoJogador();
}

function acaoDefender() {
  if (!turnoDoJogador) return;
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
let ronEnergia = 3;         // começa pronto
const RON_MAX = 3;          // precisa de 3 de energia pra cuspir fogo
const RON_CUSTO = 3;

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

  desbloquear("primeira_luta");           // primeira vitória em combate

  // conquistas que dependem do capítulo
  if (capituloAtual === 1) desbloquear("pirata");
  if (eraChefao) desbloquear(capituloAtual === 0 ? "chefao1" : "chefao2");

  indiceInimigo++;

  if (indiceInimigo < lista.length) {
    escreverLog(`${inimigoAtual.nome} foi derrotado! 🎉 Mas vem mais um...`);
    setTimeout(prepararInimigo, 1400);
  } else {
    // venceu o capítulo
    mostrarVitoriaCapitulo();
  }
}

function jogadorDerrotado() {
  const num = capituloAtual;
  mostrarTela("tela-fim");
  document.getElementById("fim-titulo").textContent = "Você foi derrotado... 💀";
  document.getElementById("fim-texto").textContent =
    `${jogador.nome} caiu em batalha, mas todo herói merece outra chance!`;
  document.getElementById("btn-fim").textContent = `🔁 Tentar o Capítulo ${num + 1} de novo`;
  document.getElementById("btn-fim").onclick = () => iniciarCapitulo(num);
}

function mostrarVitoriaCapitulo() {
  // conquista do capítulo concluído
  desbloquear(capituloAtual === 0 ? "capitulo1" : "capitulo2");

  mostrarTela("tela-fim");
  const temProximo = capituloAtual + 1 < CAPITULOS.length;

  document.getElementById("fim-titulo").textContent =
    `🏆 Capítulo ${capituloAtual + 1} Concluído!`;

  if (capituloAtual === 0) {
    document.getElementById("fim-texto").textContent =
      `${jogador.nome} derrotou o chefão da Ilha da Selva! Mas o mar guarda novos perigos... 🏴‍☠️`;
  } else {
    document.getElementById("fim-texto").textContent =
      `${jogador.nome} afundou o Capitão Caveira e libertou a Ilha dos Piratas! ⚓ A equipe está cada vez mais perto de casa.`;
  }

  if (temProximo) {
    const prox = capituloAtual + 1;
    document.getElementById("btn-fim").textContent = `➡️ Ir para o Capítulo ${prox + 1}`;
    document.getElementById("btn-fim").onclick = () => iniciarCapitulo(prox);
  } else {
    // acabou o conteúdo disponível por enquanto
    document.getElementById("btn-fim").textContent = "🏅 Ver Álbum de Conquistas";
    document.getElementById("btn-fim").onclick = () => abrirAlbum("tela-fim");
  }
}

// efeitinho de tremer quando leva/dá dano
function tremer(id) {
  const el = document.getElementById(id);
  el.classList.remove("tremer");
  void el.offsetWidth; // reinicia a animação
  el.classList.add("tremer");
}
