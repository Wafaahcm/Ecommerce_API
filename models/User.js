const mongoose = require("mongoose"); /* importe le module Mongoose dans votre application Node.js. Mongoose est une bibliothèque Node.js qui facilite l'interaction avec une base de données MongoDB, une base de données NoSQL très populaire. le module Mongoose facilite l'utilisation de la base de données MongoDB dans votre application Node.js. Il fournit une interface plus simple et plus structurée pour interagir avec MongoDB, ce qui permet de gérer les données de manière plus efficace et organisée. */

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: {type: String, required: true },
        isAdmin: {
             type: Boolean,
             default: false,
        }, /* ce schéma Mongoose définit la structure des données d'utilisateur avec des champs tels que le nom d'utilisateur, l'adresse e-mail, le mot de passe et le statut d'administrateur. Chaque champ a des propriétés spécifiées, telles que required: true pour les champs obligatoires et unique: true pour les champs qui doivent être uniques dans la base de données. Ces définitions permettent de créer des utilisateurs cohérents et organisés dans la base de données. */

    },
    { timestamps: true } /*  est une option spéciale dans Mongoose qui permet d'ajouter automatiquement des horodatages aux documents créés et mis à jour dans la base de données. */

);


module.exports = mongoose.model("User", UserSchema); /* Le modèle est un constructeur qui nous permettra d'effectuer des opérations sur la collection associée dans la base de données. Le modèle est essentiel pour interagir avec la base de données, comme l'insertion, la recherche, la mise à jour ou la suppression de données.......=> Pour rendre ce modèle utilisable dans d'autres parties de notre application, nous utilisons l'instruction module.exports pour exporter le modèle en tant que module. Cela permet à d'autres fichiers (modules) de notre application d'importer ce modèle et de l'utiliser pour interagir avec la collection "users" dans la base de données. */