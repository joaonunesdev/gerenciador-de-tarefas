const express = require('express');
require('./db/mongoose');
const usuarioRouter = require('./routes/usuario');
const tarefaRouter = require('./routes/tarefa');

const app = express();

app.use(express.json());
app.use(usuarioRouter);
app.use(tarefaRouter);

module.exports = app;

