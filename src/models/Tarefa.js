const mongoose = require('mongoose')

const TarefaSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true,
        trim: true
    },
    concluida: {
        type: Boolean,
        default: false
    },
    proprietario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

const Tarefa = mongoose.model('Tarefa', TarefaSchema);

module.exports = Tarefa;


