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
  if (somLigado) { garantirAudio(); SONS.clique(); }
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
