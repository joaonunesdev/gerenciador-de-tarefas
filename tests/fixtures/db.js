const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Usuario = require('../../src/models/Usuario');
const Tarefa = require('../../src/models/Tarefa');
const idUsuarioPadrao = new mongoose.Types.ObjectId();

const usuarioPadrao = {
    _id: idUsuarioPadrao,
    nome: 'Optimus Prime',
    email: 'prime@email.com',
    senha: 'bumblebee;)',
    tokens: [{
        token: jwt.sign({
                _id: idUsuarioPadrao
            },
            process.env.JWT_SECRET
        )
    }]
};

const setupDatabase = async () => {
    await Usuario.deleteMany();
    await Tarefa.deleteMany();
    await new Usuario(usuarioPadrao).save();
}

module.exports = {
    idUsuarioPadrao,
    usuarioPadrao,
    setupDatabase 
}