/**
 * Created by fisher at 1:27 AM on 3/26/17.
 */

'use strict';

const Application = require('./src/Application');
const Router = require('./src/Router');
const Route = require('./src/Route');
const Connection = require('./src/Connection');
const Request = require('./src/Request');
const Response = require('./src/Response');

/**
 * Create a new app.
 */
let wst = module.exports = (...args) => new Application(...args);

/**
 * Export modules.
 */
wst.Application = Application;
wst.Router = Router;
wst.Route = Route;
wst.Connection = Connection;
wst.Request = Request;
wst.Response = Response;
