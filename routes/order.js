

const Order = require("../models/Order");

const router = require("express").Router(); // la définition ou la créations d'un routeur  pour gérer les routes liées aux utilisateurs.

const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");

// CREATE

// Ce code définit une route pour les requêtes de type POST vers l'URL "/". Cette route permet de créer un nouveau panier (cart) dans la base de données.

router.post("/", verifyToken, async (req, res)=>{ //  Cette ligne définit la route pour les requêtes de type POST vers l'URL "/". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour créer un nouveau panier.
    const newOrder = new Order(req.body); // Cette ligne crée une nouvelle instance de modèle Order en utilisant les données fournies dans le corps de la requête (req.body). Le corps de la requête contient les informations nécessaires pour créer la commande , telles que les produits ajoutés, les quantités, etc.
    
    try{  //  Le code à l'intérieur du bloc try-catch est utilisé pour gérer les erreurs potentielles qui pourraient se produire lors de la création du panier.
        
        const savedOrder = await newOrder.save(); // Cette ligne de code enregistre la nouvelle commande (objet newOrder) dans la base de données en utilisant la méthode asynchrone save() du modèle Order. Une fois que cette ligne est exécutée avec succès, la commande est enregistrée dans la collection "orders" de la base de données avec toutes les informations spécifiées dans l'objet newOrder.

        res.status(200).json(savedOrder); // Une fois que le panier est enregistré avec succès dans la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant le panier enregistré. Le panier est renvoyé au format JSON en réponse.
    }catch(err) {
       res.status(500).json(err); // Si une erreur se produit lors de la création du panier (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur. 
    }
});


// UPDATE
// Le code que vous avez fourni définit une route pour les requêtes de type PUT vers l'URL "/:id". Cette route permet de mettre à jour un panier existant dans la base de données.

 router.put("/:id", verifyTokenAndAdmin, async (req, res) => { //=> { ... }): Cette ligne définit la route pour les requêtes de type PUT vers l'URL "/:id". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la mise à jour du panier.
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate( // Cette ligne utilise la méthode findByIdAndUpdate() de Mongoose pour effectuer la mise à jour du produit dans la base de données. La méthode reçoit trois arguments : l'ID du produit à mettre à jour (obtenu à partir de req.params.id qui correspond à la valeur spécifiée dans l'URL de l'endpoint), l'objet des champs à mettre à jour (obtenu à partir du corps de la requête grâce à req.body), et une option { new: true } qui spécifie de renvoyer le document mis à jour.
        req.params.id, //  Cette valeur correspond à l'ID du panier spécifié dans l'URL de l'endpoint. Cela permet d'identifier le panier spécifique que vous souhaitez mettre à jour dans la base de données.
        {
          $set: req.body, // On utilise l'opérateur $set pour indiquer à MongoDB de ne mettre à jour que les champs spécifiés dans req.body, tout en laissant les autres champs inchangés. Le corps de la requête (req.body) contient les nouvelles valeurs que vous souhaitez mettre à jour pour le panier.
        },
        { new: true } //qui spécifie de renvoyer le document mis à jour.
      );

      res.status(200).json(updatedOrder); // Une fois que le produit est mis à jour avec succès dans la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant le document du produit mis à jour.
    } catch (err) {
        console.error(err);
      res.status(500).json(err); // Si une erreur se produit lors de la mise à jour du produit (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
    }
  });
  

// DELETE
// Le code que vous avez fourni définit une route pour les requêtes de type DELETE vers l'URL "/:id", où ":id" est le paramètre d'URL qui permet d'identifier le produit spécifique à supprimer. Le middleware "verifyTokenAndAuthorization" est utilisé ici pour vérifier à la fois l'authenticité du JWT et l'autorisation de l'utilisateur avant de permettre la suppression du produit.

router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{  // Cette ligne définit la route pour les requêtes de type DELETE vers l'URL "/:id". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la suppression du produit.
  try {
    await Order.findByIdAndDelete(req.params.id) // Cette ligne utilise la méthode findByIdAndDelete() de Mongoose pour supprimer le produit de la base de données. La méthode reçoit l'ID du produit à supprimer (obtenu à partir de req.params.id qui correspond à la valeur spécifiée dans l'URL de l'endpoint).
    res.status(200).json("Order has been deleted") // Une fois que le produit est supprimé avec succès de la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant le message "Product has been deleted".
  }catch(err) {
    res.status(500).json(err) // Si une erreur se produit lors de la suppression du produit (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
  }
});

// GET USER ORDERS

router.get("/find/:userId", async (req, res)=>{ // Cette ligne définit la route pour les requêtes de type GET vers l'URL "/find/:id". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la récupération des informations du produit.
  try {
    const orders = await Order.find({ userId: req.params.userId }); //Cette ligne utilise la méthode findOne() de Mongoose pour rechercher le panier dans la base de données en utilisant l'ID de l'utilisateur (userId). L'ID de l'utilisateur est obtenu à partir de req.params.userId, qui correspond à la valeur spécifiée dans l'URL de l'endpoint.
    res.status(200).json( orders ); // Une fois que le produit est récupéré avec succès de la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant les informations détaillées du produit.
  }catch(err) {
    res.status(500).json(err) // Si une erreur se produit lors de la recherche du produit (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
  }
});


// GET ALL ORDERS
// Le code que vous avez fourni définit une route pour les requêtes de type GET vers l'URL "/". Cette route permet de récupérer tous les paniers présents dans la base de données, mais elle nécessite également que l'utilisateur soit un administrateur, vérifié à l'aide du middleware verifyTokenAndAdmin.
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
  try {
      const orders = await Order.find(); // : Cette ligne utilise la méthode find() de Mongoose pour récupérer tous les paniers présents dans la base de données.
      res.status(200).json(orders); // Une fois que les paniers sont récupérés avec succès de la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant un tableau d'objets, où chaque objet représente un panier.
  }catch(err) {
     res.status(500).json(err);
  }
}); // En résumé, ce code permet de récupérer tous les paniers présents dans la base de données et de les renvoyer sous forme de réponse JSON. Cependant, pour accéder à cette route, l'utilisateur doit être un administrateur, ce qui est vérifié à l'aide du middleware verifyTokenAndAdmin. Si l'utilisateur n'est pas un administrateur, il recevra une réponse JSON avec un statut d'erreur 403 (Forbidden) indiquant qu'il n'est pas autorisé à effectuer cette action.



// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;