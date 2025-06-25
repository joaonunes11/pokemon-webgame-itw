/*https://youtu.be/txUvD5_ROIU*/

var ctx = null; /*ctx=context; usa-se habitualmente*/
var gameMap = [
	1, 2, 3, 4, 5,
	6, 7, 8, 9, 10,
	11, 12, 13, 14, 15,
	16, 17, 18, 19, 20,
	21, 22, 23, 24, 25
];   /* mapa do jogo */

var tileW = 80, tileH = 80; /* tamanho dos quadrados em pixels*/
var mapW = 5, mapH = 5; /* tamanho do mapa em número de tiles */

var currentSecond = 0, frameCount = 0, framesLastSecond = 0; /* variáveis de controlo do número de frames */
var lastFrameTime = 0; /* variável que guarda o tempo do último frame em ms*/

var tileEvents = {
	20: finito
};

function finito() {
	setState("ACABOU");
};

var tileset = null, tilesetURL = "imagens/tilesetf.png", tilesetLoaded = false; /*imagem tabuleiro*/
var tileset2 = null, tilesetURL2 = "imagens/ash.png", tilesetLoaded2 = false; /*icone jogador*/

var gameState;
var gameOverMenu;
var restartButton;

var floorTypes = {
	solid: 4,
	solid: 5,
	solid: 14,
	solid: 16,
	solid: 17,
	solid: 18,
	solid: 25,
	path: 2,
	path: 3,
	path: 8,
	path: 9,
	path: 10,
	path: 15,
	path: 20,
	path: 19,
	path: 21,
	path: 22,
	path: 23,
	path: 24,
	water: 1,
	water: 6,
	water: 7,
	water: 11,
	water: 12,
	water: 13,
};/*definicao do tabuleiro*/

var tileTypes = {
	1: { colour: "#685b48", floor: floorTypes.water, sprite: [{ x: 0, y: 0, w: 48, h: 48 }] },
	2: { colour: "#685b48", floor: floorTypes.path, sprite: [{ x: 48, y: 0, w: 48, h: 48 }] },
	3: { colour: "#685b48", floor: floorTypes.path, sprite: [{ x: 96, y: 0, w: 48, h: 48 }] },
	4: { colour: "#685b48", floor: floorTypes.solid, sprite: [{ x: 144, y: 0, w: 48, h: 48 }] },
	5: { colour: "#685b48", floor: floorTypes.solid, sprite: [{ x: 192, y: 0, w: 48, h: 48 }] },
	6: { colour: "#685b48", floor: floorTypes.water, sprite: [{ x: 0, y: 48, w: 48, h: 48 }] },
	7: { colour: "#685b48", floor: floorTypes.water, sprite: [{ x: 48, y: 48, w: 48, h: 48 }] },
	8: { colour: "#685b48", floor: floorTypes.path, sprite: [{ x: 96, y: 48, w: 48, h: 48 }] },
	9: { colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 144, y: 48, w: 48, h: 48 }] },
	10: { colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 192, y: 48, w: 48, h: 48 }] },
	11: { colour: "#5aa457", floor: floorTypes.water, sprite: [{ x: 0, y: 96, w: 48, h: 48 }] },
	12: { colour: "#5aa457", floor: floorTypes.water, sprite: [{ x: 48, y: 96, w: 48, h: 48 }] },
	13: { colour: "#5aa457", floor: floorTypes.water, sprite: [{ x: 96, y: 96, w: 48, h: 48 }] },
	14: { colour: "#5aa457", floor: floorTypes.solid, sprite: [{ x: 144, y: 96, w: 48, h: 48 }] },
	15: { colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 192, y: 96, w: 48, h: 48 }] },
	16: { colour: "#5aa457", floor: floorTypes.solid, sprite: [{ x: 0, y: 144, w: 48, h: 48 }] },
	17: { colour: "#5aa457", floor: floorTypes.solid, sprite: [{ x: 48, y: 144, w: 48, h: 48 }] },
	18: { colour: "#5aa457", floor: floorTypes.solid, sprite: [{ x: 96, y: 144, w: 48, h: 48 }] },
	19: { colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 144, y: 144, w: 48, h: 48 }] },
	20: { colour: "#5aa457", floor: floorTypes.path, sprite: [{ x: 192, y: 144, w: 48, h: 48 }] },
	21: { colour: "#e8bd7a", floor: floorTypes.path, sprite: [{ x: 0, y: 192, w: 48, h: 48 }] },
	22: { colour: "#e8bd7a", floor: floorTypes.path, sprite: [{ x: 48, y: 192, w: 48, h: 48 }] },
	23: { colour: "#e8bd7a", floor: floorTypes.path, sprite: [{ x: 96, y: 192, w: 48, h: 48 }] },
	24: { colour: "#e8bd7a", floor: floorTypes.path, sprite: [{ x: 144, y: 192, w: 48, h: 48 }] },
	25: { colour: "#e8bd7a", floor: floorTypes.solid, sprite: [{ x: 192, y: 192, w: 48, h: 48 }] }
};/*definicao das quadriculas*/

