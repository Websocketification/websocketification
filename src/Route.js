/**
 * Created by fisher at 12:33 PM on 3/26/17.
 */

'use strict';

const http = require('http');
const utils = require('./utils');
const pathToRegexp = require('path-to-regexp');

const METHOD_ALL = 'ALL';

/**
 * Decode params parsed from url.
 */
const decode_param = (val) => {
	return decodeURIComponent(val);
	// @see ExpressJs
	// if (typeof val !== 'string' || val.length === 0) {return val;}
	// try {
	// 	return decodeURIComponent(val);
	// } catch (err) {
	// 	if (err instanceof URIError) {
	// 		err.message = 'Failed to decode param \'' + val + '\'';
	// 		err.status = err.statusCode = 400;
	// 	}
	// 	throw err;
	// }
};

/**
 * Route handle requests if desired path meets.
 *
 * Routes help handle requests that are passed to each router.
 */
class Route {
	constructor(router, path, ...handlers) {
		['match', 'matchChild', 'handle'].map(method => this[method] = this[method].bind(this));
		this.mRouter = router;
		this.mPath = path;
		this.mHandlers = handlers;
		// Add methods.
		[METHOD_ALL].concat(http.METHODS).map(method => {
			let m = method.toLowerCase();
			Route.prototype[m] = (...handlers) => {
				if (!this[method]) {
					this[method] = handlers;
				} else {
					this[method] = this[method].concat(handlers);
				}
				return this;
			}
		});
		if (!this.mPath || '*' === this.mPath) {return;}
		if (!this.mPath.startsWith('/')) {
			this.mPath = '/' + this.mPath;
		}
		while (this.mPath.endsWith('/')) {
			this.mPath = this.mPath.substring(0, this.mPath.length - 1);
		}
		this.mRegexp = pathToRegexp(this.mPath, this.mKeys = [], {});
		this.mRegexpPrefix = pathToRegexp(this.mPath + '*', [], {});
	}

	/**
	 * Whether this route matches.
	 * TODO add grep support.
	 */
	match(path, req, res) {
		return new Promise((resolve, reject) => {
			let {mPath, mRegexp: regexp, mKeys} = this;
			if (!mPath && !path) {return resolve();}
			if (path === mPath) {return resolve();}
			if (!mPath) {return reject();}
			let match = regexp.exec(path);
			if (!match) {return reject();}
			if (1 === match.length) {
				// Totally match.
				return resolve();
			}
			// Here can use async.
			let i = 1;
			let t = () => {
				if (i >= match.length) {return resolve();}
				let matchi = match[i];
				// Set params.
				let name = mKeys[i - 1].name;
				i++;
				let value = decode_param(matchi);
				// if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
				this.mRouter.onParamParsed(null, req, res, name, value, t);
				// }
			};
			t();
		});
	}

	/**
	 * Match the children routes.
	 */
	matchChild(path, req, res) {
		return new Promise((resolve, reject) => {
			let {mRegexpPrefix: regexp, mKeys} = this;
			if (!this.mPath || '*' === this.mPath) {return resolve(path);}
			let match = regexp.exec(path);
			if (!match) {return reject();}
			// Here match length should be greater than or equal to 2.
			if (2 === match.length) {
				return resolve(match.pop());
			}
			let i = 1;
			let t = () => {
				// Here we end at match.length - 1 because we add a * into the path.
				if (i >= match.length - 1) {return resolve(match.pop());}
				let matchi = match[i];
				// Set params.
				let name = mKeys[i - 1].name;
				i++;
				let value = decode_param(matchi);
				// if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
				this.mRouter.onParamParsed(match[1], req, res, name, value, t);
				// }
			};
			t();
		});
	}

	/**
	 * Handle requests.
	 */
	handle(path, req, res, next) {
		let {mHandlers: handlers} = this;
		this.match(path, req, res).then((remainingPath = '') => {
			// NO ERROR RETURNED.
			if (0 < handlers.length) {
				utils.handleRequests(remainingPath, handlers, req, res, next);
			} else {
				utils.handleRequests(remainingPath, this[METHOD_ALL], req, res, () => {
					utils.handleRequests(remainingPath, this[req.method], req, res, next);
				});
			}
		}).catch((error) => {
			this.matchChild(path, req, res).then((remainingPath = '') => {
				utils.handleRequests(remainingPath, handlers, req, res, next);
			}).catch((error) => {
				next();
			})
		});
		return this;
	}
}

module.exports = Route;
