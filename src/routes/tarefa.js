const express = require('express');
const tarefaController = require('../controllers/TarefaController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Salva uma tarefa.
 * 
 * @name Tarefa Cadastro 
 * @route {POST} /tarefas
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.post('/tarefas', auth, tarefaController.store);

/**
 * Recupera as tarefas de um usuário.
 * 
 * @name Tarefa do Usuário 
 * @route {GET} /tarefas?concluida=false
 * @route {GET} /tarefas?limit=5&skip=0
 * @route {GET} /tarefas?sortBy=createdAt:desc
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.get('/tarefas', auth, tarefaController.index);

/**
 * Recupera uma tarefa pela id.
 * 
 * @param id Indenticador único da tarefa.
 * @name Tarefa Cadastro 
 * @route {POST} /tarefas/id
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.get('/tarefas/:id', auth, tarefaController.show)

/**
 * Atualiza uma tarefa.
 * 
 * @name Tarefa Atualização 
 * @route {PATCH} /tarefas
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.patch('/tarefas/:id', auth, tarefaController.update)

/**
 * Remove uma tarefa pela id.
 * 
 * @name Tarefa Remoção 
 * @param id Indenticador único da tarefa.
 * @route {DELETE} /tarefas/id
 * @authentication Essa rota requer autenticação JWT e retorna 400 se falhar.
 */
router.delete('/tarefas/:id', auth, tarefaController.destroy)

module.exports = router;

