/**
 * Created by fisher at 11:48 PM on 3/25/17.
 */

'use strict';

const Response = require('./Response');
const Request = require('./Request');
const utils = require('./utils');

/**
 * A connection will be created once a client is connected.
 */
class Connection {
	constructor(ws, onConnectionRoutes, routes, onCloseRoutes) {
		['onClose', 'onMessage'].map(key => this[key] = this[key].bind(this));
		this.mWS = ws;
		/**
		 * Initialize session request and response locals.
		 */
		this.mWS.mRequestLocals = {};
		this.mWS.mResponseLocals = {};
		this.mRoutes = routes;
		this.mOnConnectionRoutes = onConnectionRoutes;
		this.mOnCloseRoutes = onCloseRoutes;
		let req = new Request(this.mWS, {});
		let res = new Response(this.mWS, req);
		utils.handleRequests(this.mWS.upgradeReq.url, this.mOnConnectionRoutes, req, res, () => {
		});
	}

	onClose() {
		let req = new Request(this.mWS, {});
		let res = new Response(this.mWS, req);
		utils.handleRequests(this.mWS.upgradeReq.url, this.mOnCloseRoutes, req, res, () => {
		});
	}

	onMessage(message) {
		console.log(`Got message: ${message}`);
		try {
			message = JSON.parse(message);
		} catch (ex) {
			// Here we ignore the invalid json string send from client.
			new Response(this.mWS, new Request(this.mWS, {})).error(400, 'BAD REQUEST!');
			return;
		}
		/**
		 * The request and response object.
		 */
		let req = new Request(this.mWS, message);
		req.sessions = this.mWS.mRequestLocals;
		let res = new Response(this.mWS, req);
		res.sessions = this.mWS.mResponseLocals;
		/**
		 * Call routers one by one.
		 */
		utils.handleRequests(req.path, this.mRoutes, req, res, () => {
			console.log('NOT FOUND: ', req);
			res.error(404);
		});
	}
}

module.exports = Connection;
