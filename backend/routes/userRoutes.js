const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);

// NEU: Route für die Haustiere eines Nutzers (HP-01)
router.get('/:id/pets', userController.getUserPets); 

module.exports = router;