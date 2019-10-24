const express = require('express');
const multer = require('multer');
const usuarioController = require('../controllers/UsuarioController');
const loginController = require('../controllers/LoginController');
const avatarController = require('../controllers/AvatarController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Cria um usuário.
 * 
 * @name Usuario Cadastro 
 * @route {POST} /usuarios
 */
router.post('/usuarios', usuarioController.store);

/**
 * Realiza login e obtém token de autenticação.
 * 
 * @name Usuario Login 
 * @route {POST} /usuarios/login
 */
router.post('/usuarios/login', loginController.store);

/**
 * Realiza logout de um dispositivo específico.
 * 
 * @name Usuario Logout
 * @route {POST} /usuarios/logout
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.post('/usuarios/logout', auth, loginController.destroy);

/**
 * Realiza logout de todos dispositivos.
 * 
 * @name Usuario LogoutAll 
 * @route {POST} /usuarios/logoutAll
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.post('/usuarios/logoutAll', auth, loginController.destroyAll);

/**
 * Recupera o profile de um usuário.
 * 
 * @name Usuario Profile 
 * @route {GET} /usuarios/me
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.get('/usuarios/me', auth, avatarController.show);

/**
 * Atualiza os dados de um usuário.
 * 
 * @name Usuario Atualização 
 * @route {PATCH} /usuarios/me
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.patch('/usuarios/me', auth, usuarioController.update)

/**
 * Remove a conta de um usuário.
 * 
 * @name Usuario Remoção 
 * @route {DELETE} /usuarios/me
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.delete('/usuarios/me', auth, usuarioController.destroy)

/**
 * Configura o upload de avatar.
 * 
 * @name Upload Configuração 
 */
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Deve ser um arquivo de imagem'));
        }

        cb(undefined, true);
    }
});

/**
 * Realiza upload do avatar do usuário.
 * 
 * @name Upload Avatar
 * @route {POST} /usuarios/me/avatar
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.post('/usuarios/me/avatar', auth, upload.single('avatar'), avatarController.store, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

/**
 * Remove o avatar do usuário.
 * 
 * @name Avatar Remoção
 * @route {DELETE} /usuarios/me/avatar
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.delete('/usuarios/me/avatar', auth, avatarController.destroy, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

/**
 * Recupera o avatar de um usuário
 * 
 * @name Avatar Recuperação 
 * @param id Indenticador único do usuário.
 * @route {GET} /usuarios/id/avatar
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.get('/usuarios/:id/avatar', async (req, res) => {
    // TODO: adicionar middleware auth
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario || !usuario.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(usuario.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;

