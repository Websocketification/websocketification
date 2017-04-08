/**
 * Created by fisher at 10:53 PM on 3/25/17.
 */

'use strict';

const Router = require('./Router');
const Route = require('./Route');
const Connection = require('./Connection');
const utils = require('./utils');
utils.initialize();

/**
 * TODO Support express middlewares.
 * ? Configure middlewares only be used once on connection.
 */
class Application extends Router {
	constructor(wss, options) {
		super(options);
		['onConnected', 'onClosed'].map(method => this[method] = this[method].bind(this));
		// options = {
		// 	webSocket: true,
		// 	express: true,
		// };
		this.mWSS = wss;
		/**
		 * App level locals variables.
		 */
		this.locals = {};
		/**
		 * Routes that will be called on connected.
		 */
		this.mOnConnectionRoutes = [];
		/**
		 * Routes that will be called on closed.
		 */
		this.mOnCloseRoutes = [];
		this.mWSS.on('connection', (ws) => {
			let connection = new Connection(ws, this.mOnConnectionRoutes, this.mRoutes, this.mOnCloseRoutes);
			ws.on('close', connection.onClose);
			ws.on('message', connection.onMessage);
		});
	};

	/**
	 * Called once only when connected.
	 */
	onConnected(path, ...middleWares) {
		let route = utils.getRoute(this, path, ...middleWares);
		this.mOnConnectionRoutes.push(route);
		return this;
	}

	/**
	 * Called once only when connection is closed.
	 */
	onClosed(path, ...middleWares) {
		let route = utils.getRoute(this, path, ...middleWares);
		this.mOnCloseRoutes.push(route);
		return this;
	}

}

module.exports = Application;
