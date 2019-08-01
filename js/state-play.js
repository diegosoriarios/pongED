$.StatePlay = {
};

$.StatePlay.enter = function() {
	this.tick = 0;

	this.flashTick = 0;
	this.flashTickMax = 30;

	this.rumbleTick = 0;
	this.rumbleTickMax = 60;
	this.rumbleMagnitude = 30;

	this.startTick = 0;
	this.startTickMax = 80;

	this.gameoverTick = 0;
	this.gameoverTickMax = 100;

	this.paddleHero = new Paddle({
		radius: 100,
		extrusion: 20,
		extend: 50,
		flip: false,
		hue: 220
	});

	this.paddleComp = new Paddle({
		radius: 100,
		extrusion: 20,
		extend: 50,
		flip: true,
		hue: 10
	});

	this.scoreHero = 0;
	this.scoreComp = 0;
	this.scoreMax = 7;

	this.ball = new Ball();

	this.particles = new Pool( Particle, 100 );

	game.scoreHeroElem.innerHTML = 0;
	game.scoreCompElem.innerHTML = 0;

	this.gameover = false;
	game.gameoverElem.innerHTML = '';

	document.body.className = 'gameover-hidden';
};


$.StatePlay.leave = function() {
	this.paddleHero = null;
	this.paddleComp = null;
	this.ball = null;
	this.particles = null;
};

$.StatePlay.step = function() {
	this.particles.each( 'step' );
	this.paddleHero.step();
	this.paddleComp.step();
	this.ball.step();

	// decrement flash tick
	if( this.flashTick > 0 ) {
		this.flashTick--;
	}

	// decrement rumble tick
	if( this.rumbleTick > 0 ) {
		this.rumbleTick--;
	}

	// increment start tick
	if( this.startTick < this.startTickMax ) {
		this.startTick++;
		if( this.startTick === this.startTickMax && !this.gameover ) {
			var soundName = 'burst',
				sound = game.playSound( soundName );
			game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.3 ) );
		}
	}

	// increment gameover
	if( this.gameover && this.gameoverTick < this.gameoverTickMax ) {
		this.gameoverTick++;
	}

	this.tick++;
};

$.StatePlay.render = function() {
	$._.context.save();

	if( this.rumbleTick ) {
		var base = ( this.rumbleTick / this.rumbleTickMax ) * this.rumbleMagnitude,
			x = $.rand( -base, base ),
			y = $.rand( -base, base );
		$._.context.translate( x, y );
	}

	$._.context.globalCompositeOperation = 'destination-out';
	$._.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
	$._.context.fillRect( 0, 0, $.StatePlay.app.width, $.StatePlay.app.height );
	$._.context.globalCompositeOperation = 'lighter';

	$._.lineWidth( 13 );

	// render hero extrusion
	$._.strokeStyle( 'hsla(' + this.paddleHero.color.hue + ', 90%, 60%, 1)' );
	$._.strokeLine( this.paddleHero.extrusion + this.paddleHero.extend + 0.5, 0, this.paddleHero.extrusion + this.paddleHero.extend + 0.5, game.height );

	// render comp extrusion
	$._.strokeStyle( 'hsla(' + this.paddleComp.color.hue + ', 90%, 60%, 1)' );
	$._.strokeLine( game.width - this.paddleComp.extrusion - this.paddleComp.extend + 0.5, 0, game.width - this.paddleComp.extrusion - this.paddleComp.extend + 0.5, game.height );

	// render divider
	$._.lineWidth( 12 );
	$._.strokeStyle( '#fff' );
	$._.strokeLine( game.width / 2 + 0.5, 0, game.width / 2 + 0.5, game.height );

	this.paddleHero.render();
	this.paddleComp.render();
	this.ball.render();

	this.particles.each( 'render' );

	if( this.flashTick ) {
		$._.fillStyle( 'hsla(0, 0%, 100%, ' + ( ( this.flashTick / this.flashTickMax ) / 3 ) + ')' ).fillRect( 0, 0, game.width, game.height );
	}

	$._.context.restore();
};

$.StatePlay.keydown = function( e ) {
	if( this.gameover && this.gameoverTick >= this.gameoverTickMax ) {
		game.setState( $.StatePlay );
	}

	if( e.key === 'm' ) {
		console.log( 'ok' );
		game.mute = !game.mute;
		if( game.mute ) {
			game.sound.setMaster( 0 );
		} else {
			game.sound.setMaster( 1 );
		}
	}
};