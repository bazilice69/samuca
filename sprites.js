// ============================================
//  SPRITES EM PIXEL ART (desenhados com código)
//  Cada sprite é uma grade de pixels: cada letra = uma cor.
// ============================================

// Paleta de cores (cada letra vira uma cor). "." = transparente (vazio)
const PALETA = {
  ".": null,          // vazio
  "K": "#1a1a2e",     // preto / contorno
  "S": "#f1c27d",     // pele
  "s": "#e0a96d",     // pele sombra
  "H": "#5a3a22",     // cabelo marrom
  "W": "#ffffff",     // branco
  "w": "#e6e6e6",     // branco sombra
  "B": "#1e3a8a",     // azul escuro (policial)
  "b": "#2563eb",     // azul
  "R": "#c0392b",     // vermelho (bombeiro)
  "r": "#e74c3c",     // vermelho claro
  "Y": "#f1c40f",     // amarelo
  "G": "#27ae60",     // verde
  "O": "#e67e22",     // laranja
  "P": "#9b59b6",     // roxo
  "C": "#3498db",     // azul claro
  "D": "#6b4423",     // marrom escuro (madeira)
  "N": "#2c3e50",     // cinza escuro
  "L": "#bdc3c7",     // cinza claro
  "F": "#ff6b35",     // fogo
  "f": "#ffd23f",     // fogo claro
  "g": "#145a32",     // verde escuro
  "T": "#8d5524",     // tom pele escura (variação)
  "Z": "#5d6d7e",     // cinza nuvem
  "z": "#85929e",     // cinza nuvem claro
  "V": "#f7dc6f",     // amarelo raio
  "A": "#34495e",     // azul tempestade escuro
  "I": "#9ee8ff",     // gelo azul-claro
  "i": "#5bc0eb",     // gelo azul
  "Q": "#dff9ff",     // brilho de neve/gelo
};

