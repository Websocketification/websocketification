/**
 * Created by fisher at 11:49 PM on 3/25/17.
 */

'use strict';

const http = require('http');
const Route = require('./Route');
const utils = require('./utils');

/**
 * Router allocate requests to each routes registered.
 *
 * No support for methods direct call for router.
 */
class Router {
	constructor(options) {
		['use', 'handle', 'param', 'onParamParsed'].map(key => this[key] = this[key].bind(this));
		/**
		 * Router ID.
		 * ? What to do with the router scope onParamListener.
		 */
		this.mID = `${+new Date()}-${Math.random()}`;
		this.mOptions = options;
		/**
		 * Routes to handle request.
		 */
		this.mRoutes = [];
		this.mParamsListener = {};
		Router.prototype.route = Router.prototype.use;
	}

	use(path, ...handlers) {
		let route = utils.getRoute(this, path, ...handlers);
		this.mRoutes.push(route);
		return route;
	}

	/**
	 * Set on param listener.
	 *
	 * THE PARAM LISTENER WILL AFFECT ACROSS REQUEST LIFETIME.
	 *
	 * @param paramID Param ID.
	 * @param handlers Handlers.
	 * @returns {Router}
	 */
	param(paramID, ...handlers) {
		this.mParamsListener[paramID] = handlers;
		return this;
	}

	/**
	 * Call listener on param parsed.
	 */
	onParamParsed(remainingPath, req, res, paramID, value, callback) {
		req.params[paramID] = value;
		// Did not listen the param or already called.
		if (!this.mParamsListener[paramID] || req._params[this.mID][paramID]) {return callback();}
		req._params[this.mID][paramID] = value;
		utils.handleRequests(remainingPath, this.mParamsListener[paramID], req, res, callback);
	}

	/**
	 * Push the request down to the end.
	 */
	handle(remainingPath, req, res, next) {
		let {mRoutes} = this;
		req._params[this.mID] = req._params[this.mID] || {};
		utils.handleRequests(remainingPath, mRoutes, req, res, next);
		return this;
	}

}

module.exports = Router;
