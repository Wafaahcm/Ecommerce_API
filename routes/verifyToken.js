/*ces middlewares permettent d'assurer l'authentification et l'autorisation des utilisateurs à l'aide de JSON Web Tokens. Ils garantissent que seules les personnes authentifiées et autorisées peuvent accéder aux ressources ou effectuer des actions spécifiques dans l'application. */



const jwt = require("jsonwebtoken"); //Cette ligne importe le module jsonwebtoken, qui est une bibliothèque Node.js utilisée pour gérer les JSON Web Tokens. Elle fournit des méthodes pour signer, vérifier et décoder les JWT.


const verifyToken = (req, res, next)=> { // Cette ligne déclare une fonction middleware appelée verifyToken. Les middlewares sont des fonctions qui peuvent être utilisées pour intercepter et traiter les requêtes avant qu'elles n'atteignent les routes finales.
    const authHeader = req.headers.token; //Cette ligne récupère la valeur du header "token" de la requête HTTP. L'idée est que le client devrait inclure le JWT dans le header "token" lorsqu'il fait des requêtes protégées qui nécessitent une authentification.
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user)=>{// Lorsque le serveur reçoit un JWT d'une requête ultérieure de l'utilisateur, il doit s'assurer que le JWT est authentique et n'a pas été altéré pendant son transit sur le réseau. Pour cela, le serveur vérifie la signature du JWT en utilisant la clé secrète. Si la signature est valide, cela signifie que le JWT n'a pas été modifié depuis sa création par le serveur, et donc qu'il est authentique.
            if (err) res.status(403).json("Token is not valid!"); //Si le JWT n'est pas valide (par exemple, si la clé secrète ne correspond pas), le middleware envoie une réponse d'erreur avec un statut 403 (Forbidden) pour indiquer que le JWT n'est pas valide, et l'accès à la route est refusé.
            req.user = user; //Si le JWT est valide, cela signifie que l'utilisateur est authentifié. Le middleware stocke alors les informations de l'utilisateur extraites du JWT dans l'objet req.user. 
            next();
        }) //Une fois que les informations de l'utilisateur sont stockées dans req.user, le middleware appelle la fonction next() pour passer au middleware suivant dans la chaîne de middlewares ou à la route correspondante.
    }else {
        return res.status(401).json("You are not Authenticated");
    } //Cela garantit l'authenticité du JWT et permet au serveur de faire confiance aux informations qu'il contient, telles que l'identifiant de l'utilisateur et ses autorisations.

};



  const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };


  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };




module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };