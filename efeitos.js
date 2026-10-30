// ============================================
//  ANIMAÇÕES DE BATALHA ✨💥
//  Projéteis (magia voando), explosões e números de dano.
// ============================================

// pega a posição (centro) de um elemento dentro da arena
function posicaoNaArena(el) {
  const arena = document.querySelector(".batalha-arena");
  if (!arena || !el) return { x: 0, y: 0 };
  const a = arena.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  return {
    x: e.left - a.left + e.width / 2,
    y: e.top - a.top + e.height / 2,
  };
}

// lança um "projétil" (emoji) de um elemento até outro
// quando chega, chama o callback (ex: mostrar explosão)
function lancarProjetil(emoji, deEl, ateEl, callback, cor) {
  const camada = document.getElementById("camada-efeitos");
  if (!camada) { if (callback) callback(); return; }

  const ini = posicaoNaArena(deEl);
  const fim = posicaoNaArena(ateEl);

  const proj = document.createElement("div");
  proj.className = "efeito-projetil";
  proj.textContent = emoji;
  proj.style.left = ini.x + "px";
  proj.style.top = ini.y + "px";
  if (cor) proj.style.filter = `drop-shadow(0 0 6px ${cor})`;
  camada.appendChild(proj);

  // anima do início até o fim
  requestAnimationFrame(() => {
    proj.style.transform = `translate(-50%,-50%) translate(${fim.x - ini.x}px, ${fim.y - ini.y}px) scale(1.4)`;
  });

  setTimeout(() => {
    proj.remove();
    if (callback) callback();
  }, 480);
}

// explosão no local de um elemento
function explosao(el, emoji) {
  const camada = document.getElementById("camada-efeitos");
  if (!camada) return;
  const p = posicaoNaArena(el);
  const ex = document.createElement("div");
  ex.className = "efeito-explosao";
  ex.textContent = emoji || "💥";
  ex.style.left = p.x + "px";
  ex.style.top = p.y + "px";
  camada.appendChild(ex);
  setTimeout(() => ex.remove(), 600);
}

// número de dano saltando em cima de um elemento
function numeroDano(el, valor, tipo) {
  const camada = document.getElementById("camada-efeitos");
  if (!camada) return;
  const p = posicaoNaArena(el);
  const n = document.createElement("div");
  n.className = "efeito-numero " + (tipo || "");
  n.textContent = (tipo === "cura" ? "+" : "-") + valor;
  n.style.left = p.x + "px";
  n.style.top = (p.y - 30) + "px";
  camada.appendChild(n);
  setTimeout(() => n.remove(), 900);
}

// atalhos usados pelo jogo:

// herói ataca o inimigo (corte + explosão + dano)
function animAtaqueHeroi(dano) {
  const alvo = document.getElementById("batalha-inimigo-sprite");
  explosao(alvo, "💥");
  numeroDano(alvo, dano);
}

// herói usa especial (magia voa do herói até o inimigo)
function animEspecialHeroi(emoji, dano) {
  const de = document.getElementById("batalha-heroi-sprite");
  const ate = document.getElementById("batalha-inimigo-sprite");
  lancarProjetil(emoji || "✨", de, ate, () => {
    explosao(ate, "✨");
    if (dano) numeroDano(ate, dano);
  }, "#c77dff");
}

// Ron cospe fogo (bola de fogo voa até o inimigo)
function animFogoRon(dano) {
  const de = document.getElementById("ron-batalha");
  const ate = document.getElementById("batalha-inimigo-sprite");
  lancarProjetil("🔥", de, ate, () => {
    explosao(ate, "🔥");
    if (dano) numeroDano(ate, dano);
  }, "#ff6b35");
}

// inimigo ataca o herói
function animAtaqueInimigo(dano) {
  const alvo = document.getElementById("batalha-heroi-sprite");
  explosao(alvo, "💢");
  numeroDano(alvo, dano);
}

// magia do Rei Bruxo voa até o herói
function animMagiaRei(dano) {
  const de = document.getElementById("batalha-inimigo-sprite");
  const ate = document.getElementById("batalha-heroi-sprite");
  lancarProjetil("🔮", de, ate, () => {
    explosao(ate, "💥");
    if (dano) numeroDano(ate, dano);
  }, "#9b59b6");
}

// cura (número verde subindo no herói)
function animCura(valor) {
  const el = document.getElementById("batalha-heroi-sprite");
  explosao(el, "💚");
  numeroDano(el, valor, "cura");
}
