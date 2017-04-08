/**
 * Created by fisher at 11:55 PM on 3/25/17.
 */

'use strict';

class Response {
	constructor(ws, req) {
		['header', 'done', 'error', '_done'].map(method => this[method] = this[method].bind(this));
		this.mWS = ws;
		this.mReq = req;
		this.mHeaders = [];
		/**
		 * Local variables for response.
		 */
		this.locals = {};
	}

	/**
	 * FIXME ? Remove it
	 * Set headers of response.
	 *
	 * @param headers(Object|String)
	 * @param value(String)
	 */
	header(headers, value) {
		if (value) {
			this.mHeaders[headers] = value;
		} else {
			for (let k in headers) {
				this.mHeaders[k] = headers[k];
			}
		}
	}

	done(data) {
		this._done(200, data)
	}

	error(code, error) {
		if (error) {console.error(error);}
		this._done(code);
	}

	/**
	 * Response to client.
	 * @param code
	 * @param data
	 * @private
	 */
	_done(code, data) {
		let json = {
			method: this.mReq.method,
			path: this.mReq.path,
			headers: this.mHeaders,
			status: code,
		};
		if (data) {json.body = data;}
		console.log('Responding: ', JSON.stringify(json));
		this.mWS.send(JSON.stringify(json));
	}

}

module.exports = Response;
