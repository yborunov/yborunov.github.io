exports.getRandom = function() {
	return generateRandom(1, 100);
};

function generateRandom(min, max) {
	return Math.floor((Math.random() * max) + min);
}