// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',           // Dirección del servidor
    user: 'usuario_zoo',           // Usuario de la base de datos
    password: 'zoodb',    // Contraseña del usuario
    database: 'zoo_db',       // Nombre de la base de datos
    port: 3306                    // Asegúrate de usar el puerto correcto
});

connection.connect(error => {
    if (error) {
        console.error('Error conectando a la base de datos:', error);
        return;
    }
    console.log('Conectado a la base de datos zoo_db');
});

module.exports = connection;
