const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const upload = require('../uploadConfig');

router.post('/', upload.single('image'), petController.createPet);
router.delete('/:id', petController.deletePet);
router.put('/:id', upload.single('image'), petController.updatePet);
router.post('/rate', petController.ratePet);

module.exports = router;