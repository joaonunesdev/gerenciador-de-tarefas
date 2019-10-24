const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tarefa = require('../models/Tarefa');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('E-mail inválido');
            }
        }
    },
    senha: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('senha')) {
                throw new Error('A senha não pode conter a palavra "senha"');
            }
        }
    },
    idade: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('A idade deve ser um número positivo');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

UsuarioSchema.virtual('tarefas', {
    ref: 'Tarefa',
    localField: '_id',
    foreignField: 'proprietario'
});

/**
 * Método que retorna uma representação simplificada de um usuário
 * 
 * É chamado por JSON.stringfy() internamente
 * 
 * @method Usuario.toJSON
 * @this Usuario
 * @returns Objeto Usuario sem avatar, token e senha
 * @see https://mongoosejs.com/docs/guide.html
 * 
 */
UsuarioSchema.methods.toJSON = function () {
    const usuario = this;
    const usuarioObject = usuario.toObject();

    console.log(usuario)

    delete usuarioObject.senha;
    delete usuarioObject.tokens;
    delete usuarioObject.avatar;

    console.log(usuarioObject)

    return usuarioObject;
}

/**
 * Gera um novo token para o usuário (ao realizar login) e adiciona o token na lista de tokens do usuário
 * 
 * @method Usuario.generateAuthToken
 * @this Usuario
 * @returns token codificado com _id do usuário
 */
UsuarioSchema.methods.generateAuthToken = async function () {
    const usuario = this;
    const token = jwt.sign({ _id: usuario._id.toString() }, 'secret');

    usuario.tokens = usuario.tokens.concat({ token });

    await usuario.save();

    return token;
}

/**
 * Busca o usuário que loga no sistema
 * 
 * @method Usuario.findByCredentials
 * @param {string} email email do usuário
 * @param {string} password senha do usuário
 * @returns Usuário
 */
UsuarioSchema.statics.findByCredentials = async (email, senha) => {
    const usuario = await Usuario.findOne( { email });

    if (!usuario) {
        throw new Error('Não foi possível realizar login');
    }

    const isMatch = await bcrypt.compare(senha, usuario.senha);

    if (!isMatch) {
        throw new Error('Não foi possível realizar login');
    }

    return usuario;
}

/**
 * Middleware que realiza hash de uma nova senha do usuário antes de salvar
 * 
 * @method Usuario.preSave
 * @this Usuario
 * 
 * @returns Usuário
 */
UsuarioSchema.pre('save', async function (next) {
    const usuario = this;

    if (usuario.isModified('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 8);
    }

    next();
});

/**
 * Middleware que remove as tarefas de um usuário quando ele é deletado
 * 
 * @method User.preRemove
 * @this User
 * 
 */
UsuarioSchema.pre('remove', async function (next){
    const usuario = this;
    await Tarefa.deleteMany({ proprietario: usuario._id });
    next();
});

const Usuario = mongoose.model('Usuario', UsuarioSchema );

module.exports = Usuario;