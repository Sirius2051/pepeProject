const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dbConfig = require('./config/config.json').development;
require('dotenv').config();
// const transporter = require('./config/mail');

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;


app.use('/uploads', express.static('uploads'));

// app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type'],
    credentials: true

}));

const sequelize = new Sequelize(
    dbConfig.database, 
    dbConfig.username,
    dbConfig.password, 
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect
    }
);

const User = require('./models/user')(sequelize, DataTypes);
const Post = require('./models/post')(sequelize, DataTypes);
const Commet = require('./models/comment')(sequelize, DataTypes);

sequelize.sync().then(() => {
    console.log('Tablas creadas');
});

// Importar las rutas del controlador
const userRoutes = require('./controllers/user'); // Asegúrate de que la ruta sea correcta
const postRoutes = require('./controllers/post'); // Asegúrate de que la ruta sea correcta
const commentRoutes = require('./controllers/comment'); // Asegúrate de que la ruta sea correcta
const cookieParser = require('cookie-parser');


// Usar las rutas del controlador
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


app.listen(port, () => {
    console.log(`Corriendo: ${host}:${port}`)
});
