/**
 * Created by fisher at 3:48 PM on 3/26/17.
 */

'use strict';

let Router;
let Route;

/**
 * Delay require;
 */
exports.initialize = () => {
	Router = require('./Router');
	Route = require('./Route');
};

/**
 * Handle requests.
 *
 * @param remainingPath
 * @param handlers{Function|Router} Handlers
 * @param req{Request} Request.
 * @param res{Response} Response.
 * @param next{Function} Function.
 */
exports.handleRequests = (remainingPath, handlers, req, res, next) => {
	if (!handlers || handlers.length === 0) {return next();}
	let i = 0;
	let goOn = () => {
		// Here can use require(`async`).
		if (i < handlers.length) {
			let m = handlers[i++];
			if (m instanceof Router || m instanceof Route) {
				m.handle(remainingPath, req, res, goOn);
			} else if (typeof m === 'function') {
				m(req, res, goOn);
			} else {
				throw Error('Unrecognized handler: ' + typeof m);
			}
		} else {
			// Maybe here can check the methods.
			// this.handleMethods(req, res, next);
			next();
		}
	};
	goOn();
};

/**
 * Route a path.
 * @param router
 * @param path Route path.
 * @param middlewares Middlewares.
 * @returns {Route} Route.
 */
exports.getRoute = (router, path, ...middlewares) => {
	// instanceof Middleware or Router.
	if (typeof path === 'function' || path instanceof Router) {
		middlewares.unshift(path);
		path = undefined;
	} else if (typeof path === 'string') {

	} else {
		throw TypeError('Path should be string.');
	}
	return new Route(router, path, ...middlewares);
};
