function Particle( opt ) {}

Particle.prototype.init = function( opt ) {
	$.merge( this, opt );
	this.life = 1;
	this.color.rAlpha = 0;
};

Particle.prototype.step = function( i ) {
	this.x += this.vx;
	this.y += this.vy;
	this.vy += this.gravity;
	this.life += this.decay;
	this.color.rAlpha = ( this.life / 1 ) * this.color.alpha;
	if( this.life <= 0 ) {
		game.state.particles.release( this );
	}
};

Particle.prototype.render = function() {
	$._.fillStyle( 'hsla(' + this.color.hue + ', ' + this.color.saturation + '%, ' + this.color.lightness + '%, ' + this.color.rAlpha + ')' ).fillCircle( this.x, this.y, this.radius );
};