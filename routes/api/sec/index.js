const express = require("express");
let router = express.Router();
const jwt = require("jsonwebtoken");
const mailerSender = require("../../../utils/mailer");
let SecModelClass = require('./sec.model.js');
let SecModel = new SecModelClass();
const {v4: uuidv4, v4} = require('uuid');

router.post('/login', async (req, res, next)=>{
  try {
    const {email, pswd} = req.body;
    //Validar los datos
    let userLogged = await SecModel.getByEmail(email);
    if (userLogged) {
      const isPswdOk = await SecModel.comparePassword(pswd, userLogged.password);
      if (isPswdOk) {
        // podemos validar la vigencia de la contraseña
        delete userLogged.password;
        delete userLogged.oldpasswords;
        delete userLogged.lastlogin;
        delete userLogged.lastpasswordchange;
        delete userLogged.passwordexpires;
        let payload = {
          jwt: jwt.sign(
            {
              email: userLogged.email,
              _id: userLogged._id,
              roles: userLogged.roles
            },
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
          ),
          user: userLogged
        };
        return res.status(200).json(payload);
      }
    }
    console.log({email, userLogged});
    return res.status(400).json({msg: "Credenciales no son Válidas"});
  }catch (ex){
    console.log(ex);
    res.status(500).json({"msg":"Error"});
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    const {email, pswd} = req.body;
    let userAdded = await SecModel.createNewUser(email, pswd);
    delete userAdded.password;
    console.log(userAdded);
    res.status(200).json({"msg":"Usuario Creado Satisfactoriamente"});
  } catch (ex) {
    res.status(500).json({ "msg": "Error" });
  }
});

router.post('/passrecovery', async (req, res, next)=>{
 try  {
   const {email} = req.body;
   let uniqueId = v4();
   let insertUId = await SecModel.insertUuid(email, uniqueId);

   console.log(insertUId);
   mailSender(
     email,
     "NoReply",
     `<a> href="http://localhost:3000/api/sec/user/resetpsw/${uniqueId}">Haga clic para recuperar contraseña</a>`
   )
   res.status(200).json({"msg":"Email enviado"});
 }catch (error){
   res.status(500).json({"msg":"Error" +error});
 }
});

router.put('/resetpsw/:id', async(req, res)=>{
  try {
    const {id}=req.params;
    const {newPsw} = req.body;
    const updatePsw = await SecModel.changePassword(id, newPsw);
    console.log(updatePsw);
    console.log("Constraseña actualizada.");
    res.status(200).json({"msg":"Exito al actualizar la contraseña"});
  } catch (error) {
    res.status(500).json({"msg":"Error en cambio de contraseña"+ error});
  }
});

module.exports = router;
