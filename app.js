// @ts-nocheck
(() => {
  'use strict';

  const STORAGE_KEY = 'bom-chefe-worlds-v1';
  const MAP_WIDTH = 10;
  const MAP_HEIGHT = 7;
  const COMPLAINT_COST = 8;
  const DROP_COST = 8;
  const ROLES = {
    chef: { name: 'Cozinheiro', icon: '👨‍🍳' },
    waiter: { name: 'Garçom', icon: '🧑‍💼' },
    pimentinha: { name: 'Pimentinha', icon: '🐉' },
  };

  const ingredients = {
    bread: { name: 'pão', icon: '🍞' }, meat: { name: 'hambúrguer', icon: '🥩' }, cheese: { name: 'queijo', icon: '🧀' },
    lettuce: { name: 'salada', icon: '🥬' }, fries: { name: 'batata', icon: '🍟' }, drink: { name: 'bebida', icon: '🥤' },
    mexicanPepper: { name: 'pimenta mexicana', icon: '🇲🇽🌶️' }, indianPepper: { name: 'pimenta indiana', icon: '🇮🇳🌶️' }, chinesePepper: { name: 'pimenta chinesa', icon: '🇨🇳🌶️' },
  };
  const recipes = [
    { name: 'X-Bom', items: ['bread', 'meat', 'cheese'], value: 20, icon: '🍔' },
    { name: 'X-Salada', items: ['bread', 'meat', 'lettuce'], value: 22, icon: '🥗' },
    { name: 'Combo da Casa', items: ['bread', 'meat', 'fries', 'drink'], value: 28, icon: '🍟' },
    { name: 'Batata e Bebida', items: ['fries', 'drink'], value: 14, icon: '🥤' },
  ];
  const rarinho = { name: 'Rarinho', items: ['mexicanPepper', 'indianPepper', 'chinesePepper'], value: 3, icon: '🌶️' };
  const kitchenStations = [
    { x: 1, y: 1, ingredient: 'bread' }, { x: 3, y: 1, ingredient: 'meat' }, { x: 5, y: 1, ingredient: 'cheese' }, { x: 7, y: 1, ingredient: 'lettuce' },
    { x: 1, y: 3, ingredient: 'fries' }, { x: 3, y: 3, ingredient: 'drink' }, { x: 7, y: 3, ingredient: 'mexicanPepper' },
    { x: 1, y: 5, ingredient: 'indianPepper' }, { x: 3, y: 5, ingredient: 'chinesePepper' },
  ];
  const kitchenCounter = { x: 8, y: 5 };
  const kitchenStoves = [{ x: 5, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 4 }, { x: 6, y: 4 }];
  const waiterCounter = { x: 1, y: 3 };
  const tables = [{ x: 5, y: 1, number: 1 }, { x: 8, y: 1, number: 2 }, { x: 5, y: 5, number: 3 }, { x: 8, y: 5, number: 4 }];
  const reception = { x: 1, y: 3 };
  const stageTiles = [{ x: 6, y: 3 }, { x: 7, y: 3 }];
  const children = [{ name: 'Lia', icon: '👧' }, { name: 'Davi', icon: '🧒' }, { name: 'Bia', icon: '👧🏽' }, { name: 'Rafa', icon: '🧒🏾' }];
  const showQuestions = [
    { question: 'Pimentinha, você é menino ou menina?', answer: 'Eu sou Pimentinha, um dragão de fogo amigo de todos!' },
    { question: 'Qual é sua comida favorita?', answer: 'Pimenta mágica! Ela faz minhas escamas brilharem!' },
    { question: 'Você consegue voar?', answer: 'Consigo sim! Mas hoje vim dançar aqui no restaurante!' },
    { question: 'Por que você cospe fogo?', answer: 'Porque meu coração é quentinho e cheio de alegria!' },
  ];

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    home: $('#home-screen'), create: $('#create-screen'), game: $('#game-screen'), logo: $('#logo-button'), openCreate: $('#open-create-world'),
    cancelCreate: $('#cancel-create-world'), createWorld: $('#create-world-button'), worldName: $('#world-name'), worldList: $('#world-list'), backToWorlds: $('#back-to-worlds'),
    roleInputs: document.querySelectorAll('input[name="role"]'), roleBadge: $('#role-badge'), gameTitle: $('#game-title'), scoreBox: $('#score-box'), scoreIcon: $('#score-icon'), scoreValue: $('#coins-value'),
    missionIcon: $('#mission-icon'), missionOverline: $('#mission-overline'), missionTitle: $('#mission-title'), missionText: $('#mission-text'), timerWrap: $('#timer-wrap'), timerBar: $('#timer-bar'),
    map: $('#game-map'), legend: $('#map-legend'), gameMessage: $('#game-message'), moveButtons: document.querySelectorAll('[data-move]'), actionButton: $('#action-button'),
    help: $('#help-dialog'), openHelp: $('#help-button'), closeHelp: $('#close-help-button'), closeHelpMain: $('#close-help-main'),
    showDialog: $('#show-dialog'), closeShow: $('#close-show-button'), questionOptions: $('#question-options'),
  };

  function loadWorlds() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved.filter((world) => world && world.id && ROLES[world.role]) : [];
    } catch { return []; }
  }

  let worlds = loadWorlds();
  let currentWorld = null;
  let session = null;
  let gameTimer = null;
  let nextMissionTimeout = null;

  function makeId() { return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function saveWorlds() { localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds)); }
  function roleName(role) { return ROLES[role]?.name || 'Personagem'; }
  function roleIcon(role) { return ROLES[role]?.icon || '❔'; }
  function getRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
  function isShowDay(date = new Date()) { return [0, 6].includes(date.getDay()); }
  function setScreen(screen) { elements.home.classList.toggle('is-hidden', screen !== 'home'); elements.create.classList.toggle('is-hidden', screen !== 'create'); elements.game.classList.toggle('is-hidden', screen !== 'game'); }
  function setMessage(message, kind = '') { elements.gameMessage.textContent = message; elements.gameMessage.className = `game-message ${kind}`; }
  function isNear(first, second) { return Math.abs(first.x - second.x) + Math.abs(first.y - second.y) <= 1; }
  function pointIs(point, other) { return point.x === other.x && point.y === other.y; }

  function renderWorlds() {
    elements.worldList.replaceChildren();
    if (!worlds.length) {
      const empty = document.createElement('p'); empty.className = 'empty-worlds'; empty.textContent = 'Você ainda não criou nenhum mundo. Crie o primeiro e escolha sua carreira!'; elements.worldList.append(empty); return;
    }
    worlds.forEach((world) => {
      const card = document.createElement('article'); card.className = 'world-card';
      const icon = document.createElement('span'); icon.className = 'world-role-icon'; icon.textContent = roleIcon(world.role);
      const info = document.createElement('div'); info.className = 'world-info';
      const name = document.createElement('strong'); name.textContent = world.name;
      const details = document.createElement('span');
      details.textContent = world.role === 'pimentinha'
        ? `${roleName(world.role)} · ⭐ ${world.joyStars ?? 0} · ${world.welcomed ?? 0} crianças felizes`
        : `${roleName(world.role)} · 🪙 ${world.coins} · ${world.served} entregas`;
      info.append(name, details);
      const play = document.createElement('button'); play.className = 'world-play'; play.type = 'button'; play.textContent = 'Jogar ▶'; play.addEventListener('click', () => openWorld(world.id));
      card.append(icon, info, play); elements.worldList.append(card);
    });
  }

  function chooseRoleVisual() { document.querySelectorAll('.role-choice').forEach((choice) => choice.classList.toggle('selected', choice.querySelector('input').checked)); }
  function openCreate() { elements.worldName.value = ''; document.querySelector('input[name="role"][value="chef"]').checked = true; chooseRoleVisual(); setScreen('create'); window.setTimeout(() => elements.worldName.focus(), 0); }

  function createWorld() {
    const name = elements.worldName.value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    if (!name) { elements.worldName.focus(); elements.worldName.setAttribute('aria-invalid', 'true'); return; }
    elements.worldName.removeAttribute('aria-invalid');
    const world = { id: makeId(), name, role, coins: 25, served: 0, mistakes: 0, tricks: 0, joyStars: 0, welcomed: 0 };
    worlds.unshift(world); saveWorlds(); openWorld(world.id);
  }

  function openWorld(id) {
    currentWorld = worlds.find((world) => world.id === id) || null;
    if (!currentWorld) return;
    session = { player: { x: 4, y: 6 }, order: null, delivery: null, held: [], complaint: false, laughing: false, pimentinha: null, changingMission: false };
    setScreen('game');
    elements.roleBadge.textContent = `${roleIcon(currentWorld.role)} ${roleName(currentWorld.role).toUpperCase()}`;
    elements.gameTitle.textContent = currentWorld.name;
    if (currentWorld.role === 'chef') { setMessage('Siga os quadrados brilhando. Fique em cima de um e aperte AÇÃO para pegar o ingrediente.'); startKitchenOrder(); }
    else if (currentWorld.role === 'waiter') { setMessage('Vá até o balcão para pegar o prato pronto.'); startDelivery(); }
    else { setMessage(isShowDay() ? 'Hoje é fim de semana! Vá ao palco para o Show do Pimentinha.' : 'Vá até a criança na recepção e aperte AÇÃO para recebê-la.'); startPimentinhaShift(); }
    renderGame(); window.setTimeout(() => elements.map.focus(), 0);
  }

  function leaveWorld() { clearTimeout(nextMissionTimeout); if (elements.showDialog.open) elements.showDialog.close(); currentWorld = null; session = null; setScreen('home'); renderWorlds(); }
  function persistWorld() { if (currentWorld) saveWorlds(); }

  function getBlockedTile(x, y) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return 'wall';
    if (currentWorld.role === 'chef') {
      if (pointIs({ x, y }, kitchenCounter)) return 'counter';
      if (kitchenStoves.some((stove) => pointIs({ x, y }, stove))) return 'stove';
      return null;
    }
    if (pointIs({ x, y }, waiterCounter)) return 'counter';
    if (tables.some((table) => pointIs({ x, y }, table))) return 'table';
    if (currentWorld.role === 'pimentinha' && stageTiles.some((tile) => pointIs({ x, y }, tile))) return 'stage';
    return null;
  }

  function move(direction) {
    if (!currentWorld || !session || session.changingMission || elements.showDialog.open) return;
    const movement = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[direction];
    if (!movement) return;
    const next = { x: session.player.x + movement.x, y: session.player.y + movement.y };
    const blocked = getBlockedTile(next.x, next.y);
    if (blocked) {
      if (currentWorld.role === 'waiter' && session.delivery?.carrying) dropPlate();
      else if (blocked === 'wall') setMessage('Tem uma parede aí. Procure outro caminho.');
      else if (currentWorld.role === 'pimentinha') setMessage('Aproxime-se do palco ou da criança, mas não entre nos móveis.');
      return;
    }
    session.player = next; renderMap();
  }

  function startKitchenOrder() { session.changingMission = false; session.order = { recipe: getRandom(recipes), timeLeft: 60, maxTime: 60 }; session.held = []; renderGame(); }
  function sameIngredients(first, second) { if (first.length !== second.length) return false; const expected = [...second].sort(); return [...first].sort().every((item, index) => item === expected[index]); }
  function findKitchenStation(position) { return kitchenStations.find((station) => pointIs(position, station)); }

  function kitchenInteract() {
    if (!session.order || session.changingMission) return;
    const station = findKitchenStation(session.player);
    if (station) {
      if (session.held.length >= 5) { setMessage('Suas mãos estão cheias. Leve os ingredientes ao balcão.'); return; }
      session.held.push(station.ingredient); setMessage(`Você pegou ${ingredients[station.ingredient].name}.`); renderGame(); return;
    }
    if (isNear(session.player, kitchenCounter)) {
      if (!session.held.length) { setMessage('Pegue os ingredientes do pedido antes de servir.'); return; }
      if (sameIngredients(session.held, session.order.recipe.items)) {
        const coins = session.order.recipe.value; currentWorld.coins += coins; currentWorld.served += 1; persistWorld(); session.held = []; session.order = null; session.changingMission = true;
        setMessage(`Pedido entregue! Você ganhou ${coins} moedas.`, 'success'); renderGame(); nextMissionTimeout = window.setTimeout(startKitchenOrder, 1600);
      } else if (sameIngredients(session.held, rarinho.items)) serveRarinho();
      else customerComplaint('O prato estava errado!');
      return;
    }
    setMessage('Fique em cima de uma bancada ou perto do balcão.');
  }

  function serveRarinho() {
    currentWorld.coins += rarinho.value; currentWorld.tricks = (currentWorld.tricks || 0) + 1; persistWorld();
    session.order = null; session.held = []; session.complaint = true; session.laughing = false; session.changingMission = true;
    setMessage(`🌶️ Você serviu o Rarinho e ganhou ${rarinho.value} moedas. O cliente veio reclamar!`, 'success'); renderGame();
    nextMissionTimeout = window.setTimeout(() => {
      if (!session) return;
      session.complaint = false; session.laughing = true; setMessage('O cliente foi embora. 😂 O cozinheiro está rindo muito da pegadinha!', 'success'); renderGame();
      nextMissionTimeout = window.setTimeout(() => { if (!session) return; session.laughing = false; startKitchenOrder(); }, 1800);
    }, 2200);
  }

  function customerComplaint(reason) {
    if (!session || session.changingMission) return;
    currentWorld.coins = Math.max(0, currentWorld.coins - COMPLAINT_COST); currentWorld.mistakes += 1; persistWorld();
    session.order = null; session.held = []; session.complaint = true; session.changingMission = true;
    setMessage(`😡 Cliente reclamando na cozinha: ${reason} Você perdeu ${COMPLAINT_COST} moedas.`, 'error'); renderGame();
    nextMissionTimeout = window.setTimeout(() => { if (!session) return; session.complaint = false; startKitchenOrder(); }, 2200);
  }

  function startDelivery() { session.changingMission = false; session.delivery = { table: getRandom(tables), meal: getRandom(recipes), carrying: false }; renderGame(); }
  function waiterInteract() {
    if (!session.delivery || session.changingMission) return;
    const delivery = session.delivery;
    if (!delivery.carrying && isNear(session.player, waiterCounter)) { delivery.carrying = true; setMessage(`Prato na mão! Leve o ${delivery.meal.name} à Mesa ${delivery.table.number}.`); renderGame(); return; }
    if (delivery.carrying && isNear(session.player, delivery.table)) {
      currentWorld.coins += delivery.meal.value; currentWorld.served += 1; persistWorld(); session.delivery = null; session.changingMission = true;
      setMessage(`Entrega concluída! Você ganhou ${delivery.meal.value} moedas.`, 'success'); renderGame(); nextMissionTimeout = window.setTimeout(startDelivery, 1500); return;
    }
    setMessage(!delivery.carrying ? 'Vá ao balcão e aperte AÇÃO para pegar o prato.' : `Você está com o prato. Procure a Mesa ${delivery.table.number}.`);
  }
  function dropPlate() {
    if (!session?.delivery?.carrying || session.changingMission) return;
    currentWorld.coins = Math.max(0, currentWorld.coins - DROP_COST); currentWorld.mistakes += 1; persistWorld(); session.delivery = null; session.changingMission = true;
    setMessage(`💥 O prato caiu no chão! Você perdeu ${DROP_COST} moedas.`, 'error'); renderGame(); nextMissionTimeout = window.setTimeout(startDelivery, 2000);
  }

  function startPimentinhaShift() {
    if (!session || !currentWorld || currentWorld.role !== 'pimentinha') return;
    session.changingMission = false;
    const child = getRandom(children);
    const show = isShowDay();
    session.pimentinha = { type: show ? 'show' : 'welcome', child, question: null, guestPosition: show ? { x: 6, y: 3 } : { x: 0, y: 3 } };
    renderGame();
  }

  function openShowQuestions() {
    elements.questionOptions.replaceChildren();
    showQuestions.forEach((item, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'question-button'; button.textContent = item.question;
      button.addEventListener('click', () => answerShowQuestion(index)); elements.questionOptions.append(button);
    });
    elements.showDialog.showModal();
  }

  function answerShowQuestion(index) {
    if (!session?.pimentinha || session.changingMission) return;
    const question = showQuestions[index];
    elements.showDialog.close();
    session.pimentinha.question = question;
    session.changingMission = true;
    currentWorld.joyStars = (currentWorld.joyStars ?? 0) + 2;
    currentWorld.welcomed = (currentWorld.welcomed ?? 0) + 1;
    persistWorld();
    setMessage(`🎤 ${session.pimentinha.child.name} perguntou: “${question.question}” Pimentinha respondeu: “${question.answer}” Você ganhou 2 estrelas!`, 'success');
    renderGame();
    nextMissionTimeout = window.setTimeout(startPimentinhaShift, 4200);
  }

  function pimentinhaInteract() {
    const task = session.pimentinha;
    if (!task || session.changingMission) return;
    if (task.type === 'show') {
      if (stageTiles.some((tile) => isNear(session.player, tile))) { openShowQuestions(); return; }
      setMessage('Vá para perto do palco 🎤 e aperte AÇÃO para começar o show.'); return;
    }
    if (isNear(session.player, task.guestPosition)) {
      currentWorld.joyStars = (currentWorld.joyStars ?? 0) + 1;
      currentWorld.welcomed = (currentWorld.welcomed ?? 0) + 1;
      persistWorld(); session.changingMission = true;
      setMessage(`${task.child.name} ficou muito feliz ao conhecer o Pimentinha! Você ganhou 1 estrela.`, 'success'); renderGame(); nextMissionTimeout = window.setTimeout(startPimentinhaShift, 1600); return;
    }
    setMessage('Aproxime-se da criança na recepção e aperte AÇÃO.');
  }

  function interact() {
    if (!currentWorld || !session) return;
    if (currentWorld.role === 'chef') kitchenInteract();
    else if (currentWorld.role === 'waiter') waiterInteract();
    else pimentinhaInteract();
  }

  function specialTile(x, y) {
    if (currentWorld.role === 'chef') {
      const station = kitchenStations.find((item) => item.x === x && item.y === y);
      if (station) {
        const needed = session?.order?.recipe.items.includes(station.ingredient) && !session.held.includes(station.ingredient);
        return { className: `is-station${needed ? ' is-needed' : ''}`, symbol: ingredients[station.ingredient].icon };
      }
      if (pointIs({ x, y }, kitchenCounter)) return { className: 'is-counter', symbol: '🍽️' };
      if (kitchenStoves.some((stove) => pointIs({ x, y }, stove))) return { className: 'is-wall', symbol: '🔥' };
      if (x === 8 && y === 6) return { className: 'is-door', symbol: '🚪' };
      return { className: '', symbol: '' };
    }
    if (currentWorld.role === 'pimentinha') {
      if (pointIs({ x, y }, reception)) return { className: 'is-reception', symbol: '👋' };
      if (stageTiles.some((tile) => pointIs({ x, y }, tile))) return { className: 'is-stage', symbol: '🎤' };
    }
    if (pointIs({ x, y }, waiterCounter)) return { className: 'is-counter', symbol: '🍽️' };
    const table = tables.find((item) => item.x === x && item.y === y);
    if (table) return { className: 'is-table', symbol: `T${table.number}` };
    if (x === 0 && y === 6) return { className: 'is-door', symbol: '🚪' };
    return { className: '', symbol: '' };
  }

  function appendSprite(tile, className, icon, label) { const sprite = document.createElement('span'); sprite.className = `sprite ${className}`; sprite.textContent = icon; sprite.setAttribute('aria-label', label); tile.append(sprite); }
  function renderMap() {
    if (!currentWorld || !session) return;
    elements.map.replaceChildren();
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      for (let x = 0; x < MAP_WIDTH; x += 1) {
        const tile = document.createElement('div'); const special = specialTile(x, y); tile.className = `tile ${special.className}`;
        if (special.symbol) { const symbol = document.createElement('span'); symbol.className = 'tile-symbol'; symbol.textContent = special.symbol; tile.append(symbol); }
        if (currentWorld.role === 'waiter' && session.delivery && pointIs({ x, y }, session.delivery.table)) appendSprite(tile, 'target-sprite', '🎯', `Mesa ${session.delivery.table.number}`);
        if (currentWorld.role === 'chef' && session.complaint && x === 8 && y === 6) appendSprite(tile, 'complaint-sprite', '😡', 'Cliente reclamando');
        if (currentWorld.role === 'pimentinha' && session.pimentinha && pointIs({ x, y }, session.pimentinha.guestPosition)) appendSprite(tile, session.pimentinha.type === 'show' ? 'show-sprite' : 'guest-sprite', session.pimentinha.child.icon, `Criança: ${session.pimentinha.child.name}`);
        if (pointIs({ x, y }, session.player)) {
          if (currentWorld.role === 'waiter' && session.delivery?.carrying) appendSprite(tile, 'plate-sprite', '🍽️', 'Prato carregado');
          if (currentWorld.role === 'chef' && session.laughing) appendSprite(tile, 'laugh-sprite', '😂', 'Cozinheiro rindo');
          appendSprite(tile, 'player-sprite', roleIcon(currentWorld.role), 'Seu personagem');
        }
        elements.map.append(tile);
      }
    }
  }

  function renderLegend() {
    const parts = currentWorld.role === 'chef'
      ? [['🍞', 'Bancadas'], ['🌶️', 'Pimentas do Rarinho'], ['🍽️', 'Balcão'], ['🔥', 'Fogão'], ['😡', 'Reclamação']]
      : currentWorld.role === 'waiter'
        ? [['🍽️', 'Balcão'], ['🎯', 'Mesa certa'], ['T', 'Mesas: não bata com prato']]
        : [['👋', 'Recepção'], ['🧒', 'Criança'], ['🎤', 'Palco do show'], ['⭐', 'Estrela de alegria']];
    elements.legend.replaceChildren();
    parts.forEach(([icon, text]) => { const item = document.createElement('span'); item.className = 'legend-item'; const symbol = document.createElement('span'); symbol.className = 'legend-square'; symbol.textContent = icon; item.append(symbol, document.createTextNode(text)); elements.legend.append(item); });
  }

  function readableIngredientList(items) { return items.map((item) => `${ingredients[item].icon} ${ingredients[item].name}`).join(', '); }
  function renderScore() {
    const pimentinha = currentWorld.role === 'pimentinha';
    elements.scoreBox.setAttribute('aria-label', pimentinha ? 'Estrelas de alegria' : 'Moedas');
    elements.scoreIcon.textContent = pimentinha ? '⭐' : '🪙';
    elements.scoreValue.textContent = pimentinha ? currentWorld.joyStars ?? 0 : currentWorld.coins;
  }

  function renderMission() {
    if (!currentWorld || !session) return;
    renderScore();
    if (currentWorld.role === 'chef') {
      const order = session.order;
      elements.missionOverline.textContent = session.complaint ? 'CLIENTE BRAVO' : (session.laughing ? 'PEGADINHA RARINHO' : 'PEDIDO ATUAL');
      elements.missionIcon.textContent = session.complaint ? '😡' : (session.laughing ? '😂' : (order?.recipe.icon || '⏳'));
      elements.timerWrap.classList.toggle('is-hidden', !order);
      if (!order) { elements.missionTitle.textContent = session.complaint ? 'Cliente reclamando!' : (session.laughing ? 'Hahaha! O Rarinho funcionou!' : 'Próximo pedido chegando...'); elements.missionText.textContent = session.complaint ? 'O cliente ficou irritado com o Rarinho. Ele vai embora logo.' : (session.laughing ? 'Você ganhou 3 moedas e não perdeu nenhuma. 😂' : 'Prepare a cozinha.'); return; }
      const percent = Math.max(0, (order.timeLeft / order.maxTime) * 100);
      elements.timerBar.style.width = `${percent}%`; elements.timerBar.classList.toggle('warning', percent <= 30);
      elements.missionTitle.textContent = `${order.recipe.icon} ${order.recipe.name} · ${order.recipe.value} moedas`;
      elements.missionText.textContent = `Os quadrados brilhando são os ingredientes que você precisa. Fique em cima de cada um e aperte AÇÃO. Pegue: ${readableIngredientList(order.recipe.items)}. Na mão: ${session.held.length ? readableIngredientList(session.held) : 'nada'}. Segredo: as 3 pimentas fazem o Rarinho!`; return;
    }
    elements.timerWrap.classList.add('is-hidden');
    if (currentWorld.role === 'waiter') {
      const delivery = session.delivery; elements.missionOverline.textContent = 'ENTREGA ATUAL';
      if (!delivery) { elements.missionIcon.textContent = '⏳'; elements.missionTitle.textContent = 'Próximo prato chegando...'; elements.missionText.textContent = 'Aguarde no salão.'; return; }
      elements.missionIcon.textContent = delivery.carrying ? '🍽️' : delivery.meal.icon; elements.missionTitle.textContent = `${delivery.meal.name} → Mesa ${delivery.table.number}`; elements.missionText.textContent = delivery.carrying ? 'Você está carregando o prato. Não bata em mesas, balcão ou parede!' : 'Vá ao balcão e aperte AÇÃO para pegar o prato.'; return;
    }
    const task = session.pimentinha;
    elements.missionOverline.textContent = task?.type === 'show' ? 'SHOW DE FIM DE SEMANA' : 'RECEPÇÃO DO RESTAURANTE';
    elements.missionIcon.textContent = task?.type === 'show' ? '🎤' : '👋';
    if (!task) { elements.missionTitle.textContent = 'Próxima criança chegando...'; elements.missionText.textContent = 'Pimentinha está preparado para fazer alguém feliz.'; return; }
    if (task.question) { elements.missionTitle.textContent = 'Entrevista do Pimentinha'; elements.missionText.textContent = `${task.child.name}: “${task.question.question}” Pimentinha: “${task.question.answer}”`; return; }
    elements.missionTitle.textContent = task.type === 'show' ? 'Show do Pimentinha!' : `${task.child.name} chegou ao restaurante`;
    elements.missionText.textContent = task.type === 'show' ? 'Vá perto do palco 🎤 e aperte AÇÃO. Depois escolha a pergunta da criança.' : 'Vá perto da criança na recepção e aperte AÇÃO para recebê-la.';
  }

  function renderGame() { if (!currentWorld || !session) return; renderMission(); renderMap(); renderLegend(); }
  function gameTick() {
    if (!currentWorld || !session || elements.game.classList.contains('is-hidden')) return;
    if (currentWorld.role === 'chef' && session.order && !session.changingMission) {
      session.order.timeLeft = Math.max(0, session.order.timeLeft - 1);
      if (session.order.timeLeft === 0) customerComplaint('A comida demorou demais!'); else renderMission();
    }
  }

  elements.openCreate.addEventListener('click', openCreate);
  elements.cancelCreate.addEventListener('click', () => { setScreen('home'); renderWorlds(); });
  elements.createWorld.addEventListener('click', createWorld);
  elements.logo.addEventListener('click', leaveWorld);
  elements.backToWorlds.addEventListener('click', leaveWorld);
  elements.worldName.addEventListener('input', () => elements.worldName.removeAttribute('aria-invalid'));
  elements.roleInputs.forEach((input) => input.addEventListener('change', chooseRoleVisual));
  elements.moveButtons.forEach((button) => button.addEventListener('click', () => move(button.dataset.move)));
  elements.actionButton.addEventListener('click', interact);
  elements.openHelp.addEventListener('click', () => elements.help.showModal());
  elements.closeHelp.addEventListener('click', () => elements.help.close());
  elements.closeHelpMain.addEventListener('click', () => elements.help.close());
  elements.closeShow.addEventListener('click', () => elements.showDialog.close());
  window.addEventListener('keydown', (event) => {
    if (!currentWorld || elements.help.open || elements.showDialog.open) return;
    const directions = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (directions[event.key]) { event.preventDefault(); move(directions[event.key]); }
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); interact(); }
  });
  gameTimer = window.setInterval(gameTick, 1000);
  window.addEventListener('beforeunload', () => window.clearInterval(gameTimer));
  renderWorlds();
})();
