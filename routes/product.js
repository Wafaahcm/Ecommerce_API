

const Product = require("../models/Product");

const router = require("express").Router(); // la définition ou la créations d'un routeur  pour gérer les routes liées aux utilisateurs.

const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res)=>{ // permet à l'administrateur d'ajouter un nouveau produit à la base de données. Voici comment cela fonctionne :
    const newProduct = new Product(req.body); // Cette ligne crée une nouvelle instance de modèle Product en utilisant les données fournies dans le corps de la requête (req.body). Le modèle Product est une représentation de la structure des documents dans la collection "products" de la base de données.

    try{
        const savedProduct = await newProduct.save(); // Cette ligne enregistre le nouveau produit dans la base de données en utilisant la méthode save() de Mongoose. Le produit est enregistré en tant que document dans la collection "products" de la base de données.
        res.status(200).json(savedProduct); // Si le produit est enregistré avec succès dans la base de données, le serveur renvoie une réponse JSON avec un statut 200 (OK) contenant le produit enregistré sous forme d'objet JSON. Le produit enregistré peut inclure un nouvel ID généré automatiquement par la base de données.
    }catch(err) {
       res.status(500).json(err); // En cas d'erreur lors de l'enregistrement du produit, le serveur renverra une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
    }
});


// UPDATE

 router.put("/:id", verifyTokenAndAuthorization, async (req, res) => { //  Cette ligne définit la route pour les requêtes de type PUT vers l'URL "/:id". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la mise à jour du produit.
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate( // Cette ligne utilise la méthode findByIdAndUpdate() de Mongoose pour effectuer la mise à jour du produit dans la base de données. La méthode reçoit trois arguments : l'ID du produit à mettre à jour (obtenu à partir de req.params.id qui correspond à la valeur spécifiée dans l'URL de l'endpoint), l'objet des champs à mettre à jour (obtenu à partir du corps de la requête grâce à req.body), et une option { new: true } qui spécifie de renvoyer le document mis à jour.
        req.params.id, //  correspond à la valeur spécifiée dans l'URL de l'endpoint
        {
          $set: req.body, //on utilise l'opérateur $set pour indiquer à MongoDB de ne mettre à jour que les champs spécifiés dans req.body, tout en laissant les autres champs inchangés.
        },
        { new: true } //qui spécifie de renvoyer le document mis à jour.
      );

      res.status(200).json(updatedProduct); // Une fois que le produit est mis à jour avec succès dans la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant le document du produit mis à jour.
    } catch (err) {
        console.error(err);
      res.status(500).json(err); // Si une erreur se produit lors de la mise à jour du produit (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
    }
  });
  

// DELETE
// Le code que vous avez fourni définit une route pour les requêtes de type DELETE vers l'URL "/:id", où ":id" est le paramètre d'URL qui permet d'identifier le produit spécifique à supprimer. Le middleware "verifyTokenAndAuthorization" est utilisé ici pour vérifier à la fois l'authenticité du JWT et l'autorisation de l'utilisateur avant de permettre la suppression du produit.

router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{  // Cette ligne définit la route pour les requêtes de type DELETE vers l'URL "/:id". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la suppression du produit.
  try {
    await Product.findByIdAndDelete(req.params.id) // Cette ligne utilise la méthode findByIdAndDelete() de Mongoose pour supprimer le produit de la base de données. La méthode reçoit l'ID du produit à supprimer (obtenu à partir de req.params.id qui correspond à la valeur spécifiée dans l'URL de l'endpoint).
    res.status(200).json("Product has been deleted") // Une fois que le produit est supprimé avec succès de la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant le message "Product has been deleted".
  }catch(err) {
    res.status(500).json(err) // Si une erreur se produit lors de la suppression du produit (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
  }
})

// GET PRODUCT
// Le code que vous avez fourni définit une route pour les requêtes de type GET vers l'URL "/find/:id", où ":id" est le paramètre d'URL qui permet d'identifier le produit spécifique à récupérer. Cette route permet de récupérer les informations détaillées d'un produit à partir de la base de données en utilisant son ID.

