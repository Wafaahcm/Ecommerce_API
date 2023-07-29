/*const mongoose = require("mongoose");: Cette ligne importe le module Mongoose dans votre application Node.js. Mongoose facilite l'interaction avec une base de données MongoDB, une base de données NoSQL populaire. Il fournit une interface simplifiée pour gérer les données dans MongoDB de manière efficace et organisée.

const CartSchema = new mongoose.Schema({ ... }, { timestamps: true });: Cette partie du code définit le schéma "Cart" pour représenter la structure des données de panier dans l'application. Le schéma a deux propriétés principales : "userId" (représentant l'identifiant de l'utilisateur associé au panier) et "products" (représentant les produits dans le panier). La propriété "products" est un tableau qui contient des objets représentant chaque produit dans le panier. Le schéma est également configuré pour ajouter automatiquement des horodatages (createdAt et updatedAt) aux documents créés et mis à jour.

module.exports = mongoose.model("Cart", CartSchema);: Cette ligne exporte le modèle "Cart" créé à partir du schéma "CartSchema". Le modèle "Cart" est utilisable ailleurs dans votre application pour effectuer des opérations sur la collection "carts" de la base de données, comme la création et la mise à jour de paniers d'utilisateurs.

En utilisant ce schéma et ce modèle, vous pouvez interagir avec la collection "carts" de la base de données MongoDB de manière structurée et facilement maintenable. Vous pouvez créer, mettre à jour, récupérer et supprimer des paniers d'utilisateurs en utilisant le modèle "Cart" créé ici. */


const mongoose = require("mongoose"); /* importe le module Mongoose dans votre application Node.js. Mongoose est une bibliothèque Node.js qui facilite l'interaction avec une base de données MongoDB, une base de données NoSQL très populaire. le module Mongoose facilite l'utilisation de la base de données MongoDB dans votre application Node.js. Il fournit une interface plus simple et plus structurée pour interagir avec MongoDB, ce qui permet de gérer les données de manière plus efficace et organisée. */

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
       
    },
    { timestamps: true } /*  est une option spéciale dans Mongoose qui permet d'ajouter automatiquement des horodatages aux documents créés et mis à jour dans la base de données. */

);


module.exports = mongoose.model("Cart", CartSchema); 