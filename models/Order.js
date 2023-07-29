/*  le modèle "Order" permet à l'application de suivre et de gérer les commandes passées par les utilisateurs, ce qui facilite la communication entre l'application et ses clients en fournissant des informations sur leurs commandes passées. */


const mongoose = require("mongoose"); /* importe le module Mongoose dans votre application Node.js. Mongoose est une bibliothèque Node.js qui facilite l'interaction avec une base de données MongoDB, une base de données NoSQL très populaire. le module Mongoose facilite l'utilisation de la base de données MongoDB dans votre application Node.js. Il fournit une interface plus simple et plus structurée pour interagir avec MongoDB, ce qui permet de gérer les données de manière plus efficace et organisée. */

const OrderSchema = new mongoose.Schema(
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
        amount: {type: Number, required: true }, // C'est un nombre (Number) représentant le montant total de la commande. Cette propriété est requise (required: true) car chaque commande doit avoir un montant associé.
        address: {type: String, required: true}, // C'est un objet représentant l'adresse de livraison de la commande. Cette propriété est requise (required: true) car chaque commande doit avoir une adresse de livraison.
        status: {type: String, default: "pending"}, // C'est une chaîne de caractères (String) qui représente l'état de la commande. Par défaut, l'état de la commande est défini comme "pending" (en attente). Le statut de la commande peut être mis à jour en fonction de son état de traitement (par exemple, "processing", "shipped", "delivered", etc.).
       
    },
    { timestamps: true } /*  est une option spéciale dans Mongoose qui permet d'ajouter automatiquement des horodatages aux documents créés et mis à jour dans la base de données. */

);


module.exports = mongoose.model("Order", OrderSchema); 