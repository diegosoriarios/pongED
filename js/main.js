var game = playground({

	width: 900,
	height: 600,

	create: function() {
		$._ = this.layer;

		this.canvasOverlayElem = document.getElementsByClassName( 'canvas-overlay' )[ 0 ];
		this.canvasOverlayElem.style.width = this.width + 'px';
		this.canvasOverlayElem.style.height = this.height + 'px';

		this.scoreHeroElem = document.getElementsByClassName( 'score-hero-text' )[ 0 ];
		this.scoreCompElem = document.getElementsByClassName( 'score-comp-text' )[ 0 ];

		this.gameoverElem = document.getElementsByClassName( 'gameover' )[ 0 ];

		this.mute = false;
	},

	ready: function() {
		this.setState( $.StatePlay );
	}
});