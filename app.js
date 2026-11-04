// @ts-nocheck
(() => {
  'use strict';

  const STORAGE_KEY = 'bom-chefe-worlds-v1';
  const MAP_WIDTH = 10;
  const MAP_HEIGHT = 7;
  const COMPLAINT_COST = 8;
  const DROP_COST = 8;

  const ingredients = {
    bread: { name: 'pão', icon: '🍞' },
    meat: { name: 'hambúrguer', icon: '🥩' },
    cheese: { name: 'queijo', icon: '🧀' },
    lettuce: { name: 'salada', icon: '🥬' },
    fries: { name: 'batata', icon: '🍟' },
    drink: { name: 'bebida', icon: '🥤' },
    mexicanPepper: { name: 'pimenta mexicana', icon: '🇲🇽🌶️' },
    indianPepper: { name: 'pimenta indiana', icon: '🇮🇳🌶️' },
    chinesePepper: { name: 'pimenta chinesa', icon: '🇨🇳🌶️' },
  };

  const recipes = [
    { name: 'X-Bom', items: ['bread', 'meat', 'cheese'], value: 20, icon: '🍔' },
    { name: 'X-Salada', items: ['bread', 'meat', 'lettuce'], value: 22, icon: '🥗' },
    { name: 'Combo da Casa', items: ['bread', 'meat', 'fries', 'drink'], value: 28, icon: '🍟' },
    { name: 'Batata e Bebida', items: ['fries', 'drink'], value: 14, icon: '🥤' },
  ];

  const rarinho = { name: 'Rarinho', items: ['mexicanPepper', 'indianPepper', 'chinesePepper'], value: 3, icon: '🌶️' };
  const kitchenStations = [
    { x: 1, y: 1, ingredient: 'bread' }, { x: 3, y: 1, ingredient: 'meat' }, { x: 5, y: 1, ingredient: 'cheese' },
    { x: 7, y: 1, ingredient: 'lettuce' }, { x: 1, y: 3, ingredient: 'fries' }, { x: 3, y: 3, ingredient: 'drink' },
    { x: 7, y: 3, ingredient: 'mexicanPepper' }, { x: 1, y: 5, ingredient: 'indianPepper' }, { x: 3, y: 5, ingredient: 'chinesePepper' },
  ];
  const kitchenCounter = { x: 8, y: 5 };
  const kitchenStoves = [{ x: 5, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 4 }, { x: 6, y: 4 }];
  const waiterCounter = { x: 1, y: 3 };
  const tables = [{ x: 5, y: 1, number: 1 }, { x: 8, y: 1, number: 2 }, { x: 5, y: 5, number: 3 }, { x: 8, y: 5, number: 4 }];

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    home: $('#home-screen'), create: $('#create-screen'), game: $('#game-screen'), logo: $('#logo-button'),
    openCreate: $('#open-create-world'), cancelCreate: $('#cancel-create-world'), createWorld: $('#create-world-button'), worldName: $('#world-name'), worldList: $('#world-list'), backToWorlds: $('#back-to-worlds'),
    roleInputs: document.querySelectorAll('input[name="role"]'), roleBadge: $('#role-badge'), gameTitle: $('#game-title'), coins: $('#coins-value'),
    missionIcon: $('#mission-icon'), missionOverline: $('#mission-overline'), missionTitle: $('#mission-title'), missionText: $('#mission-text'), timerWrap: $('#timer-wrap'), timerBar: $('#timer-bar'),
    map: $('#game-map'), legend: $('#map-legend'), gameMessage: $('#game-message'), moveButtons: document.querySelectorAll('[data-move]'), actionButton: $('#action-button'),
    help: $('#help-dialog'), openHelp: $('#help-button'), closeHelp: $('#close-help-button'), closeHelpMain: $('#close-help-main'),
  };

  function loadWorlds() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved.filter((world) => world && world.id && ['chef', 'waiter'].includes(world.role)) : [];
    } catch { return []; }
  }

  let worlds = loadWorlds();
  let currentWorld = null;
  let session = null;
  let gameTimer = null;
  let nextMissionTimeout = null;

  function makeId() { return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function saveWorlds() { localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds)); }
  function roleName(role) { return role === 'chef' ? 'Cozinheiro' : 'Garçom'; }
  function roleIcon(role) { return role === 'chef' ? '👨‍🍳' : '🧑‍💼'; }
  function getRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
  function setScreen(screen) { elements.home.classList.toggle('is-hidden', screen !== 'home'); elements.create.classList.toggle('is-hidden', screen !== 'create'); elements.game.classList.toggle('is-hidden', screen !== 'game'); }
  function setMessage(message, kind = '') { elements.gameMessage.textContent = message; elements.gameMessage.className = `game-message ${kind}`; }

  function renderWorlds() {
    elements.worldList.replaceChildren();
    if (!worlds.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-worlds';
      empty.textContent = 'Você ainda não criou nenhum mundo. Crie o primeiro e escolha sua carreira!';
      elements.worldList.append(empty);
      return;
    }
    worlds.forEach((world) => {
      const card = document.createElement('article'); card.className = 'world-card';
      const icon = document.createElement('span'); icon.className = 'world-role-icon'; icon.textContent = roleIcon(world.role);
      const info = document.createElement('div'); info.className = 'world-info';
      const name = document.createElement('strong'); name.textContent = world.name;
      const details = document.createElement('span'); details.textContent = `${roleName(world.role)} · 🪙 ${world.coins} · ${world.served} entregas`;
      info.append(name, details);
      const play = document.createElement('button'); play.className = 'world-play'; play.type = 'button'; play.textContent = 'Jogar ▶'; play.addEventListener('click', () => openWorld(world.id));
      card.append(icon, info, play); elements.worldList.append(card);
    });
  }

  function chooseRoleVisual() {
    document.querySelectorAll('.role-choice').forEach((choice) => choice.classList.toggle('selected', choice.querySelector('input').checked));
  }

  function openCreate() {
    elements.worldName.value = '';
    document.querySelector('input[name="role"][value="chef"]').checked = true;
    chooseRoleVisual(); setScreen('create'); window.setTimeout(() => elements.worldName.focus(), 0);
  }

  function createWorld() {
    const name = elements.worldName.value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    if (!name) { elements.worldName.focus(); elements.worldName.setAttribute('aria-invalid', 'true'); return; }
    elements.worldName.removeAttribute('aria-invalid');
    const world = { id: makeId(), name, role, coins: 25, served: 0, mistakes: 0, tricks: 0 };
    worlds.unshift(world); saveWorlds(); openWorld(world.id);
  }

  function openWorld(id) {
    currentWorld = worlds.find((world) => world.id === id) || null;
    if (!currentWorld) return;
    session = { player: { x: 1, y: 5 }, order: null, delivery: null, held: [], complaint: false, laughing: false, changingMission: false };
    setScreen('game');
    elements.roleBadge.textContent = `${roleIcon(currentWorld.role)} ${roleName(currentWorld.role).toUpperCase()}`;
    elements.gameTitle.textContent = currentWorld.name;
    setMessage(currentWorld.role === 'chef' ? 'Vá até as bancadas, pegue ingredientes e sirva no balcão.' : 'Vá até o balcão para pegar o prato pronto.');
    if (currentWorld.role === 'chef') startKitchenOrder(); else startDelivery();
    renderGame(); window.setTimeout(() => elements.map.focus(), 0);
  }

  function leaveWorld() { clearTimeout(nextMissionTimeout); currentWorld = null; session = null; setScreen('home'); renderWorlds(); }
  function persistWorld() { if (currentWorld) saveWorlds(); }
  function isNear(first, second) { return Math.abs(first.x - second.x) + Math.abs(first.y - second.y) <= 1; }
  function pointIs(point, other) { return point.x === other.x && point.y === other.y; }
  function findKitchenStation(position) { return kitchenStations.find((station) => isNear(position, station)); }

  function getBlockedTile(x, y) {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return 'wall';
    if (currentWorld.role === 'chef') {
      if (pointIs({ x, y }, kitchenCounter)) return 'counter';
      if (kitchenStoves.some((stove) => pointIs({ x, y }, stove))) return 'stove';
      return null;
    }
    if (pointIs({ x, y }, waiterCounter)) return 'counter';
    if (tables.some((table) => pointIs({ x, y }, table))) return 'table';
    return null;
  }

  function move(direction) {
    if (!currentWorld || !session || session.changingMission) return;
    const movement = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[direction];
    if (!movement) return;
    const next = { x: session.player.x + movement.x, y: session.player.y + movement.y };
    const blocked = getBlockedTile(next.x, next.y);
    if (blocked) {
      if (currentWorld.role === 'waiter' && session.delivery?.carrying) dropPlate();
      else if (blocked === 'wall') setMessage('Tem uma parede aí. Procure outro caminho.');
      return;
    }
    session.player = next; renderMap();
  }

  function startKitchenOrder() {
    if (!session || !currentWorld || currentWorld.role !== 'chef') return;
    session.changingMission = false; session.order = { recipe: getRandom(recipes), timeLeft: 60, maxTime: 60 }; session.held = []; renderGame();
  }

  function sameIngredients(first, second) {
    if (first.length !== second.length) return false;
    const expected = [...second].sort();
    return [...first].sort().every((item, index) => item === expected[index]);
  }

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
        const coins = session.order.recipe.value;
        currentWorld.coins += coins; currentWorld.served += 1; persistWorld(); session.held = []; session.order = null; session.changingMission = true;
        setMessage(`Pedido entregue! Você ganhou ${coins} moedas.`, 'success'); renderGame(); nextMissionTimeout = window.setTimeout(startKitchenOrder, 1600);
      } else if (sameIngredients(session.held, rarinho.items)) serveRarinho();
      else customerComplaint('O prato estava errado!');
      return;
    }
    setMessage('Aproxime-se de uma bancada de ingrediente ou do balcão.');
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

  function startDelivery() {
    if (!session || !currentWorld || currentWorld.role !== 'waiter') return;
    session.changingMission = false; session.delivery = { table: getRandom(tables), meal: getRandom(recipes), carrying: false }; renderGame();
  }

  function waiterInteract() {
    if (!session.delivery || session.changingMission) return;
    const delivery = session.delivery;
    if (!delivery.carrying && isNear(session.player, waiterCounter)) {
      delivery.carrying = true; setMessage(`Prato na mão! Leve o ${delivery.meal.name} à Mesa ${delivery.table.number}.`); renderGame(); return;
    }
    if (delivery.carrying && isNear(session.player, delivery.table)) {
      currentWorld.coins += delivery.meal.value; currentWorld.served += 1; persistWorld(); session.delivery = null; session.changingMission = true;
      setMessage(`Entrega concluída! Você ganhou ${delivery.meal.value} moedas.`, 'success'); renderGame(); nextMissionTimeout = window.setTimeout(startDelivery, 1500); return;
    }
    if (!delivery.carrying) setMessage('Vá ao balcão e aperte AÇÃO para pegar o prato.'); else setMessage(`Você está com o prato. Procure a Mesa ${delivery.table.number}.`);
  }

  function dropPlate() {
    if (!session?.delivery?.carrying || session.changingMission) return;
    currentWorld.coins = Math.max(0, currentWorld.coins - DROP_COST); currentWorld.mistakes += 1; persistWorld(); session.delivery = null; session.changingMission = true;
    setMessage(`💥 O prato caiu no chão! Você perdeu ${DROP_COST} moedas.`, 'error'); renderGame(); nextMissionTimeout = window.setTimeout(startDelivery, 2000);
  }

  function interact() { if (!currentWorld || !session) return; if (currentWorld.role === 'chef') kitchenInteract(); else waiterInteract(); }

  function specialTile(x, y) {
    if (currentWorld.role === 'chef') {
      const station = kitchenStations.find((item) => item.x === x && item.y === y);
      if (station) return { className: 'is-station', symbol: ingredients[station.ingredient].icon };
      if (pointIs({ x, y }, kitchenCounter)) return { className: 'is-counter', symbol: '🍽️' };
      if (kitchenStoves.some((stove) => pointIs({ x, y }, stove))) return { className: 'is-wall', symbol: '🔥' };
      if (x === 8 && y === 6) return { className: 'is-door', symbol: '🚪' };
      return { className: '', symbol: '' };
    }
    if (pointIs({ x, y }, waiterCounter)) return { className: 'is-counter', symbol: '🍽️' };
    const table = tables.find((item) => item.x === x && item.y === y);
    if (table) return { className: 'is-table', symbol: `T${table.number}` };
    if (x === 0 && y === 6) return { className: 'is-door', symbol: '🚪' };
    return { className: '', symbol: '' };
  }

  function appendSprite(tile, className, icon, label) {
    const sprite = document.createElement('span'); sprite.className = `sprite ${className}`; sprite.textContent = icon; sprite.setAttribute('aria-label', label); tile.append(sprite);
  }

  function renderMap() {
    if (!currentWorld || !session) return;
    elements.map.replaceChildren();
    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      for (let x = 0; x < MAP_WIDTH; x += 1) {
        const tile = document.createElement('div'); const special = specialTile(x, y); tile.className = `tile ${special.className}`;
        if (special.symbol) { const symbol = document.createElement('span'); symbol.className = 'tile-symbol'; symbol.textContent = special.symbol; tile.append(symbol); }
        if (currentWorld.role === 'waiter' && session.delivery && pointIs({ x, y }, session.delivery.table)) appendSprite(tile, 'target-sprite', '🎯', `Mesa ${session.delivery.table.number}`);
        if (currentWorld.role === 'chef' && session.complaint && x === 8 && y === 6) appendSprite(tile, 'complaint-sprite', '😡', 'Cliente reclamando');
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
      : [['🍽️', 'Balcão'], ['🎯', 'Mesa certa'], ['T', 'Mesas: não bata com prato']];
    elements.legend.replaceChildren();
    parts.forEach(([icon, text]) => { const item = document.createElement('span'); item.className = 'legend-item'; item.innerHTML = `<span class="legend-square">${icon}</span>${text}`; elements.legend.append(item); });
  }

  function readableIngredientList(items) { return items.map((item) => `${ingredients[item].icon} ${ingredients[item].name}`).join(', '); }

  function renderMission() {
    if (!currentWorld || !session) return;
    elements.coins.textContent = currentWorld.coins;
    if (currentWorld.role === 'chef') {
      const order = session.order;
      elements.missionOverline.textContent = session.complaint ? 'CLIENTE BRAVO' : (session.laughing ? 'PEGADINHA RARINHO' : 'PEDIDO ATUAL');
      elements.missionIcon.textContent = session.complaint ? '😡' : (session.laughing ? '😂' : (order?.recipe.icon || '⏳'));
      elements.timerWrap.classList.toggle('is-hidden', !order);
      if (!order) {
        elements.missionTitle.textContent = session.complaint ? 'Cliente reclamando!' : (session.laughing ? 'Hahaha! O Rarinho funcionou!' : 'Próximo pedido chegando...');
        elements.missionText.textContent = session.complaint ? 'O cliente ficou irritado com o Rarinho. Ele vai embora logo.' : (session.laughing ? 'Você ganhou 3 moedas e não perdeu nenhuma. 😂' : 'Prepare a cozinha.');
        return;
      }
      const percent = Math.max(0, (order.timeLeft / order.maxTime) * 100);
      elements.timerBar.style.width = `${percent}%`; elements.timerBar.classList.toggle('warning', percent <= 30);
      elements.missionTitle.textContent = `${order.recipe.icon} ${order.recipe.name} · ${order.recipe.value} moedas`;
      elements.missionText.textContent = `Pegue: ${readableIngredientList(order.recipe.items)}. Na mão: ${session.held.length ? readableIngredientList(session.held) : 'nada'}. Segredo: as 3 pimentas fazem o Rarinho!`;
      return;
    }
    const delivery = session.delivery;
    elements.missionOverline.textContent = 'ENTREGA ATUAL'; elements.timerWrap.classList.add('is-hidden');
    if (!delivery) { elements.missionIcon.textContent = '⏳'; elements.missionTitle.textContent = 'Próximo prato chegando...'; elements.missionText.textContent = 'Aguarde no salão.'; return; }
    elements.missionIcon.textContent = delivery.carrying ? '🍽️' : delivery.meal.icon;
    elements.missionTitle.textContent = `${delivery.meal.name} → Mesa ${delivery.table.number}`;
    elements.missionText.textContent = delivery.carrying ? 'Você está carregando o prato. Não bata em mesas, balcão ou parede!' : 'Vá ao balcão e aperte AÇÃO para pegar o prato.';
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
  window.addEventListener('keydown', (event) => {
    if (!currentWorld || elements.help.open) return;
    const directions = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (directions[event.key]) { event.preventDefault(); move(directions[event.key]); }
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); interact(); }
  });
  gameTimer = window.setInterval(gameTick, 1000);
  window.addEventListener('beforeunload', () => window.clearInterval(gameTimer));
  renderWorlds();
})();
