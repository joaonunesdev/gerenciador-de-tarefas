const request = require('supertest');
const app = require('../src/app');
const Usuario = require('../src/models/Usuario');
const { idUsuarioPadrao, usuarioPadrao, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Deveria cadastrar um novo usuário', async () => {
    const response = await request(app)
        .post('/usuarios')
        .send({
            nome: 'John Doe',
            email: 'johndoe@email.com',
            senha: 'Mysf#as@sdfd!'
        })
        .expect(201);

        // Verifica se o banco de dados foi corretamente modificado
        const usuario = await Usuario.findById(response.body.usuario._id);
        expect(usuario).not.toBeNull();

        // Asserções sobre a resposta 
        expect(response.body).toMatchObject({
            usuario: {
                nome: 'John Doe',
                email: 'johndoe@email.com'
            },
            token: usuario.tokens[0].token
        });

        // Verifica se a senha passou pelo processo de hashing
        expect(usuario.senha).not.toBe('Mysf#as@sdfd!');
});

test('Deveria logar um usuário existente', async () => {
    const response = await request(app)
        .post('/usuarios/login')
        .send({
            email: usuarioPadrao.email,
            senha: usuarioPadrao.senha
        })
        .expect(200);

    // Verifica se o token foi salvo
    const usuario = await Usuario.findById(idUsuarioPadrao);
    expect(usuario.tokens[1].token).toBe(response.body.token);
});

test('Não deveria logar um usuário inexistente', async () => {
    await request(app)
        .post('/usuarios/login')
        .send({
            email: 'emailinexistente@email.com',
            senha: 'u3jkFJ3fdf3'
        })
        .expect(400);
});

test('Deveria recuperar o profile do usuário', async () => {
    await request(app)
        .get('/usuarios/me')
        .set('Authorization', `Bearer ${usuarioPadrao.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Não deveria recuperar o profile de um usuário não autorizado', async () => {
    await request(app)
        .get('/usuarios/me')
        .send()
        .expect(401)
});

test('Deveria remover a conta do usuário', async () => {
    await request(app)
        .delete('/usuarios/me')
        .set('Authorization', `Bearer ${usuarioPadrao.tokens[0].token}`)
        .send()
        .expect(200);
    
    const usuario = await Usuario.findById(idUsuarioPadrao);
    expect(usuario).toBeNull();
});

test('Não deveria remover a conta de um usuário não autenticado', async () => {
    await request(app)
        .delete('/usuarios/me')
        .send()
        .expect(401);
});

test('Deveria realizar o upload do avatar', async () => {
    await request(app)
        .post('/usuarios/me/avatar')
        .set('Authorization', `Bearer ${usuarioPadrao.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    
    const usuario = await Usuario.findById(idUsuarioPadrao);
    expect(usuario.avatar).toEqual(expect.any(Buffer));
});

test('Deveria atualizar propriedades válidas de um usuário', async () => {
    await request(app)
        .patch('/usuarios/me')
        .set('Authorization', `Bearer ${usuarioPadrao.tokens[0].token}`)
        .send({
            nome: 'Anderson Cooper'
        }).expect(200);

    const usuario = Usuario.findById(idUsuarioPadrao);
    expect(usuario.nome).not.toBe(usuarioPadrao.nome);
});

test('Não deveria atualizar propriedades inválidas de um usuário', async () => {
    await request(app)
        .patch('/usuarios/me')
        .set('Authorization', `Bearer ${usuarioPadrao.tokens[0].token}`)
        .send({
            location: 'Argentina' // Propriedade inexistente
        }).expect(400);
});