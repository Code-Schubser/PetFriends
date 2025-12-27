const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/', petController.createPet);
router.delete('/:id', petController.deletePet);
router.put('/:id', petController.updatePet);

module.exports = router;