// ======= DESENHOS DOS HERÓIS (16x16 pixels) =======
const SPRITES = {
  // 👮 POLICIAL — boné e uniforme azul
  policial: [
    "................",
    ".....KKKKK......",
    "....KBBBBBK.....",
    "...KBBBBBBBK....",
    "...KKKKKKKKK....",
    "....KSSSSSK.....",
    "....SKSSKS S....",
    "....SSSSSSS.....",
    "....KSSSSSK.....",
    "...KBBBBBBBK....",
    "..KBBYBBYBBBK...",
    "..KBBBBBBBBK....",
    "..KBB.KK.BBK....",
    "..KSK....KSK....",
    "..KSK....KSK....",
    "..KKK....KKK....",
  ],

  // 🚒 BOMBEIRO — capacete vermelho e jaqueta
  bombeiro: [
    "................",
    "....KKKKKK......",
    "...KRRRRRRK.....",
    "..KRRRRRRRRK....",
    "..KKKKKKKKKK....",
    "...KSSSSSK......",
    "...SKSSKSS......",
    "...SSSSSSS......",
    "...KSSSSSK......",
    "..KRRRRRRRK.....",
    ".KRRYYYYRRRK....",
    ".KRRRRRRRRRK....",
    ".KRR.KK.RRK.....",
    ".KSK....KSK.....",
    ".KSK....KSK.....",
    ".KKK....KKK.....",
  ],

  // 🧑‍⚕️ MÉDICO — cabelo e jaleco branco com cruz
  medico: [
    "................",
    ".....HHHHH......",
    "....HHHHHHH.....",
    "...HHHHHHHHH....",
    "...HSSSSSSSH....",
    "....SKSSKS S....",
    "....SSSSSSS.....",
    "....KSSSSSK.....",
    "....KSSSSSK.....",
    "...WWWWWWWWW....",
    "..WWWWRWWWWW....",
    "..WWWRRRWWWW....",
    "..WWWWRWWWWW....",
    "..WSK...KSWW....",
    "..WSK...KSWW....",
    "..KKK...KKK.....",
  ],

  // 🧑‍🍳 COZINHEIRO — chapéu de chef e avental
  cozinheiro: [
    "....WWWWWW......",
    "...WWWWWWWW.....",
    "...WWWWWWWW.....",
    "....KKKKKK......",
    "....KSSSSSK.....",
    "....SKSSKSS.....",
    "....SSSSSSS.....",
    "....KSSSSSK.....",
    "....KSSSSSK.....",
    "...WWWWWWWWW....",
    "..WWWWWWWWWW....",
    "..WWKWWWWKWW....",
    "..WWWWWWWWWW....",
    "..WSK....KSW....",
    "..WSK....KSW....",
    "..KKK....KKK....",
  ],

  // ⛵ BARCO (quando viaja)
  barco: [
    "................",
    ".......WW.......",
    ".......WWW......",
    ".......WWWW.....",
    ".......W..W.....",
    ".......WWWW.....",
    ".......W........",
    ".......W........",
    "...DDDDDDDDD....",
    "..DDDDDDDDDDD...",
    "...DDDDDDDDD....",
    "....CCCCCCC.....",
    ".CCCCCCCCCCCCC..",
    "..CCCCCCCCCCC...",
    "................",
    "................",
  ],

  // 🐉 RON — filhote de dragão verde
  ron: [
    "................",
    "..........gg....",
    ".........gGGg...",
    "...gg....gGGg...",
    "..gGGg..gGGGg...",
    "..gGGGggGGGGg...",
    "..gGWKGGGKWGg...",
    "..gGGGGGGGGGg...",
    "..gGGGFFGGGGg...",
    "...gGGGGGGGg....",
    "....gGGGGGg.....",
    "...gGg..gGg.....",
    "...gGg..gGg.....",
    "..gg......gg....",
    "................",
    "................",
  ],

  // 🔥 MONSTRO DE LAVA — criatura de fogo laranja/vermelha
  lava: [
    "................",
    ".....FF.FF......",
    "....FFFFFFF.....",
    "...FFFFFFFFF....",
    "..FFKFFFFFKFF...",
    "..FFFFFFFFFFF...",
    "..FFFKKKKKFF F..",
    "..FFFFFFFFFFF...",
    "..RFFFFFFFFFR...",
    "..RRFFFFFFFRR...",
    "...RRRFFFRRR....",
    "..RRFRRRRRFRR...",
    "..RR.RRRRR.RR...",
    "..R...RRR...R...",
    ".......R........",
    "................",
  ],

  // 🐲 DRAGÃO DE FOGO — chefão da ilha de fogo (vermelho/laranja)
  chefe_fogo: [
    "...R........R...",
    "..RRR......RRR..",
    "..RRRR....RRRR..",
    ".RRRRRRRRRRRRRR.",
    ".RRRFFFFFFFFRRR.",
    "RRRFWKFFFFKWFRRR",
    "RRRFFFFFFFFFFRRR",
    "RRRFFFOOOOFFFRRR",
    ".RRFFFFFFFFFFRR.",
    ".RRRFFFFFFFFRRR.",
    "..RRRRFFFFRRRR..",
    "..RRFRRRRRRFRR..",
    "..RR.RR..RR.RR..",
    ".RR...R..R...RR.",
    ".R....R..R....R.",
    "................",
  ],

  // 🤖 ROBÔ CAPANGA — robô cinza metálico
  robo: [
    ".....LLLLL......",
    "....LLLLLLL.....",
    "....LNVNVNL.....",
    "....LLLLLLL.....",
    "....L.LLL.L.....",
    "...LLLLLLLLL....",
    "..LLNLLLLLNLL...",
    "..LLLLLLLLLLL...",
    "..LLLCCCCCLLL...",
    "..LLLLLLLLLLL...",
    "..LLNLLLLLNLL...",
    "...LL.....LL....",
    "...LL.....LL....",
    "..LLLL...LLLL...",
    "..LLLL...LLLL...",
    "................",
  ],

  // 🤖 ROBÔ CHEFÃO — mega robô azul/ciano com olhos vermelhos
  chefe_robo: [
    "....V.....V.....",
    "....L.....L.....",
    "...LLLLLLLLL....",
    "..LLCCCCCCCLL...",
    "..LCRCCCCCRCL...",
    "..LCCCCCCCCCL...",
    "..LCCKKKKKCCL...",
    ".LLLCCCCCCCLLL..",
    "LLLLCCCCCCCLLLL.",
    "LLNLCCCCCCCLNLL.",
    "LLLLCCCCCCCLLLL.",
    ".LLLCCCCCCCLLL..",
    "..LL.......LL...",
    "..LLLL...LLLL...",
    ".LLLLL...LLLLL..",
    "................",
  ],

  // 🧊 BOLHA DE GELO — pequeno monstro congelado
  bolha_gelo: [
    "................",
    "......QQQQ......",
    "....QQIIIIQQ....",
    "...QIIIIIIQIQ...",
    "...QIIQIIQIIQ...",
    "...QIIKIIKIIQ...",
    "...QIIIIIIIQ....",
    "....QIIKKIIQ....",
    "....QIIIIIIQ....",
    ".....QIIIIQ.....",
    "......QIIQ......",
    ".....QIIIIQ.....",
    "....QII..IIQ....",
    "....QIQ..QIQ....",
    "................",
    "................",
  ],

  // 🐺 LOBO DE GELO — fera azul da neve
  lobo_gelo: [
    "................",
    "....II....II....",
    "...IIII..IIII...",
    "...QIIIIIIIIQ...",
    "..QIIIKIIKIIIQ..",
    "..QIIIIIIIIIIQ..",
    "...QIIIKKIIIQ...",
    "....QIIIIIIQ....",
    "..iiiiQIIIIQii..",
    ".iiiiiQIIIIQiii.",
    "..iiiQIIIIIIQii.",
    "....QIIIQQIIIQ..",
    "....QIIQ..QIIQ..",
    "....QQQ....QQQ..",
    "................",
    "................",
  ],

  // 👑 REI CONGELANTE — chefão da Ilha de Gelo
  rei_congelante: [
    ".....QIQIQ......",
    "....QIIIIIQ.....",
    "....QIIIIIQ.....",
    "...QIIIIIIIQ....",
    "...QIISSSIIQ....",
    "...QISKSSKIQ....",
    "...QIISSSIIQ....",
    "...QIIKKKIIQ....",
    "..QIIQQQQQIIQ...",
    "..QIIQQQQQIIQ...",
    ".QIIIQQQQQIIIQ..",
    ".QIIIIIIIQIIIQ..",
    ".QIIQIIQIIQIIQ..",
    "..QIQ.....QIQ...",
    "..QQQ.....QQQ...",
    "................",
  ],

  // 🐉 RON ADULTO — dragão grande e imponente (verde escuro com asas)
  ron_adulto: [
    "...gg......gg...",
    "..gGGg....gGGg..",
    "..gGGGg..gGGGg..",
    ".gGGGGGggGGGGGg.",
    ".gGGGGGGGGGGGGg.",
    "gGGGWKGGGGKWGGGg",
    "gGGGGGGGGGGGGGGg",
    "gGGGGGFFFFGGGGGg",
    "gGGGGGGGGGGGGGGg",
    ".gGGGGGGGGGGGGg.",
    "..gGGGGGGGGGGg..",
    "...gGGGGGGGGg...",
    "..gGg..gg..gGg..",
    "..gGg..gg..gGg..",
    ".gg..........gg.",
    "................",
  ],

  // 🦍 CHEFÃO SELVA — gorilão
  chefe_selva: [
    "................",
    "...KKK..KKK.....",
    "..KNNNKKNNNK....",
    "..KNNNNNNNNK....",
    ".KNNSSSSSSNNK...",
    ".KNSWKSSKWSNK...",
    ".KNSSSSSSSSNK...",
    ".KNSSKKKKSSNK...",
    ".KNNSSSSSSNNK...",
    "KNNNNNNNNNNNNK..",
    "KNNNNNNNNNNNNK..",
    "KNNNNNNNNNNNNK..",
    ".KNNK....KNNK...",
    ".KNK......KNK...",
    ".KKK......KKK...",
    "................",
  ],

  // 👻 FANTASMA — assombração branca flutuante
  fantasma: [
    "................",
    ".....WWWWW......",
    "...WWWWWWWWW....",
    "..WWWWWWWWWWW...",
    "..WWWWWWWWWWW...",
    "..WWKKWWWKKWW...",
    "..WWKKWWWKKWW...",
    "..WWWWWWWWWWW...",
    "..WWWWKKKWWWW...",
    "..WWWWWWWWWWW...",
    "..WWWWWWWWWWW...",
    "..WWWWWWWWWWW...",
    "..WWWWWWWWWWW...",
    "..WW.WW.WW.WW...",
    "..W..WW..W..W...",
    "................",
  ],

  // 💀 ESQUELETO — caveira com ossos
  esqueleto: [
    "................",
    "....WWWWWW......",
    "...WWWWWWWW.....",
    "..WWWWWWWWWW....",
    "..WWKKWWKKWW....",
    "..WWKKWWKKWW....",
    "..WWWWWWWWWW....",
    "...WWKKKKWW.....",
    "...WKWKWKWW.....",
    "..LWWWWWWWWL....",
    ".L.WWWWWWWW.L...",
    "...WLWWWWLW.....",
    "...WLWWWWLW.....",
    "...WW....WW.....",
    "..LWW....WWL....",
    "................",
  ],

  // 👹 CHEFÃO ASSOMBRADO — grande espírito das trevas (roxo)
  chefe_assombrado: [
    ".....KKKKKK.....",
    "...KKPPPPPPKK...",
    "..KPPPPPPPPPPK..",
    ".KPPPPPPPPPPPPK.",
    ".KPPRRPPPPRRPPK.",
    ".KPPRRPPPPRRPPK.",
    ".KPPPPPPPPPPPPK.",
    ".KPPPKKKKKKPPPK.",
    ".KPPKFFFFFFKPPK.",
    ".KPPPPPPPPPPPPK.",
    "KPPPPPPPPPPPPPPK",
    "KPPPPPPPPPPPPPPK",
    "KPPKPPKPPKPPKPPK",
    ".KK.KK.KK.KK.KK.",
    "................",
    "................",
  ],

  // 🦂 ESCORPIÃO — bicho do deserto marrom/laranja
  escorpiao: [
    "................",
    "..K..........K..",
    "..KK........KK..",
    "...OK......KO...",
    "....OKOOOOOKO...",
    "...OOOOOOOOOOO..",
    "..OOKOOOOOKOOO..",
    "..OOOOOOOOOOOO..",
    "..OOOOOOOOOOOO..",
    "...OOOOOOOOOO...",
    "..O.OO.OO.OO.O..",
    ".O..O..O..O..O..",
    "...........KOOO.",
    "..........KOOK..",
    "..........KK....",
    "................",
  ],

  // 🧟 MÚMIA — enfaixada bege
  mumia: [
    "................",
    ".....LLLLL......",
    "....LLLLLLL.....",
    "...LLLLLLLLL....",
    "...LLKLLLKLL....",
    "...LLKLLLKLL....",
    "...LLLLLLLLL....",
    "...LwwwwwwwL....",
    "..LLLwwwwwLLL...",
    "..LwwLwwwLwwL...",
    "..LLwwwwwwwLL...",
    "..LwwLwwwLwwL...",
    "..LLLwwwwwLLL...",
    "..LwL.....LwL...",
    "..LLL.....LLL...",
    "................",
  ],

  // 👑 CHEFÃO DESERTO — faraó dourado
  chefe_farao: [
    ".....YYYYY......",
    "....YKKKKKY.....",
    "...YKBBBBBKY....",
    "...YKBYYYBKY....",
    "...KSSSSSSSK....",
    "...KSKSSKSSK....",
    "...KSSSSSSSK....",
    "...KSSKKKSSSK...",
    "...YKSSSSSSKY...",
    "..YYKYYYYKYYY...",
    "..YKKYYYYYKKY...",
    "..YKBBBBBBBKY...",
    "..YKBYBYBYBKY...",
    "..YKK.....KKY...",
    "..YYK.....KYY...",
    "...KK.....KK....",
  ],

  // ☁️ NUVEM DE TEMPESTADE — nuvem cinza com raio
  nuvem: [
    "................",
    "....ZZZZZ.......",
    "..ZZzzzzzZZ.....",
    ".ZzzzzzzzzzZ....",
    "ZzzzzzzzzzzzZ...",
    "ZzzKKzzzKKzzZ...",
    "ZzzzzzzzzzzzZ...",
    ".ZzzzzzzzzzZ....",
    "..ZZZZZZZZZZ....",
    ".....VV.........",
    "....VV..........",
    "...VVVV.........",
    "....VV..........",
    "...VV...........",
    "..VV............",
    "................",
  ],

  // 🦅 AVE DA TEMPESTADE — águia azul-escura
  ave: [
    "................",
    ".......KK.......",
    "......KAAK......",
    "...KKKAAAAKKK...",
    "..KAAAAAAAAAAK..",
    ".KAAAAVVVVAAAAK.",
    "KAAAAAVKKVAAAAAK",
    ".KAAAAAAAAAAAAK.",
    "..KAAAAAAAAAAK..",
    "...KAAAAAAAAk...",
    "....KAAAAAAK....",
    ".....KAAAAK.....",
    "......KVVK......",
    ".......VV.......",
    "......VV........",
    "................",
  ],

  // ⚡ CHEFÃO TEMPESTADE — Deus do Trovão
  chefe_trovao: [
    ".....VVVVV......",
    "....VAAAAAV.....",
    "...VAAAAAAAV....",
    "..VAASSSSSAAV...",
    "..VASWKSSKWSAV..",
    "..VASSSSSSSAV...",
    "..VAASSSSSAAV...",
    "...VAAAAAAAV....",
    "..VAAVAAAVAAV...",
    ".VAAAVAAAVAAAV..",
    ".VAAAAVAVAAAAV..",
    ".VAAAAAVAAAAAAV.",
    "..VAAV.V.VAAV...",
    "...VV..V..VV....",
    "...V...V...V....",
    ".......V........",
  ],

  // 🧙 GUARDA REAL — soldado do rei (armadura roxa)
  guarda: [
    "................",
    ".....KKKKK......",
    "....KLLLLLK.....",
    "....KLLLLLK.....",
    "....KSSSSSK.....",
    "....SKSSKSS.....",
    "....SSSSSSS.....",
    "...KPPPPPPPK....",
    "..KPPLLLLLPPPK..",
    "..KPPLPPPLPPPK..",
    "..KPPPPPPPPPK...",
    "...KPPPPPPPK....",
    "...KPP.KK.PK....",
    "...KSK....KS....",
    "...KKK....KK....",
    "................",
  ],

  // 🧙‍♂️ REI BRUXO — velho com coroa e barba branca gigante (CHEFÃO FINAL)
  rei_bruxo: [
    ".....YVYVY......",
    "....YYYYYYY.....",
    "....KKKKKKK.....",
    "...KSSSSSSSK....",
    "...KSKSSKS SK...",
    "...KSSSSSSSK....",
    "...WKSSSSSKW....",
    "..WWWWKKKWWWW...",
    ".WWWWWWWWWWWWW..",
    ".WWWWWWWWWWWWW..",
    "..WWWPPPPPWWWW..",
    "..PWWWPPPWWWWP..",
    ".PPPWWWWWWWPPP..",
    ".PPP.WWWWW.PPP..",
    ".PP..WW.WW..PP..",
    ".....KK.KK......",
  ],

  // 🏴‍☠️ CHEFÃO PIRATA — capitão caveira
  chefe_pirata: [
    "................",
    "...KKKKKKKK.....",
    "..KNNNNNNNNK....",
    ".KNRRRRRRRRNK...",
    ".KNRRRRRRRRNK...",
    "..KWWWWWWWWK....",
    "..KWKWWWWKWK....",
    "..KWWWKKWWWK....",
    "..KWWWWWWWWK....",
    "...KWKWKWKW.....",
    "...KWKWKWKW.....",
    "..KNNNNNNNNK....",
    ".KNNNNNNNNNNK...",
    ".KNNK....KNNK...",
    ".KKK......KKK...",
    "................",
  ],
};

// ======= FUNÇÃO QUE DESENHA O SPRITE NUM CANVAS =======
function desenharSprite(canvas, nomeSprite, tamanhoPixel) {
  const grade = SPRITES[nomeSprite];
  if (!grade || !canvas) return;

  const ctx = canvas.getContext("2d");
  const px = tamanhoPixel || 6;
  const linhas = grade.length;
  const colunas = grade[0].length;

  canvas.width = colunas * px;
  canvas.height = linhas * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < linhas; y++) {
    for (let x = 0; x < grade[y].length; x++) {
      const cor = PALETA[grade[y][x]];
      if (cor) {
        ctx.fillStyle = cor;
        ctx.fillRect(x * px, y * px, px, px);
      }
    }
  }
}

// cria um <canvas> já desenhado (usado nos botões de escolher profissão)
function criarCanvasSprite(nomeSprite, tamanhoPixel) {
  const c = document.createElement("canvas");
  desenharSprite(c, nomeSprite, tamanhoPixel);
  return c;
}
