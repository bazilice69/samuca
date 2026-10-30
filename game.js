// ============================================
//  ILHAS PERDIDAS — A Aventura dos 4
// ============================================

// Guarda os dados do herói do jogador
const jogador = {
  nome: "",
  profissao: "",
  icone: "",
};

// Dados de cada profissão
const PROFISSOES = {
  policial:   { icone: "👮",    nome: "Policial",   desc: "Mantém a ordem e enfrenta os capangas de frente. Forte no combate!" },
  bombeiro:   { icone: "🚒",    nome: "Bombeiro",   desc: "Apaga incêndios e resgata a equipe de situações perigosas." },
  medico:     { icone: "🧑‍⚕️", nome: "Médico",     desc: "Cura os feridos e mantém a equipe viva durante a aventura." },
  cozinheiro: { icone: "🧑‍🍳", nome: "Cozinheiro", desc: "Cozinha pratos que dão energia e força para toda a equipe!" },
};

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
    `${jogador.nome} abre os olhos numa pequena ilha deserta. O mar se estende até o horizonte, cheio de outras ilhas misteriosas...`;
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
    `${jogador.nome} e sua equipe embarcam no pequeno barco rumo à primeira ilha... 🚢 (Em breve: a primeira batalha contra os capangas do chefão!)`;
  document.getElementById("heroi-sprite").textContent = "⛵";
  document.getElementById("btn-viajar").style.display = "none";
}
