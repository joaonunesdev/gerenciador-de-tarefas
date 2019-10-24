const Usuario = require('../models/Usuario');

exports.store = async (req, res) => {
    const usuario = new Usuario(req.body);
    try {
        await usuario.save();
        const token = await usuario.generateAuthToken();
        res.status(201).send({ usuario, token });
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.update = async (req, res) => {
    const updates = Object.keys(req.body); // It returns an array of the keys in the body of the reponse (e.g., [ 'name', 'email', 'password' ])
    const allowedUpdates = ['nome', 'email', 'senha', 'idade']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Operação inválida!'} );
    }

    try {
        updates.forEach((update) => req.usuario[update] = req.body[update]);
        await req.usuario.save();

        res.send(req.usuario);
    } catch (e) {
        res.status(400).send();
    }
}

exports.destroy = async (req, res) => {
    try {
        await req.usuario.remove()
        res.send(req.usuario);
    } catch (e) {
        res.status(500).send();
    }
}






