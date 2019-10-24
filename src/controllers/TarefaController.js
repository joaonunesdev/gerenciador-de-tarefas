const Tarefa = require('../models/Tarefa')

exports.store = async (req, res) => {
    const tarefa = new Tarefa({
        ...req.body,  //spread operator
        proprietario: req.usuario._id
    });

    try {
        await tarefa.save();
        res.status(201).send(tarefa);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.index = async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.usuario.populate({
            path: 'tarefas',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.usuario.tarefas);
    } catch (e) {
        res.status(500).send();
    }
}

exports.show = async (req, res) => {
    const _id = req.params.id;

    try {
        const tarefa = await tarefa.findOne({ _id, proprietario: req.usuario._id });
        
        if (!tarefa) {
            return res.status(404).send();
        }

        res.send(tarefa);
    } catch (e) {
        res.send(500).send();
    }

}

exports.update = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['descricao', 'concluida'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)); 

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Operação inválida!'} );
    }

    try {
        const tarefa = await tarefa.findOne({ _id: req.params.id, proprietario: req.usuario._id });

        if (!tarefa) {
            res.status(404).send();
        }

        updates.forEach((update) => tarefa[update] = req.body[update]);
        await tarefa.save();
        res.send(tarefa);
    } catch (e) {
        res.status(400).send(e);
    }

}

exports.destroy = async (req, res) => {
    try {
        const tarefa = await tarefa.findOneAndDelete({ _id: req.params.id, proprietario: req.usuario._id });

        if (!tarefa) {
            return res.status(404).send();
        }

        res.send(tarefa);
    } catch (e) {
        res.status(500).send();
    }
}

