/*

	Made by Artenes Nogueira
	artenes.github.io
	Based on the implementation made by Jamie Nichols
	available at: https://www.youtube.com/watch?v=xRUBaiJvhyo

*/

/*-------------------------------------------------------------------
*
*	A part of the snake.
*	Will only have a x and y coordinates.
*
*------------------------------------------------------------------*/
class SnakePart {

	constructor(x, y) {

		this.x = x;
		this.y = y;

	}

}

/*-------------------------------------------------------------------
*
*	The snake itself.
*
*------------------------------------------------------------------*/
class Snake {

	constructor(game, x, y, initialPartsAmount) {

		this.game = game;
		this.x = x;
		this.y = y;
		this.isAlive = true;

		//Determines if the snake is going up/down or left/right.
		this.xSpeed = 1;
		this.ySpeed = 0;

		//Create the snake's parts.
		this.parts = [];
		for (var index = 0; index < initialPartsAmount; index++)
			this.parts.push(new SnakePart(x-index, y));

		//This controls when the snake can change directions.
		this.canChangeDirection = true;

		//Captures the key pressed by the player.
		var _this = this;
		document.onkeydown = function (event) {

			_this.controller(event.which);

		};

	}

	/*
		Controll the snake in the canvas.
		If xSpeed is not equal to 0, tha means the snake
		is going left or right. If ySpeed is not equal to
		0, that means the snake is going up or down.
	*/
	controller(key) {

		//Enter.
		if (key == 13) {

			this.game.isPaused = ! this.game.isPaused;

		}

		//If it is paused, it will not receive any other input.
		if (this.game.isPaused)
			return;

		//Left.
		if (key == 37 && this.ySpeed != 0 && this.canChangeDirection) {

			this.canChangeDirection = false;
			this.xSpeed = -1;
			this.ySpeed = 0;

		}

		//Right.
		if (key == 39 && this.ySpeed != 0 && this.canChangeDirection) {

			this.canChangeDirection = false;
			this.xSpeed = 1;
			this.ySpeed = 0;

		}

		//Up.
		if (key == 38 && this.xSpeed != 0 && this.canChangeDirection) {

			this.canChangeDirection = false;
			this.xSpeed = 0;
			this.ySpeed = -1;

		}

		//Down.
		if (key == 40 && this.xSpeed != 0 && this.canChangeDirection) {

			this.canChangeDirection = false;
			this.xSpeed = 0;
			this.ySpeed = 1;

		}

	}

	//Add a new part to the end of the snake.
	addPart() {

		var lastPart = this.parts[this.parts.length - 1];
		this.parts.push(new SnakePart(lastPart.x, lastPart.y));

	}

	//Update the snake in the canvas.
	update() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;

		/**
		Snake would not death when collapsed bounds of canvas.
		Coordinates are reversed when snake will collapse the bound.
		Example; if this.x = -1 (snake is collapsed to left bound of canvas)
		this.x will be 19(this.game.width - 1) to keep continue game at right bound of canvas
		*/
		if (this.x > this.game.width - 1)
			this.x = 0;
		if (this.x < 0) {
			this.x = this.game.width -1
		}
		if (this.y > this.game.height - 1)
			this.y = 0;
		if (this.y < 0) {
			this.y = this.game.height - 1;
		}

		//Renders each part in the canvas starting by the last part.
		console.log(this.parts.length)
		for (var index = this.parts.length - 1; index >= 0; index--) {

			var part = this.parts[index];

			if (index != 0)
			{

				part.x = this.parts[index - 1].x;
				part.y = this.parts[index - 1].y;

				//If the heads touches any part of the body it will die.
				if (this.x == part.x && this.y == part.y) {
					this.die();
				}

			}
			else {

				part.x = this.x;
				part.y = this.y;

			}

			this.game.grid.fillTile(part.x, part.y, "#111410");

		}

		//After each update we must allow the snake to change direction again.
		this.canChangeDirection = true;

	}

	//The snake is dead. That's not a big surprise.
	die() {

		this.isAlive = false;

	}

}

