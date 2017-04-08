# Websocketification

<!-- > Created by Fisher at 22:53 on 2017-03-15. -->

Real-time, unopinionated, web framework for node.

**UNDERDEVELOPMENT!**

## TODO

- [ ] Add statics and series methods to request and response.
- [ ] Tests.
- [ ] Documentations.

## Differences from ExpressJs

- Websocketification uses ECMAScript 6. The classes, feathers make it easier to code.
- Websocketification tries to keep the API as well as the source codes neat and simple.
- Websocketification will power you real-time since it is based on WebSocket Server.

## Get-Started/Installation

<!-- ``` -->
<!-- npm install --save websocketification -->
<!-- ``` -->

## Simple Usage

```
const http = require('http');
const WebSocket = require('ws');
const wst = require('websocketification');

// Server wrapper.
const mServer = http.createServer();
// Websocket server.
const mWebSocketServer = new WebSocket.Server({server: mServer});

// The app instance.
const app = wst(mWebSocketServer);
const port = 3123;

app.onConnected((req, res, next) => {
	console.log('Hello client!');
	next();
});
app.onClosed((req, res, next) => {
	console.log('Remote Peer closed connection!');
	next();
});
// Middlewares or routers.
// app.use([path, ]...middlewares/...routers);
app.use('/users', (req, res) => {
	res.done([{
		id: 0,
		name: 'Tom'
	}]);
});

// Here we use the wrapper server to listen.
mServer.listen(port);
console.log(`App is listening on port: ${port}.`);
```

## Together With Express


```
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const wst = require('websocketification');

// Express server.
const mExpressApp = express();
mExpressApp.use('/hello', (req, res) => {
	console.log('Hello: ', req.originalUrl);
	res.end('Hello :)');
});

// Server wrapper.
const mServer = http.createServer();
// Websocket server.
const mWebSocketServer = new WebSocket.Server({server: mServer});

// The app instance.
const app = wst(mWebSocketServer);
const port = 3123;

app.onConnected((req, res, next) => {
	console.log('Hello client!');
	next();
});
app.onClosed((req, res, next) => {
	console.log('Remote Peer closed connection!');
	next();
});
// Middlewares or routers.
// app.use([path, ]...middlewares/...routers);
app.use('/users', (req, res) => {
	res.done([{
		id: 0,
		name: 'Tom'
	}]);
});

// Here we use the wrapper server to listen.
mServer.listen(port);
console.log(`App is listening on port: ${port}.`);
```


## Simple and Strong API & Codes

**Router API:**

Methods like `router.get(path, , middleware/router, [...middlewares/...routers]` are removed.

```js
// Your router file './router.js'
const router = new require('websocketification').Router({});

router.use(middleware/router, [...middleware/...router]);

router.use(path, middleware/router, [...middlewares/...routers]);

router.param(phraseID, middleware/router, [...middlewares/...routers]);

router.route(path)
    .get(middleware/router, [...middlewares/...routers])
    .post(middleware/router, [...middlewares/...routers])
    .delete(middleware/router, [...middlewares/...routers]);

module.exports = router;
```

**Application API:**

In this case, Application still extends Router,
but methods like `app.get(path, , middleware/router, [...middlewares/...routers]` do not exist any more,
i.e., we are forced to use routers :)

```js
// In your ./index.js;
const Websocketification = require('websocketification');
const routers = require('./router');

const app = new Websocketification(<websocket-server-instance>);

app.use(routers);

app.use([path, ]middlewares/routers);
app.listen(port);
```

## Lightweight

Websocketification Dependencies:

```
"dependencies": {
    "path-to-regexp": "^1.7.0"
}
```


