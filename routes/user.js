/*  l'API fournit plusieurs URLs (endpoints) qui représentent des actions ou des ressources spécifiques. L'application cliente choisit l'URL appropriée en fonction de ses besoins, puis envoie des requêtes HTTP à cet endpoint pour interagir avec le serveur et accéder aux données ou effectuer des actions spécifiques. L'API traite ensuite ces requêtes et renvoie les réponses correspondantes à l'application cliente. Cela permet une communication structurée et ciblée entre l'application et le serveur via l'API. */

/* router.get("/usertest", (req, res)=>{  le code que vous avez fourni définit une route pour gérer les requêtes GET vers l'URL /usertest. Lorsque cette route est activée, elle envoie une réponse "test is successful" au client qui a effectué la requête. Cela permet à l'application d'avoir un endpoint spécifique pour tester le bon fonctionnement de la route en renvoyant simplement un message de réussite. 
    res.send("test is successful");
}); // ici nous utilisons .get pour tester le fonctionnement de serveur sans avoir besoin de modifier des donnée sur le serveur.

router.post("/userposttest", (req, res)=>{  le code que vous avez fourni définit une route POST qui permet à votre application de recevoir des données JSON envoyées dans le corps de la requête, d'extraire la valeur du champ username, et de l'afficher dans la console du serveur à des fins de vérification. 
    const username = req.body.username;
    res.send("your username is:" + username)
}); */

const User = require("../models/User");

const router = require("express").Router(); // la définition ou la créations d'un routeur  pour gérer les routes liées aux utilisateurs.

const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// UPDATE

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // Vérifier si l'utilisateur connecté a l'autorisation de mettre à jour cet utilisateur
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json("You are not allowed to do that!");
    }
  
    // Vérifier si un nouveau mot de passe est fourni dans le corps de la requête
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json("User not found");
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
      res.status(500).json(err);
    }
  });
  //cette déclaration de route signifie que le serveur est capable de gérer les requêtes PUT envoyées à "/users/:id" pour effectuer des mises à jour sur un utilisateur spécifique, mais avant de le faire, il vérifie l'authenticité et l'autorisation de la requête en utilisant le middleware verifyToken.


// DELETE

// cette route permet de supprimer un utilisateur spécifique de la base de données, mais avant de le faire, elle vérifie l'authenticité et l'autorisation de la requête en utilisant le middleware "verifyTokenAndAuthorization". Cela garantit que seuls les utilisateurs connectés et autorisés peuvent effectuer cette action de suppression.

router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{ // la méthode User.findByIdAndDelete() de Mongoose pour supprimer l'utilisateur de la base de données. La méthode reçoit l'ID de l'utilisateur à supprimer en utilisant req.params.id, qui correspond à la valeur spécifiée dans l'URL de l'endpoint.
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been deleted")
  }catch(err) {
    res.status(500).json(err)
  }
})

// GET USER

router.get("/find/:id", verifyTokenAndAdmin, async (req, res)=>{ // la méthode User.findByIdAndDelete() de Mongoose pour supprimer l'utilisateur de la base de données. La méthode reçoit l'ID de l'utilisateur à supprimer en utilisant req.params.id, qui correspond à la valeur spécifiée dans l'URL de l'endpoint.
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json( others ); //  lorsque l'administrateur effectue une requête pour récupérer les informations d'un utilisateur spécifique à partir de la base de données, il récupère toutes les données de l'utilisateur à l'exception du mot de passe. Le mot de passe est exclu de la réponse pour des raisons de sécurité.
  }catch(err) {
    res.status(500).json(err)
  }
})


// GET ALL USERs

router.get("/", verifyTokenAndAdmin, async (req, res)=>{ // la méthode User.findByIdAndDelete() de Mongoose pour supprimer l'utilisateur de la base de données. La méthode reçoit l'ID de l'utilisateur à supprimer en utilisant req.params.id, qui correspond à la valeur spécifiée dans l'URL de l'endpoint.
  const query = req.query.new;
  try {
    const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
    res.status(200).json(users); //  lorsque l'administrateur effectue une requête pour récupérer les informations d'un utilisateur spécifique à partir de la base de données, il récupère toutes les données de l'utilisateur à l'exception du mot de passe. Le mot de passe est exclu de la réponse pour des raisons de sécurité.
  }catch(err) {
    res.status(500).json(err)
    console.log(err);
  }
})

// GET USER STATS


router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; //  est utilisé pour exporter le routeur défini dans ce module (fichier) afin qu'il puisse être utilisé dans d'autres parties de votre application.
