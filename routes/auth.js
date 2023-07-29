/* Lorsque le client soumet le formulaire d'inscription, les données saisies (nom d'utilisateur, email, mot de passe) sont envoyées au serveur dans le corps de la requête HTTP. Le serveur récupère alors ces données à partir de la requête (req.body) et les utilise pour créer un nouvel objet utilisateur en utilisant le modèle défini.

En résumé, le modèle est une représentation de la structure des données attendues pour les utilisateurs, tandis que les données réelles saisies dans le formulaire d'inscription sont utilisées pour créer des objets utilisateurs qui seront ensuite enregistrés dans la base de données. Le modèle assure que les données sont organisées et stockées de manière cohérente et structurée dans la base de données. */


const router = require("express").Router(); // la définition ou la créations d'un routeur  pour gérer les routes liées aux utilisateurs.
const User = require("../models/User"); // Cette ligne importe le modèle "User" défini dans le fichier "User.js" à partir du dossier "models". Le modèle "User" représente la structure des données pour les utilisateurs de l'application.
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); //est de donner accès aux fonctionnalités du module jsonwebtoken, permettant ainsi à votre application de gérer efficacement la création et la vérification des JSON Web Tokens pour l'authentification et l'autorisation des utilisateurs.
// REGISTER
router.post("/register", async (req, res)=>{ // async permet au serveur de continuer à effectuer d'autres tâches en parallèle pendant que des opérations asynchrones sont en cours.
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try{
        const saveUser = await newUser.save(); //await bloque l'exécution du code jusqu'à ce que l'opération asynchrone spécifiée soit terminée, assurant ainsi l'ordre et la cohérence des opérations.
        res.status(201).json(saveUser);
    }catch(err){
        res.status(500).json(err);
    }

    
});

// LOGIN
router.post("/login", async (req, res)=>{
    try {
        const user = await User.findOne({ username: req.body.username }); // Dans cette ligne, le serveur recherche l'utilisateur correspondant au nom d'utilisateur (fourni dans le corps de la requête) dans la base de données en utilisant le modèle User. La méthode findOne() de Mongoose est utilisée pour rechercher un seul document qui correspond aux critères spécifiés.
        !user && res.status(401).json("wrong credentials!"); // Si aucun utilisateur correspondant au nom d'utilisateur n'est trouvé dans la base de données, cela signifie que les informations d'identification sont incorrectes. Dans ce cas, le serveur renvoie une réponse JSON avec un statut 401 (Unauthorized) et un message indiquant que les informations d'identification sont incorrectes.
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC); //Si un utilisateur est trouvé, le serveur récupère le mot de passe haché stocké dans la base de données pour cet utilisateur. Le mot de passe haché a été encrypté à l'aide de CryptoJS avec une clé secrète (process.env.PASS_SEC).
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8); // Le mot de passe haché est décrypté à l'aide de CryptoJS et converti en texte brut à l'aide de la méthode toString().
        Originalpassword !== req.body.password && res.status(401).json("wrong credentials!"); //Le mot de passe décrypté est comparé avec le mot de passe fourni dans le corps de la requête (fourni par le client). Si les mots de passe ne correspondent pas, cela signifie que les informations d'identification sont incorrectes, et le serveur renvoie une réponse JSON avec un statut 401 (Unauthorized) et un message indiquant que les informations d'identification sont incorrectes.
        
        const accessToken = jwt.sign( // est utilisé pour créer un JSON Web Token (JWT) contenant des informations spécifiques sur l'utilisateur, telles que son identifiant (_id) et son statut d'administrateur (isAdmin)
        {
            id:user._id, isAdmin: user.isAdmin, //Le premier argument est le payload, qui est un objet JavaScript contenant les informations que vous souhaitez inclure dans le JWT. Dans cet exemple, le payload contient l'identifiant de l'utilisateur (user._id) et son statut d'administrateur (user.isAdmin).
        }, 
        process.env.JWT_SEC, // Le deuxième argument est la clé secrète (process.env.JWT_SEC) utilisée pour signer le JWT. Cette clé secrète est utilisée pour générer une signature unique pour le token, garantissant ainsi son authenticité et son intégrité.
        {expiresIn: "3d"} //Le troisième argument est un objet d'options facultatif, dans lequel vous pouvez spécifier des paramètres supplémentaires pour le JWT. Dans cet exemple, expiresIn: "3d" indique que le JWT expirera après 3 jours.
        );

        const { password, ...others } = user._doc; // est une façon de filtrer les détails d'un utilisateur pour ne montrer que certaines informations spécifiques et exclure celles que vous souhaitez garder privées ou confidentielles. Cela permet de garantir que seules les informations appropriées sont partagées en fonction des besoins de votre application ou de votre service.
        // En résumé, ce code génère un JWT contenant les informations spécifiques de l'utilisateur, exclut le mot de passe de la réponse JSON et renvoie à la fois les informations filtrées de l'utilisateur et le JWT en réponse à la demande de connexion réussie.
        res.status(200).json({...others, accessToken}); //Si les informations d'identification sont correctes, le serveur renvoie une réponse JSON avec un statut 200 (OK) et les informations de l'utilisateur. Cela peut inclure des détails tels que le nom d'utilisateur, l'e-mail, etc.
    }
    catch (err) {
    res.status(500).json(err); //Si une erreur se produit lors de l'exécution de cette fonction (par exemple, une erreur de base de données), le serveur renvoie une réponse JSON avec un statut 500 (Internal Server Error) et le message d'erreur.
    }
});


module.exports = router;