var directions = {
	up: 0,
	right: 1,
	down: 2,
	left: 3
};

var keysDown = { /* variáveis das setas para mexer o boneco */
	37: false,
	38: false,
	39: false,
	40: false
};

var player = new Character();

/*--------------------------------------------------------------------------------------------------
Movimentação do Boneco
---------------------------------------------------------------------------------------------------*/

/*https://gamedev.stackexchange.com/questions/153954/character-movement-canvas-character-javascript*/

function Character() {
	this.tileFrom = [1, 0]; /* registo da posição do boneco*/
	this.tileTo = [1, 0]; /* próxima posição */
	this.timeMoved = 0;
	this.dimensions = [50, 50]; /* dimensões do boneco */
	this.position = [90, 15]; /* posição do boneco em relação ao topo superior esquerdo */
	this.delayMove = 700; /* tempo que demora o movimento */

	this.direction = directions.up;
	this.sprites = {};
	this.sprites[directions.up] = [{ x: 5, y: 223, w: 56, h: 56 }];
	this.sprites[directions.down] = [{ x: 4, y: 6, w: 56, h: 56 }];
	this.sprites[directions.right] = [{ x: 7, y: 151, w: 56, h: 56 }];
	this.sprites[directions.left] = [{ x: 4, y: 78, w: 56, h: 56 }];

}

/*method para colocar o icone na tile seguinte*/
Character.prototype.placeAt = function (x, y) {
	this.tileFrom = [x, y];
	this.tileTo = [x, y];
	this.position = [((tileW * x) + ((tileW - this.dimensions[0]) / 2)),
	((tileH * y) + ((tileH - this.dimensions[1]) / 2))];
};

Character.prototype.processMovement = function (t) {
	if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) { return false; } /*jogador está na posicao destino*/

	if ((t - this.timeMoved) >= this.delayMove) {
		this.placeAt(this.tileTo[0], this.tileTo[1]);
		if (typeof tileEvents[toIndex(this.tileTo[0], this.tileTo[1])] != 'undefined') {
			tileEvents[toIndex(this.tileTo[0], this.tileTo[1])](this);
		}
	}
	else {
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

		if (this.tileTo[0] != this.tileFrom[0]) {
			var diff = (tileW / this.delayMove) * (t - this.timeMoved);
			this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
		}
		if (this.tileTo[1] != this.tileFrom[1]) {
			var diff = (tileH / this.delayMove) * (t - this.timeMoved);
			this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
		}

		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
	}

	return true;
}

Character.prototype.canMoveTo = function (x, y) {
	if (x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
	if (tileTypes[gameMap[toIndex(x, y)]].floor != floorTypes.path) { return false; }
	return true;
};
Character.prototype.canMoveUp = function () { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1); };
Character.prototype.canMoveDown = function () { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1); };
Character.prototype.canMoveLeft = function () { return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]); };
Character.prototype.canMoveRight = function () { return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]); };

Character.prototype.moveLeft = function (t) { this.tileTo[0] -= 1; this.timeMoved = t; this.direction = directions.left; };
Character.prototype.moveRight = function (t) { this.tileTo[0] += 1; this.timeMoved = t; this.direction = directions.right; };
Character.prototype.moveUp = function (t) { this.tileTo[1] -= 1; this.timeMoved = t; this.direction = directions.up; };
Character.prototype.moveDown = function (t) { this.tileTo[1] += 1; this.timeMoved = t; this.direction = directions.down; };

