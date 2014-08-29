(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcWebSocket', function($window, $rootScope) {
			var isSupported = angular.isFunction($window.WebSocket);
			var defaultOptions = {
				autoReconnect: true
			};
			
			function pcWebsocket(url, options) {
				if (!isSupported) {
					throw new Error("This browser does not support web sockets.");
				}
				var _options = angular.extend(angular.copy(defaultOptions), options);
				
				var _socket = new $window.WebSocket(url);
				var _listeners = { open: [], message: [], close: [], error: [] };
				
				_socket.onopen = function(e) {
					$rootScope.$apply(function() {
						angular.forEach(_listeners.open, function(listener) {
							listener(e);
						});
					});
				};
				
				_socket.onclose = function(e) {
					// todo: reconnect?
					$rootScope.$apply(function() {
						angular.forEach(_listeners.close, function(listener) {
							listener(e.code, e.reason);
						});
						// remove all listeners since we closed
						_listeners = { open: [], message: [], close: [], error: [] };
					});
				};
				
				_socket.onerror = function(e) {
					$rootScope.$apply(function() {
						angular.forEach(_listeners.error, function(listener) {
							listener(e);
						});
					});
				};
				
				_socket.onmessage = function(e) {
					$rootScope.$apply(function() {
						angular.forEach(_listeners.message, function(listener) {
							listener(e.data);
						});
					});
				};
				
				var on = function(event, callback) {
					if (!angular.isArray(_listeners[event])) {
						throw new Error("Unsupported event: " + event);
					}
					_listeners[event].push(callback);
					return function() {
						_listeners[event].splice(_listeners[event].indexOf(callback), 1);
					};
				};
				
				if (_options.linkedScope && angular.isFunction(options.linkedScope.on)) {
					_options.linkedScope.on('$destroy', function() {
						_socket.close();
					});
				}
				
				return {
					url: url,
					close: _socket.close,
					send: _socket.send,
					on: on
				};
			}
			
			pcWebsocket.isSupported = isSupported;
			return pcWebsocket;
		});
})(angular);