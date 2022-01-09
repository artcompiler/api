const { Router } = require('express');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const uuid = require('uuid');

const { getConfig } = require('./../config');
const { pingLang, getAsset } = require('./../lang');
const { isNonEmptyString } = require('./../util');

const data = require('./data');
const task = require('./task');
const compile = require('./compile');
const { buildConfigHandler } = require('./config');
const { buildLangRouter } = require('./lang');
const { buildProxyHandler } = require('./proxy');
const root = require('./root');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const configHandler = buildConfigHandler({ getConfig });
const langRouter = buildLangRouter({
  newRouter: () => new Router(),
  isNonEmptyString,
  pingLang,
  getAsset,
});

const proxyHandler = buildProxyHandler({
  httpAgent,
  httpsAgent,
  log: console.log,
  getConfig,
  fetch,
  uuid,
});

exports.data = data;
exports.task = task;
exports.compile = compile;
exports.langRouter = langRouter;
exports.configHandler = configHandler;
exports.proxyHandler = proxyHandler;
exports.root = root;

