function Ball( opt ) {
	this.reset();
}

Ball.prototype.reset = function() {
	this.x = game.width / 2;
	this.y = game.height / 2;
	this.vMax = 10;
	this.vx = this.vMax;
	this.vy = this.vMax;
	this.vxMax = this.vMax;
	this.vyMax = this.vMax;
	this.radius = 20;
	this.drag = 0.99;
	this.hitTick = 0;
	this.hitTickMax = 30;
	this.color = {
		hue: 10,
		saturation: 70,
		lightness: 100,
		alpha: 0.8
	};
	this.hasHit = false;
	this.heroControlled = false;
	game.state.startTick = 0;
};

Ball.prototype.step = function() {
	var self = this;
	var didCollide = false;

	// check paddle collisions
	if( this.vx < 0 && $.dist( this.x, this.y, game.state.paddleHero.x, game.state.paddleHero.y ) <= this.radius + game.state.paddleHero.radius ) {
		var dx = this.x - game.state.paddleHero.x,
			dy = this.y - game.state.paddleHero.y,
			angle = Math.atan2( dy, dx ),
			ballSpeed = Math.sqrt( this.vx * this.vx + this.vy * this.vy ),
			paddleSpeed = Math.max( 0, Math.abs( game.state.paddleHero.vx ) * 1.2 );
			speed = ballSpeed + paddleSpeed;

		this.vx = Math.cos( angle ) * speed;
		this.vy = Math.sin( angle ) * speed;

		this.hitTick = this.hitTickMax;
		game.state.paddleHero.hitTick = game.state.paddleHero.hitTickMax;
		
		didCollide = true;

		this.color.hue = game.state.paddleHero.color.hue;
		this.heroControlled = true;
	}

	if( this.vx > 0 && $.dist( this.x, this.y, game.state.paddleComp.x, game.state.paddleComp.y ) <= this.radius + game.state.paddleComp.radius ) {
		var dx = this.x - game.state.paddleComp.x,
			dy = this.y - game.state.paddleComp.y,
			angle = Math.atan2( dy, dx ),
			ballSpeed = Math.sqrt( this.vx * this.vx + this.vy * this.vy ),
			paddleSpeed = Math.max( 0, Math.abs( game.state.paddleComp.vx ) * 1.2 );
			speed = ballSpeed + paddleSpeed;

		this.vx = Math.cos( angle ) * speed;
		this.vy = Math.sin( angle ) * speed;

		this.hitTick = this.hitTickMax;
		game.state.paddleComp.hitTick = game.state.paddleComp.hitTickMax;

		didCollide = true;

		this.color.hue = game.state.paddleComp.color.hue;
		this.heroControlled = false;
	}

	// lock velocity
	if( Math.sqrt( this.vx * this.vx + this.vy * this.vy ) > this.vMax ) {
		this.vx *= this.drag;
		this.vy *= this.drag;
	}

	var hit = false,
		hitX = false,
		hitY = false,
		hitRight = false,
		hitLeft = false;

	// lock x bounds
	if( this.x > game.width - this.radius ) {
		this.x = game.width - this.radius;
		this.vx = -this.vx;
		hit = true;
		hitX = true;
		hitRight = true;
	}
	if( this.x < this.radius ) {
		this.x = this.radius;
		this.vx = -this.vx;
		hit = true;
		hitX = true;
		hitLeft = true;
	}

	// lock y bounds
	if( this.y > game.height - this.radius ) {
		this.y = game.height - this.radius;
		this.vy = -this.vy;
		hit = true;
		hitY = true;
	}
	if( this.y < this.radius ) {
		this.y = this.radius;
		this.vy = -this.vy;
		hit = true;
		hitY = true;
	}

	if( hit ) {
		if( hitX ) {
			var soundName = 'score' + $.randInt( 1, 2 ),
				sound = game.playSound( soundName );
			game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.3  ) );

			var soundName = 'shatter' + $.randInt( 1, 19 ),
				sound = game.playSound( soundName );
			game.sound.setPlaybackRate( sound, $.rand( 0.9, 1.1 ) );

			game.state.flashTick = game.state.flashTickMax;
			game.state.rumbleTick = game.state.rumbleTickMax;

			if( hitRight ) {
				game.state.scoreHero++;
				game.scoreHeroElem.innerHTML = game.state.scoreHero;
				if( game.state.scoreHero >= game.state.scoreMax ) {
					game.state.gameover = true;
					game.gameoverElem.innerHTML = 'You win! ' + game.state.scoreHero + ' to ' + game.state.scoreComp + '.<br>Press any key to play again.';
					document.body.className = 'gameover-visible';
				}
			}
			if( hitLeft ) {
				game.state.scoreComp++;
				game.scoreCompElem.innerHTML = game.state.scoreComp;
				if( game.state.scoreComp >= game.state.scoreMax ) {
					game.state.gameover = true;
					game.gameoverElem.innerHTML = 'You lose! ' + game.state.scoreHero + ' to ' + game.state.scoreComp + '.<br>Press any key to play again.';
					document.body.className = 'gameover-visible';
				}
			}

			this.reset();
		}
		if( hitY ) {
			var soundName = 'wall' + $.randInt( 1, 3 ),
				sound = game.playSound( soundName );
			game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.3  ) );
		}

		this.hitTick = this.hitTickMax;
	}

	// apply velocity
	if( game.state.startTick >= game.state.startTickMax && !game.state.gameover ) {
		this.x += this.vx;
		this.y += this.vy;
	}

	// decrement hit tick
	if( this.hitTick > 0 ) {
		this.hitTick--;
	}

	// set color based on hit
	this.color.lightness = 60 + ( this.hitTick / this.hitTickMax ) * 40;

	if( didCollide ) {
		var soundName = 'shoot' + $.randInt( 1, 3 ),
			sound = game.playSound( soundName );
		if( soundName === 'shoot1' ) {
			game.sound.setVolume( sound, 0.5 );
		}
		game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.3 ) );
		this.hasHit = true;
	}

	game.state.particles.create({
		x: self.x,
		y: self.y,
		vx: self.vx / 8 + $.rand( -2, 2 ),
		vy: self.vy / 8 + $.rand( -2, 2 ),
		gravity: 0,
		radius: $.rand( 8, 15 ),
		decay: -0.01,
		color: {
			hue: self.color.hue,
			saturation: ( self.hasHit ? 70 : 0 ),
			lightness: 60,
			alpha: 0.5
		}
	});
};

Ball.prototype.render = function() {
	$._.fillStyle( 'hsla(' + this.color.hue + ', ' + ( this.hasHit ? this.color.saturation : 0 ) + '%, ' + this.color.lightness + '%, ' + this.color.alpha + ')' ).fillCircle( this.x, this.y, this.radius + 3 );
};