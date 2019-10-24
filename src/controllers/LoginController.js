const Usuario = require('../models/Usuario');

exports.store = async (req, res) => {
    try {
        const usuario = await Usuario.findByCredentials(req.body.email, req.body.senha);
        const token = await usuario.generateAuthToken();
        res.send({ usuario, token });
    } catch (e) {
        res.status(400).send();
    }
}

exports.destroy = async (req, res) => {
    try {
        req.usuario.tokens = req.usuario.tokens.filter( (token) => {
            return token.token !== req.token;
        });
        await req.usuario.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }   
}

exports.destroyAll = async (req, res) => {
    try {
        req.usuario.tokens = [];
        await req.usuario.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
}