/*-------------------------------------------------------------------
*
*	The food that the snake will eat.
*
*------------------------------------------------------------------*/
class Food {

	constructor(game) {

		this.game = game;
		this.placeFood();

	}

	//Places a food in a random tile in the grid.
	placeFood() {

		this.x = Math.floor(Math.random() * this.game.width);
		this.y = Math.floor(Math.random() * this.game.height);

	}

	//Render the food in the grid.
	update() {

		this.game.grid.fillTile(this.x, this.y, "#111410");

	}

}

/*-------------------------------------------------------------------
*
*	The game's grid. Can be of any size you want.
*
*------------------------------------------------------------------*/
class RenderGrid {

	constructor(game) {

		this.game = game;
		this.grid = [];

		this.buildGrid();

	}

	buildGrid() {

		//Loop through all the rows of the grid.
		for (var x = 0; x < this.game.width; x++) {

			this.grid[x] = [];

			//Loop through all the columns of the grid.
			for (var y = 0; y < this.game.height; y++) {

				//Create a tile to add to the grid.
				var divTile = document.createElement("div");
				divTile.style.position = "absolute";
				divTile.style.width = divTile.style.height = this.game.size + "px";
				divTile.style.left = x * this.game.size + "px";
				divTile.style.top = y * this.game.size + "px";

				//Add the tile to the front end grid.
				this.game.divStage.appendChild(divTile);

				/*
				Add the tile to the grid array.
				The isFilled property determines
				if the tile must be filled with a color or not.
				*/
				this.grid[x][y] = {
					div: divTile,
					isFilled: false,
					color: "white"
				};

			}

		}

	}

	//Mark a tile as filled with some color.
	fillTile(x, y, color) {

		if (this.grid[x]) {

			if (this.grid[x][y]) {

				var tile = this.grid[x][y];

				tile.isFilled = true;
				tile.color = color;

			}

		}

	}

	update() {

		//Loop through all the rows of the grid.
		for (var x = 0; x < this.game.width; x++) {

			//Loop through all the columns of the grid.
			for (var y = 0; y < this.game.height; y++) {

				var tile = this.grid[x][y];
				var newBackgroundColor = tile.isFilled ? tile.color : "#9AC805";
				tile.div.style.background = newBackgroundColor;

				/*
				Need to be reseted, so in the
				next update it will
				be able to change colors if necessary.
				*/
				tile.isFilled = false;

			}

		}

	}

}

/*-------------------------------------------------------------------
*
*	The game.
*
*------------------------------------------------------------------*/
class Game {

	constructor(size, fps, divStageId, spanScoreId, spanDeathsId, spanMaxScoreId) {

		this.width = size;
		this.height = size;
		this.size = size;
		this.fps = fps;
		this.isPaused = true;

		this.divStage = document.getElementById(divStageId);
		this.spanScore = document.getElementById(spanScoreId);
		this.spanDeaths = document.getElementById(spanDeathsId);
		this.spanMaxScore = document.getElementById(spanMaxScoreId);

		this.score = 0;
		this.deaths = 0;
		this.maxScore = this.score;
		this.grid = new RenderGrid(this);
		this.food = new Food(this);
		this.snake = new Snake(this, 5, 2, 3);

		//Start loop.
		var _this = this;
		this.interval = setInterval(function () {

			_this.update();

		}, 1000/this.fps);

	}

	update() {

		if (this.isPaused)
			return;

		this.spanScore.innerHTML = this.score;
		this.spanDeaths.innerHTML = this.deaths;
		this.spanMaxScore.innerHTML = this.maxScore;

		if (! this.snake.isAlive) {

			this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
			this.score = 0;
			this.deaths++;

			this.snake = new Snake(this, 5, 2, 3);
			this.food.placeFood();

		}

		this.food.update();
		this.snake.update();

		//If the snake its the food, it grows. Just like real live.
		if (this.snake.x == this.food.x && this.snake.y == this.food.y) {

			this.food.placeFood();
			this.snake.addPart();
			this.score++;

		}

		this.grid.update();
	}

}
