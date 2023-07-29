const router = require("express").Router(); // Cela importe et crée un routeur Express pour gérer les routes liées aux paiements.
const stripe = require("stripe")(process.env.STRIPE_KEY); //  Cela importe la bibliothèque Stripe et initialise la connexion à l'API Stripe en utilisant la clé secrète qui est stockée dans la variable d'environnement STRIPE_KEY. La clé secrète est utilisée pour authentifier votre application auprès de l'API Stripe et lui permettre d'effectuer des opérations telles que la création de paiements.

router.post("/payment", (req, res)=> { // Cela définit une route POST pour l'URL "/payment". Lorsque cette route est appelée, elle exécute la fonction de gestion du paiement.
    stripe.charges.create({            // Cela utilise la bibliothèque Stripe pour créer un nouveau paiement (charge). Vous envoyez les détails du paiement à l'API Stripe en utilisant la méthode stripe.charges.create.
        source: req.body.tokenId,
        amount: req.body.amount,       //  Les détails du paiement sont extraits à partir du corps de la requête (req.body), qui doit contenir le token d'identification de la source de paiement (tokenId), le montant du paiement (amount), et la devise (currency, ici "usd" pour dollar américain).
        currency: "usd",
    }, (stripeErr, stripeRes)=> {      // C'est une fonction de rappel (callback) qui est exécutée après que Stripe ait traité la demande de paiement. 
          if(stripeErr){               // Si une erreur se produit lors du traitement du paiement, elle est capturée dans stripeErr
              res.status(500).json(stripeErr);    // une réponse avec un statut 500 (Internal Server Error) est renvoyée au client, contenant l'erreur Stripe. Si le paiement est réussi, la réponse de Stripe est renvoyée au client avec un statut 200 (OK).
          }else{
              res.status(200).json(stripeRes);    // La réponse au client est envoyée en utilisant les méthodes res.status().json() en fonction du résultat de la création du paiement.
          }
    })
})















module.exports = router;