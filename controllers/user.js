
async function getAll(req, res, next) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
    console.error(error);
  }
}

async function getOne (req, res, next) {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      }
    });

    if (!user) {
      res.status(401).send('Utilisateur non trouvé');
      return;
      // throw new Error('Utilisateur non trouvé');
    } 
    res.send(user)
  } catch (error) {
    console.log(error);
    next(error);
  }
}


module.exports = {
    getAll,
    getOne,
}

