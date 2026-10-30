// ============================================
//  SONS RETRÔ 8-BIT (gerados por código)
//  Usa Web Audio API — não precisa de arquivos!
// ============================================

let audioCtx = null;
let somLigado = true;

// cria/retoma o contexto de áudio (precisa ser após um toque do usuário)
function garantirAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// toca uma "nota" com onda quadrada (som clássico de videogame)
function bip(freq, duracao, tipo = "square", volume = 0.15, inicio = 0) {
  if (!somLigado || !audioCtx) return;
  const t0 = audioCtx.currentTime + inicio;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, t0);

  // envelope: sobe rápido e desce (evita "clique")
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duracao);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + duracao);
}

// toca uma sequência de notas (melodia)
function melodia(notas) {
  // notas = [[freq, duracao, atraso], ...]
  notas.forEach(([f, d, atraso]) => bip(f, d, "square", 0.15, atraso));
}

// ======= OS SONS DO JOGO =======
const SONS = {
  // ⚔️ ataque normal — bip curto descendo
  atacar() {
    bip(440, 0.08, "square", 0.18);
    bip(300, 0.08, "square", 0.18, 0.06);
  },

  // ✨ especial — som mágico subindo
  especial() {
    melodia([[523, 0.07, 0], [659, 0.07, 0.07], [784, 0.07, 0.14], [1046, 0.12, 0.21]]);
  },

  // 🛡️ defender — som curto grave
  defender() {
    bip(220, 0.12, "triangle", 0.2);
  },

  // 🐉 fogo do Ron — som crescente "whoosh"
  ron() {
    if (!somLigado || !audioCtx) return;
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, t0);
    osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.25);
    gain.gain.setValueAtTime(0.18, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(t0); osc.stop(t0 + 0.3);
  },

  // 😣 herói leva dano — bip grave
  dano() {
    bip(160, 0.15, "sawtooth", 0.2);
  },

  // 💥 inimigo derrotado — som de "pop"
  inimigoMorto() {
    melodia([[400, 0.06, 0], [300, 0.06, 0.06], [200, 0.1, 0.12]]);
  },

  // 🎉 vitória — melodia alegre
  vitoria() {
    melodia([[523, 0.12, 0], [659, 0.12, 0.12], [784, 0.12, 0.24], [1046, 0.25, 0.36]]);
  },

  // 💀 derrota — melodia triste descendo
  derrota() {
    melodia([[400, 0.15, 0], [350, 0.15, 0.15], [300, 0.15, 0.3], [200, 0.3, 0.45]]);
  },

  // ⬆️ subir de nível / conquista — ding feliz
  conquista() {
    melodia([[784, 0.1, 0], [1046, 0.18, 0.1]]);
  },

  // 👆 clique de botão de menu
  clique() {
    bip(600, 0.05, "square", 0.1);
  },
};

// liga/desliga o som (botão)
function alternarSom() {
  somLigado = !somLigado;
  localStorage.setItem("ilhas_som", somLigado ? "1" : "0");
  atualizarBotaoSom();
  if (somLigado) {
    garantirAudio();
    SONS.clique();
    // se estiver numa batalha, retoma a música da ilha
    const emBatalha = document.getElementById("tela-batalha")?.classList.contains("ativa");
    if (emBatalha && typeof capituloAtual !== "undefined") {
      const nome = ["selva", "pirata", "assombrado", "deserto", "tempestade"][capituloAtual];
      const lembrar = musicaAtual; musicaAtual = null; tocarMusica(nome || lembrar);
    }
  } else {
    pararMusica();
  }
}

function atualizarBotaoSom() {
  document.querySelectorAll(".btn-som").forEach(b => {
    b.textContent = somLigado ? "🔊" : "🔇";
  });
}

// carrega a preferência salva
function carregarPrefSom() {
  const salvo = localStorage.getItem("ilhas_som");
  if (salvo !== null) somLigado = (salvo === "1");
  atualizarBotaoSom();
}


// ============================================
//  MÚSICAS DE FUNDO 8-BIT (uma por ilha)
//  Cada música fica em loop durante o capítulo.
// ============================================

let musicaTimer = null;   // controla o loop da música
let musicaAtual = null;   // nome da música tocando

// notas musicais (frequências em Hz)
const NOTA = {
  C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00,
  _:0, // silêncio
};

// cada música é uma lista de notas; cada nota dura "passo" segundos
const MUSICAS = {
  // 🌴 SELVA — alegre e aventureira
  selva: {
    passo: 0.22,
    tipo: "square",
    volume: 0.06,
    notas: ["C4","E4","G4","E4","F4","A4","G4","E4","D4","F4","E4","C4","G3","C4","E4","G4"],
  },
  // 🏴‍☠️ PIRATAS — tema de marujo, meio heroico
  pirata: {
    passo: 0.26,
    tipo: "square",
    volume: 0.06,
    notas: ["A3","C4","E4","A4","G4","E4","C4","E4","D4","F4","A4","F4","E4","C4","A3","_"],
  },
  // 👻 ASSOMBRADA — sombria, lenta e tensa (tom menor)
  assombrado: {
    passo: 0.34,
    tipo: "triangle",
    volume: 0.07,
    notas: ["A3","_","C4","_","E4","D4","C4","_","A3","_","F3","_","E3","_","A3","_"],
  },
  // 🏜️ DESERTO — misteriosa, estilo oásis do oriente
  deserto: {
    passo: 0.24,
    tipo: "square",
    volume: 0.06,
    notas: ["D4","E4","F4","E4","D4","F4","G4","F4","E4","G4","A4","G4","F4","E4","D4","_"],
  },
  // ⚡ TEMPESTADE — intensa, rápida e elétrica (tom dramático)
  tempestade: {
    passo: 0.18,
    tipo: "sawtooth",
    volume: 0.05,
    notas: ["E4","E4","G4","E4","A4","G4","E4","D4","E4","G4","B4","A4","G4","E4","D4","_"],
  },
};

// toca uma música em loop
function tocarMusica(nome) {
  if (musicaAtual === nome) return; // já está tocando essa
  pararMusica();
  if (!somLigado || !audioCtx) { musicaAtual = nome; return; }

  const m = MUSICAS[nome];
  if (!m) return;
  musicaAtual = nome;

  let i = 0;
  const tocarProxima = () => {
    if (!somLigado) return; // respeita o botão de mudo
    const nota = m.notas[i % m.notas.length];
    const freq = NOTA[nota];
    if (freq > 0) bip(freq, m.passo * 0.9, m.tipo, m.volume);
    i++;
  };

  tocarProxima();
  musicaTimer = setInterval(tocarProxima, m.passo * 1000);
}

// para a música de fundo
function pararMusica() {
  if (musicaTimer) { clearInterval(musicaTimer); musicaTimer = null; }
  musicaAtual = null;
}
