const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_secreto_aqui'; // Asegúrate de mantener este secreto seguro
 
const auth = (request, response, next) => {
    const token = request.cookies.token

    if (!token) {
        return response.status(401).send("No puedes ver esto, no estas autenticado");
    }

    jwt.verify(token, SECRET_KEY, (error, user) => {
        if (error) {
            return response.status(403).send("No puedes ver esto, autenticacion fallida");  
        }
        request.user = user;
        next();
    })
    

}

module.exports = auth