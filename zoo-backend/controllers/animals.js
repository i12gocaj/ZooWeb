const db = require('../config/db');

// Obtener todos los animales
exports.getAllAnimals = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM animals');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar un animal
exports.addAnimal = async (req, res) => {
  const { name, species, age } = req.body;
  try {
    const [result] = await db.query('INSERT INTO animals (name, species, age) VALUES (?, ?, ?)', [name, species, age]);
    res.json({ message: 'Animal añadido', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
