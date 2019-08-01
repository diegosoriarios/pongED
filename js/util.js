$.PI = Math.PI;
$.TWOPI = $.PI * 2;

$.dist = function( p1x, p1y, p2x, p2y ) {
	var dx = p1x - p2x,
		dy = p1y - p2y;
	return Math.sqrt( dx * dx + dy * dy );
};

$.rand = function( min, max ) {
	return Math.random() * ( max - min ) + min;
};

$.randInt = function(min, max) {
	return Math.floor( min + Math.random() * ( max - min + 1 ) );
};

$.merge = function( obj1, obj2 ) {
	for( var prop in obj2 ) {
		obj1[ prop ] = obj2[ prop ];
	}
};