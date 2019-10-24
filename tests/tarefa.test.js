const request = require('supertest');
const app = require('../src/app');
const Tarefa = require('../src/models/Tarefa');
const { idUsuarioPadrao, usuarioPadrao, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Deveria criar tarefa para usuário', async () => {
    const response = await request(app)
        .post('/tarefas')
        .set('Authorization', `Bearer ${usuarioPadrao.tokens[0].token}`)
        .send({
            descricao: 'A partir de um teste'
        })
        .expect(201);

    const tarefa = await Tarefa.findById(response.body._id);
    expect(tarefa).not.toBeNull();
    // Verifica valor padrão 
    expect(tarefa.concluida).toBe(false);
});