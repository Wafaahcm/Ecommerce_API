const express = require("express");/* importer le module Express dans votre application Node.js. Cela permet d'utiliser les fonctionnalités fournies par le module Express pour créer un serveur Web et gérer les requêtes HTTP. */
const app = express(); /* est l'étape cruciale pour commencer à construire votre application Express. À partir de cette instance app, vous pouvez ajouter des routes, des middlewares et configurer d'autres fonctionnalités nécessaires pour construire une application Web fonctionnelle. */

const userRoute = require("./routes/user"); /* ce code  importe un module ou un fichier contenant les routes relatives aux utilisateurs de votre application. */

const authRoute = require("./routes/auth"); // charger les routes liées à l'authentification (connexion, inscription, etc.) dans la variable authRoute, afin de pouvoir les utiliser dans l'application.

const productRoute = require("./routes/product"); 
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const mongoose = require('mongoose'); /* est utilisé pour importer Mongoose dans votre application Node.js, vous permettant ainsi d'interagir avec MongoDB en utilisant des schémas et des modèles JavaScript, ce qui facilite la gestion de votre base de données dans votre application. */

const dotenv = require("dotenv"); // importez dotenv

dotenv.config(); // pour charger les variables d'environnement à partir du fichier .env :

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connection Successfull!"))
.catch((err)=>{console.log(err)});/* cette ligne de code est utilisée pour établir une connexion à votre base de données MongoDB hébergée sur MongoDB Atlas en utilisant Mongoose. */

app.use(express.json());  /* est une instruction pour ajouter un middleware dans votre application Express.js. Ce middleware permet à votre application de comprendre et d'analyser le corps des requêtes entrantes au format JSON. */

app.use("/api/auth", authRoute); // vous pouvez organiser vos routes de manière modulaire en regroupant toutes les routes d'authentification sous "/api/auth".

app.use("/api/users", userRoute); /* est utilisé pour monter les routes relatives aux utilisateurs (userRoute) sur le chemin /api/user dans votre application Express.js, ce qui facilite l'organisation des routes et permet de gérer différentes fonctionnalités à des emplacements spécifiques de votre API. */

app.use("/api/products", productRoute); 
app.use("/api/carts", cartRoute); 
app.use("/api/orders", orderRoute); 

app.listen(process.env.PORT || 5000, ()=>{
    console.log('backend server is running');
}); /* cette ligne de code permet de démarrer le serveur Express et de l'écouter sur le port spécifié par PORT dans les variables d'environnement (le cas échéant), ou sur le port 5000 si PORT n'est pas définie. */