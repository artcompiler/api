const { Router } = require('express');

const { getConfig } = require('./../config');
const { pingLang, getAsset } = require('./../lang');
const { isNonEmptyString } = require('./../util');

const data = require('./data');
const task = require('./task');
const compile = require('./compile');
const { buildConfigHandler } = require('./config');
const { buildLangRouter } = require('./lang');
const root = require('./root');

const configHandler = buildConfigHandler({ getConfig });
const langRouter = buildLangRouter({
  newRouter: () => new Router(),
  isNonEmptyString,
  pingLang,
  getAsset,
});

exports.data = data;
exports.task = task;
exports.compile = compile;
exports.langRouter = langRouter;
exports.configHandler = configHandler;
exports.root = root;