function toIndex(x, y) {
	return ((y * mapW) + x);
}

function initialize() {
	window.onload = function () {
		ctx = document.getElementById('game').getContext("2d");
		requestAnimationFrame(drawGame);
		ctx.font = "bold 10pt sans-serif";
		
		/*evento que acontece sempre que um botao foi seleccionado. Entre 37 e 40 = seta*/
		window.addEventListener("keydown", function (e) {
			if (e.keyCode >= 37 && e.keyCode <= 40) { keysDown[e.keyCode] = true; }
		});
		window.addEventListener("keyup", function (e) {
			if (e.keyCode >= 37 && e.keyCode <= 40) { keysDown[e.keyCode] = false; }
		});

		tileset = new Image();

		tileset.onerror = function () {
			ctx = null;
			alert("Failed loading tileset");
		};

		tileset.onload = function () { tilesetLoaded = true; };

		tileset.src = tilesetURL;

		tileset2 = new Image();

		tileset2.onerror = function () {
			ctx = null;
			alert("Failed loading tileset");
		};

		tileset2.onload = function () { tilesetLoaded2 = true; };

		tileset2.src = tilesetURL2;

		gameOverMenu = document.getElementById("GameOver");
		centerMenuPosition(gameOverMenu);
		restartButton = document.getElementById("restart");
		restartButton.addEventListener("click", gameRestart);
		let audio = document.createElement("audio");
    	audio.src = "background.mp3";
    	audio.play();
	};
	setState("PLAY");
};
initialize();

function drawGame() {
	if (gameState == "PLAY") {

		if (ctx == null) { return; }
		if (!tilesetLoaded) { requestAnimationFrame(drawGame); return; }
		if (!tilesetLoaded2) { requestAnimationFrame(drawGame); return; }

		var currentFrameTime = Date.now();
		var timeElapsed = currentFrameTime - lastFrameTime;

		var sec = Math.floor(Date.now() / 1000);
		if (sec != currentSecond) {
			currentSecond = sec;
			framesLastSecond = frameCount;
			frameCount = 1;
		}
		else { frameCount++; }

		for (var y = 0; y < mapH; y++) /* começar a desenhar o mapa */ {
			for (var x = 0; x < mapW; x++) {
				var tile = tileTypes[gameMap[toIndex(x, y)]];
				ctx.drawImage(tileset, tile.sprite[0].x, tile.sprite[0].y, tile.sprite[0].w, tile.sprite[0].h, x * tileW, y * tileH, tileW, tileH);

			}
		}
		
		/*algum movimento a ser processado?que movimentos possíveis?*/
		if (!player.processMovement(currentFrameTime)) {
			if (keysDown[38] && player.canMoveUp()) { player.moveUp(currentFrameTime); }
			else if (keysDown[40] && player.canMoveDown()) { player.moveDown(currentFrameTime); }
			else if (keysDown[37] && player.canMoveLeft()) { player.moveLeft(currentFrameTime); }
			else if (keysDown[39] && player.canMoveRight()) { player.moveRight(currentFrameTime); }
		}
		var sprite = player.sprites[player.direction];
		ctx.drawImage(tileset2, sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h, player.position[0], player.position[1],
			player.dimensions[0], player.dimensions[1]);
			
		lastFrameTime = currentFrameTime;
		requestAnimationFrame(drawGame);
	};
};

function gameRestart() {
	requestAnimationFrame(drawGame);
	player.placeAt(1, 0);
	hideMenu(gameOverMenu);
	setState("PLAY");
};

function setState(state) {
	gameState = state;
	showMenu(state);
}

function displayMenu(menu) {
	menu.style.visibility = "visible";
}

function hideMenu(menu) {
	menu.style.visibility = "hidden";
}

function showMenu(state) {
	if (state == "ACABOU") {
		displayMenu(gameOverMenu);
	}
}

function centerMenuPosition(menu) {
	menu.style.top = 150 + "px";
	menu.style.left = 25 + "px";
}