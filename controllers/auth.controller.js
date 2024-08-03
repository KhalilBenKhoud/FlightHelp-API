const jwt = require('jsonwebtoken') ;
const User = require('../models/User');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const testAuth = (req,res,next) => {
    res.json({message : 'auth works'})
}

const register = async (req,res,next) => {
    try {
      const {tunisairId , fullname , email , password} = req.body ;
      if(!tunisairId || !fullname || !email || !password) return res.status(400).json({message : 'Veuillez remplir tous les champs !'})
      const duplicate = await User.findOne({email}).exec() ;
      if(duplicate) return res.status(409).json({message : "Un autre utilisateur avec cet e-mail existe. Si c'est le vôtre, veuillez vous connecter"})
      const hashedPassword = await bcrypt.hash(password,10) ;
      const created = await User.create({tunisairId, fullname , email , password : hashedPassword }) ;
      const accessToken = jwt.sign({ _id : created._id , role : created.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '10m'}) ;
      const refreshToken = jwt.sign({_id : created._id , refreshTokenVersion : created.refreshTokenVersion} , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'}) ;
      res.cookie('jwt', refreshToken , {httpOnly : true, sameSite : 'None' , secure : true , maxAge : 7 * 24 * 60 *60 * 1000 })
      res.status(201).json({message : `L'utilisateur ${created.fullname} a été inscrit`, accessToken})

    }catch(error) {
        next(error)
    }
}


const login = async(req,res,next) => {
    try {
      const {email , password} = req.body ; 
      if(!email || !password ) return res.status(400).json({message : 'Veuillez remplir tous les champs !'}) ;
      const found = await User.findOne({email}).exec() ;
      if(!found) return res.status(400).json({message : 'Identifiants invalides !'}) ;
      const match = await bcrypt.compare(password, found.password) ;
      if(!match) {
        return res.status(400).json({message : 'Identifiants invalides !'}) ;
      }

      const accessToken = jwt.sign({ _id : found._id , role : found.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '10m'}) ;
      const refreshToken = jwt.sign({_id : found._id , refreshTokenVersion : found.refreshTokenVersion} , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'}) ;
      res.cookie('jwt', refreshToken , {httpOnly : true, sameSite : 'None' , secure : true , maxAge : 7 * 24 * 60 *60 * 1000 })
       res.status(200).json({message : 'vous étes connectés !',accessToken})
    }catch(err) {
        next(err) ;
    }
}


const handleRefreshToken = async (req,res,next) => {
    const token = req.cookies?.jwt ;
    if(!token) return res.sendStatus(401) ;
    const payload = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET) ;
    const found = await User.findOne({_id : payload._id, refreshTokenVersion : payload.refreshTokenVersion}) ;
    if(!found) res.sendStatus(403) ;
    found.refreshTokenVersion = found.refreshTokenVersion + 1 ;
    await found.save() ;
    
    const accessToken = jwt.sign({ _id : found._id , role : found.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '10m'}) ;
    const refreshToken = jwt.sign({_id : found._id , refreshTokenVersion : found.refreshTokenVersion} , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'}) ;
    res.cookie('jwt', refreshToken , {httpOnly : true, sameSite : 'None' , secure : true , maxAge : 7 * 24 * 60 *60 * 1000 })
    res.status(200).json({message : "you got new tokens",accessToken})
}

const logout = async (req,res,next) => {
    try {
    const token = req.cookies?.jwt ;
    if(!token) return res.status(401).json({message : 'problem here'}) ;
    const payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET) ;
    const found = await User.findOne({_id : payload._id, refreshTokenVersion : payload.refreshTokenVersion}).exec() ;
    if(!found) return res.sendStatus(403) ;
    found.refreshTokenVersion = found.refreshTokenVersion + 1 ;
    await found.save() ;

    res.clearCookie('jwt', { httpOnly : true , sameSite : 'None' , secure : true  })
    res.sendStatus(204) ;

    }catch(err) {
        console.error(error) ;
        next(err) ;
    }
}

const forgetPassword = async (req,res,next) => {
    try {
       const {email} = req.body ;
       const found = await User.findOne({email}).exec() ;
       if(!found) return res.status(404).json({message : 'cet e-mail ne correspond à aucun utilisateur ! '}) ;
       const token = crypto.randomBytes(6).toString('hex') ;
       found.resetToken.token = token ;
       found.resetToken.createdAt = Date.now() ;
       await found.save() ;

       const transporter = nodemailer.createTransport({
        service : 'gmail' ,
        auth : {
            user : process.env.EMAIL_SENDER ,
            pass : process.env.EMAIL_PASSWORD
        }
       })

       const mailOptions = {
        from : process.env.EMAIL_SENDER,
        to : email,
        subject : 'FlightHelp - Password Reset',
        html: `<div style='box-shadow: rgba(0, 0, 0, 0.75) 5px 5px 15px; padding: 20px;' > 
        
        <div style='width : 100% ;  gap : 20px ; justify-content : center; display : flex ;'>
        <h1 style='color : red ;'>FlightHelp à votre service</h1>
        <img src='https://i0.wp.com/lapresse.tn/wp-content/uploads/2021/08/tunisair.jpg?fit=850%2C491&ssl=1' alt='tunisair logo' style='width : 200px; height : 100px ;' />
        </div>
        
        <p style='font-wight : 800;'>Votre code de vérification pour réinitialiser votre mot de passe est <b style='color : midnightblue;'>${token}</b> (valide pendant 5 minutes). Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet e-mail.</p>
        
        </div>  
        `,
       }

       transporter.sendMail(mailOptions , (error,info) => {
          if(error) {
            res.status(500).json({message : "problème lors du l'envoi de l'email"})
          }
          else {
              res.status(200).json({message : 'Vérifiez votre e-mail pour les instructions de réinitialisation de votre mot de passe!'})
          }
       })
    }catch(err) {
        next(err)
    }
}

const verifyToken = async (req,res,next) => {
    try {
        const {token} = req.body ;
        if(!token) return res.sendStatus(404) ;
        const found = await User.findOne({'resetToken.token' : token}).exec() ;
        if(!found || ( Date.now() - found.resetToken.createdAt) / 1000 / 60 > 5)
        res.status(409).json({message : 'code invalide ou expiré !'}) ;
        else res.status(200).json({message : 'Procédez au changement de votre mot de passe !'})

    }catch(err) {
        next(err) ;
    }
}

const resetPassword = async (req,res,next) => {
    try {
      const { token , newPassword } = req.body ;
      if(!token || !newPassword) return res.status(404).json({ message : 'veuillez saisir votre nouveau mot de passe'}) ;
      const found = await User.findOne({'resetToken.token' : token}).exec() ;
      if(!found) return res.sendStatus(409) ;
      const hashed = await bcrypt.hash(newPassword,10) ;
      found.password = hashed ;
      await found.save() ;
      res.status(200).json({message : 'votre mot de passe a été changé !'})

    } catch(err) {
        next(err)
    }
}


module.exports = {testAuth , register, login , handleRefreshToken , logout , forgetPassword , resetPassword , verifyToken}