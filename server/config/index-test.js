/*jshint expr: true*/

require('should');
var config = require('./index');

describe('config', function() {
	it('should define a port', function() {
		config.port.should.be.a.Number;
	});
});