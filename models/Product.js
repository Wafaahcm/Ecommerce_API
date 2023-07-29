const mongoose = require("mongoose"); /* importe le module Mongoose dans votre application Node.js. Mongoose est une bibliothèque Node.js qui facilite l'interaction avec une base de données MongoDB, une base de données NoSQL très populaire. le module Mongoose facilite l'utilisation de la base de données MongoDB dans votre application Node.js. Il fournit une interface plus simple et plus structurée pour interagir avec MongoDB, ce qui permet de gérer les données de manière plus efficace et organisée. */

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: {type: String, required: true },  /* ce schéma Mongoose définit la structure des données des products avec des champs tels que le nom d'utilisateur, l'adresse e-mail, le mot de passe et le statut d'administrateur. Chaque champ a des propriétés spécifiées, telles que required: true pour les champs obligatoires et unique: true pour les champs qui doivent être uniques dans la base de données. Ces définitions permettent de créer des utilisateurs cohérents et organisés dans la base de données. */
        categories: {type: Array },
        size: {type: String,  },
        color: {type: String,  },
        price: {type: Number, required: true },
    },
    { timestamps: true } /*  est une option spéciale dans Mongoose qui permet d'ajouter automatiquement des horodatages aux documents créés et mis à jour dans la base de données. */

);


module.exports = mongoose.model("Product", ProductSchema); 