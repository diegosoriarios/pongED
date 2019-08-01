function Paddle( opt ) {
	this.radius = opt.radius;
	this.extrusion = opt.extrusion;
	this.extend = opt.extend;
	this.flip = opt.flip;

	this.x = this.flip ? game.width + this.radius - this.extrusion : -this.radius + this.extrusion;
	this.y = game.height / 2;

	this.vx = 0;
	this.vy = 0;

	this.vxMax = 100;
	this.vyMax = 10;

	this.ax = 2;
	this.ay = 2;

	this.drag = 0.8;

	this.hitTick = 0;
	this.hitTickMax = 30;

	this.canBurst = true;
	this.isBursting = false;

	this.goUp = false;
	this.goDown = false;

	this.color = {
		hue: opt.hue,
		saturation: 50,
		lightness: 55,
		alpha: 0.75
	};
}

Paddle.prototype.step = function() {
	var didBurst = false;

	if( this.flip ) {
		// comp paddle
		if( game.state.tick % 6 == 0 ) {
			if( game.state.ball.y > this.y + 50 ) {
				this.goDown = true;
			} else if( game.state.ball.y < this.y - 50 ) {
				this.goUp = true;
			} else {
				this.goUp = false;
				this.goDown = false;
			}
		}

		if( this.goDown ) {
			this.vy += this.ay;
		} else if( this.goUp ) {
			this.vy -= this.ay;
		} else {
			this.vy *= this.drag;
		}

		if( this.canBurst && game.state.ball.x > game.width - this.extrusion - this.extend - game.state.ball.vx  ) {
			this.isBursting = true;
			this.canBurst = false;
			didBurst = true;
		}

		if( this.isBursting ) {
			this.vx -= this.ax;
		} else {
			this.vx += this.ax / 10;
		}

		this.x += this.vx;
		this.y += this.vy;

		// lock x bounds
		if( this.x < game.width + this.radius - this.extrusion - this.extend ) {
			this.x = game.width + this.radius - this.extrusion - this.extend;
			this.vx = 0;
			this.isBursting = false;
		}
		if( this.x > game.width + this.radius - this.extrusion ) {
			this.x = game.width + this.radius - this.extrusion;
			this.vx = 0;
			this.canBurst = true;
		}
	} else {
		// hero paddle
		// check for controls, else drag

		if( game.keyboard.keys[ 'up' ] || game.keyboard.keys[ 'w' ] || game.keyboard.keys[ 'down' ] || game.keyboard.keys[ 's' ] ) {
			if( game.keyboard.keys[ 'up' ] || game.keyboard.keys[ 'w' ] ) {
				this.vy -= this.ay;
			}
			if( game.keyboard.keys[ 'down' ] || game.keyboard.keys[ 's' ] ) {
				this.vy += this.ay;
			}
		} else {
			this.vy *= this.drag;
		}

		if( this.canBurst && ( game.keyboard.keys[ 'space' ] || game.keyboard.keys[ 'right' ] || game.keyboard.keys[ 'd' ] || game.keyboard.keys[ 'left' ] || game.keyboard.keys[ 'a' ] ) ) {
			this.isBursting = true;
			this.canBurst = false;
			didBurst = true;
		}

		if( this.isBursting ) {
			this.vx += this.ax;
		} else {
			this.vx -= this.ax / 10;
		}

		this.x += this.vx;
		this.y += this.vy;

		// lock x bounds
		if( this.x > -this.radius + this.extrusion + this.extend ) {
			this.x = -this.radius + this.extrusion + this.extend;
			this.vx = 0;
			this.isBursting = false;
		}
		if( this.x < -this.radius + this.extrusion ) {
			this.x = -this.radius + this.extrusion;
			this.vx = 0;
			if( !this.canBurst ) {
				this.canBurst = true;
			}
		}
	}

	// both paddles

	// lock velocity
	if( this.vx < -this.vxMax ) {
		this.vx = -this.vxMax;
	}
	if( this.vx > this.vxMax ) {
		this.vx = this.vxMax;
	}
	if( this.vy < -this.vyMax ) {
		this.vy = -this.vyMax;
	}
	if( this.vy > this.vyMax ) {
		this.vy = this.vyMax;
	}

	// lock y bounds
	if( this.y < 0 ) {
		this.y = 0;
		this.vy = 0;
		this.goUp = false;
	}
	if( this.y > game.height ) {
		this.y = game.height;
		this.vy = 0;
		this.goDown = false;
	}

	// decrement hit tick
	if( this.hitTick > 0 ) {
		this.hitTick--;
	}

	if( didBurst ) {
		var soundName = 'burst',
			sound = game.playSound( soundName );
		game.sound.setPlaybackRate( sound, $.rand( 0.8, 1.3 ) );
	}
};

Paddle.prototype.render = function() {
	$._.fillStyle( 'hsla(' + this.color.hue + ', ' + this.color.saturation + '%, ' + ( this.color.lightness + ( this.hitTick / this.hitTickMax ) * 10 )  + '%, ' + this.color.alpha + ')' ).fillCircle( this.x, this.y, this.radius + 10 );
};