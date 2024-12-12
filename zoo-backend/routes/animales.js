const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animals');


router.get('/', animalController.getAllAnimals);
router.post('/', animalController.addAnimal);

module.exports = router;