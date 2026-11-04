# Estado do projeto: Bom Chefe

Jogo de restaurante em pixel art, feito em HTML, CSS e JavaScript puro, sem servidor.

## Decisões definidas por Samuel

- O visual deve ser pixel art.
- A tela inicial permite criar vários mundos salvos.
- Ao criar um mundo, o jogador escolhe uma carreira: **Cozinheiro** ou **Garçom**.
- Mundos de carreiras diferentes podem coexistir e têm progresso separado.

## Versão atual

### Cozinheiro

- O jogador anda pelo mapa da cozinha.
- Coleta ingredientes nas bancadas.
- Leva os ingredientes ao balcão e usa AÇÃO para servir.
- Se o prato estiver errado ou o tempo acabar, o cliente vai reclamar na cozinha e o jogador perde 8 moedas.
- Existe o **Rarinho**, uma pegadinha feita com pimenta mexicana, pimenta indiana e pimenta chinesa. Ele rende 3 moedas, faz o cliente reclamar e depois o cozinheiro ri muito, sem perder moedas.

### Garçom

- O jogador anda pelo salão.
- Pega o prato no balcão usando AÇÃO.
- Deve entregá-lo na mesa indicada.
- Se bater em mesa, balcão ou parede carregando o prato, ele cai no chão e o jogador perde 8 moedas.

## Controles

- Computador: setas para andar, Espaço ou Enter para agir.
- Celular: botões direcionais e botão AÇÃO na tela.

## Arquivos principais

- `index.html`: telas e interface do jogo.
- `styles.css`: aparência pixel art responsiva.
- `app.js`: regras, mapas, movimentação e salvamento no navegador.
- `README.md`: instruções para abrir e jogar.

O progresso dos mundos é salvo no `localStorage` do navegador em que o jogo for aberto.

## Próxima fase planejada: Mundo Mágico

- Um terremoto transforma o restaurante em um mundo mágico, com cristais, chão brilhante e céu roxo.
- Surge **Pimentinha**, um dragão de fogo amigável que só entrou na cozinha porque está com fome.
- Para ajudá-lo, o cozinheiro prepara a **Sopa Chama Mágica**.
- Ingredientes da Sopa Chama Mágica: pimenta mágica, chama encantada e pó de estrela.
- Ao comer a sopa, Pimentinha fica feliz, solta fumaça colorida, o terremoto para e ele vira amigo do restaurante.
