const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const upload = require('../uploadConfig');

// 1. Filter-Routen
router.get('/discovery', petController.getDiscoveryPets);
router.get('/species', petController.getSpecies);
router.get('/matches/count/:userId', petController.getMatchCount);
router.get('/matches/list/:userId', petController.getUserMatches);

// 2. Standard-Routen
router.get('/', petController.getAllPets); 
router.post('/', upload.single('image'), petController.createPet);
router.post('/rate', petController.ratePet);

// 3. Parameter-Routen (IMMER UNTEN)
router.put('/species/rename', petController.updateSpeciesName);
router.delete('/species/:name', petController.deleteSpeciesName);
router.put('/:id', upload.single('image'), petController.updatePet);
router.delete('/:id', petController.deletePet);

module.exports = router;