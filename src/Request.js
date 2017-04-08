/**
 * Created by fisher at 12:07 AM on 3/26/17.
 */

'use strict';

class Request {
	constructor(ws, {method = 'GET', path = '', query = {}, body = {}}) {
		this.ws = ws;
		this.method = method;
		this.path = path;
		this.query = query;
		/**
		 * This should passed directly from request.
		 * @type {{}}
		 */
		this.body = body;
		this.params = {};
		this._params = {};
	}

}
module.exports = Request;