router.get("/find/:id", async (req, res)=>{ // Cette ligne définit la route pour les requêtes de type GET vers l'URL "/find/:id". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la récupération des informations du produit.
  try {
    const product = await Product.findById(req.params.id); //Cette ligne utilise la méthode findById() de Mongoose pour rechercher le produit dans la base de données en utilisant son ID. La méthode reçoit l'ID du produit à récupérer (obtenu à partir de req.params.id qui correspond à la valeur spécifiée dans l'URL de l'endpoint).
    res.status(200).json( product ); // Une fois que le produit est récupéré avec succès de la base de données, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant les informations détaillées du produit.
  }catch(err) {
    res.status(500).json(err) // Si une erreur se produit lors de la recherche du produit (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
  }
})


// GET ALL PRODUCTS
// Ce code définit une route pour les requêtes de type GET vers l'URL "/". Cette route permet de récupérer des produits à partir de la base de données en fonction des paramètres de requête (query parameters) fournis dans l'URL.


router.get("/", async (req, res)=>{ //  Cette ligne définit la route pour les requêtes de type GET vers l'URL "/". Lorsque cette route est appelée, elle exécute la fonction asynchrone (async) pour gérer la récupération des produits.
  const qNew = req.query.new; // Cette ligne récupère le paramètre de requête "new" de l'URL. Si le paramètre "new" est présent dans l'URL, cela signifie que l'utilisateur souhaite récupérer les produits les plus récents.
  const qCategory = req.query.category; // Cette ligne récupère le paramètre de requête "category" de l'URL. Si le paramètre "category" est présent dans l'URL, cela signifie que l'utilisateur souhaite récupérer les produits d'une catégorie spécifique.
  try {
    let products; //  Cette ligne déclare une variable "products" qui sera utilisée pour stocker les produits récupérés à partir de la base de données.

    if(qNew){ //  Cette condition vérifie si le paramètre de requête "new" est présent dans l'URL. Si c'est le cas, cela signifie que l'utilisateur souhaite récupérer les produits les plus récents.
        products = await Product.find().sort({createdAt: -1}).limit(1); //  Dans ce cas, la variable "products" est mise à jour en utilisant la méthode Product.find().sort({ createdAt: -1 }).limit(5); qui permet de rechercher les produits dans la base de données, de les trier par date de création décroissante (les plus récents d'abord) et de limiter les résultats à 5 produits.
    } else if(qCategory){ // Cette condition vérifie si le paramètre de requête "category" est présent dans l'URL. Si c'est le cas, cela signifie que l'utilisateur souhaite récupérer les produits d'une catégorie spécifique. 
        products = await Product.find({ // Dans ce cas, la variable "products" est mise à jour en utilisant la méthode Product.find({ categories: { $in: [qCategory] } }); qui permet de rechercher les produits dans la base de données en filtrant ceux qui appartiennent à la catégorie spécifiée par "qCategory"
            categories: {
                $in: [qCategory], // permet de rechercher les produits dans la base de données en filtrant ceux qui appartiennent à la catégorie spécifiée par "qCategory".
            },
        });
    } else { // Si aucun des paramètres de requête "new" ou "category" n'est présent dans l'URL, cela signifie que l'utilisateur souhaite récupérer tous les produits.
        products = await Product.find(); // Dans ce cas, la variable "products" est mise à jour en utilisant la méthode Product.find(); qui permet de rechercher tous les produits dans la base de données.
    }

    res.status(200).json(products); // Une fois que les produits sont récupérés avec succès de la base de données en fonction des paramètres de requête, le serveur envoie une réponse JSON avec un statut 200 (OK) contenant les produits récupérés.
  }catch(err) {
    res.status(500).json(err); //Si une erreur se produit lors de la recherche des produits (par exemple, une erreur de base de données), le serveur envoie une réponse JSON avec un statut 500 (Internal Server Error) contenant le message d'erreur.
    
  }
});



module.exports = router; //  est utilisé pour exporter le routeur défini dans ce module (fichier) afin qu'il puisse être utilisé dans d'autres parties de votre application.
