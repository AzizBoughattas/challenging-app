const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const admin = require('../middleware/admin')
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth')
const sendEmail = require("../email/email");
const Joi = require('joi')
const multer = require('multer')
const sharp = require('sharp')



 const subject = "Password Reset"

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registred");

  user = new User({
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken()

  await user.save();
  res.send({email:user.email,isAdmin:user.isAdmin,nickname:user.nickname,token:token});
});

router.get("/",admin,async(req,res) => {
  const user = await User.find()
  res.send(user)
})
router.get("/me",auth,async(req,res) => {
  const token = req.header("Authorization")
  const payload = jwt.decode(token)
  const user = await User.findOne({ _id :payload._id })
  res.send(user)
})

router.post("/reset",async(req,res) => {
  User.findOne({email:req.body.email}).then(async(user) => {
    if (!user) return res.status(400).send("No Account with that email found");
    const token = jwt.sign({ _id: user._id },process.env.JWT_SECRET,{expiresIn:"3h"});


    const output = `<p>You requested a password reset</p>
<p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password</p> 
`;
 const plainText = `You requested a password reset
 Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password
 `;

    await sendEmail(req.body.email,output,plainText,subject)
    res.send(token)
  }).catch((err) => {
    console.log(err)
  })
})

router.post("/new-password/:token",async(req,res)=> {
  const token =req.params.token
  if (!token) return res.status(401).send("No token provided");
  const newPassword = req.body.password
  const {error} =  validatePassword(req.body)

  if (error) return res.status(400).send(error.details[0].message);


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET,{complete: true});
    const user = await User.findOne({ _id :decoded.payload._id })
    if(!user) {
      throw new Error("Invalid token")
  }

  const result = await bcrypt.compare(req.body.password,user.password)

  if(result) {
    return res.status(400).send("you cant change with the same Password")
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword,salt) 



  user.password=hashPassword
  await user.save()
  res.send("success")

  } catch (error) {
    res.status(400).send("Something went wrong");
  }

})

// const fileStorage = multer.diskStorage({
//   destination:(req,file,cb) => {
//     cb(null,'images')
//   },
//   filename:(req,file,cb) => {
//     cb(null,Date.now()+'-'+ file.originalname)
//   }
// })



const upload = multer({
    limits :{
      fileSize :1000000
  }, 
  fileFilter(req,file,cb) {
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Please upload a jpg,jpeg,png image'))
      }
      cb(undefined,true)
  }
})

router.post('/me/avatar' ,auth, upload.single('image'),async (req,res) => {
  const token = req.header("Authorization")
  const decoded = jwt.decode(token)
  const image = req.file
  if(!image) return res.status(400).send('Please upload an image')
  const user = await User.findOne({ _id :decoded._id })
  console.log(req.file)
  const buffer =await sharp(req.file.buffer).resize({ width:250 , height:250 }).png().toBuffer()

  user.avatar=buffer



  await user.save()
  res.send("success")
}, (error,req,res,next) => {
  res.status(400).send({error : error.message})
})


// const upload = multer({
//   limits :{
//       fileSize :1000000
//   }, 
//   fileFilter(req,file,cb) {
//       if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Please upload a jpg,jpeg,png image'))
//       }
//       cb(undefined,true)
//   }
// })

// router.post('/users/me/avatar' ,auth, upload.single('avatar'),async (req,res) => {
//   const buffer =await sharp(req.file.buffer).resize({ width:250 , height:250 }).png().toBuffer()

//   req.user.avatar =buffer
//   await req.user.save()
//   res.send()
// }, (error,req,res,next) => {
//   res.status(400).send({error : error.message})
// })



router.get('/me/avatar',auth, async (req,res) => {
  const token = req.header("Authorization")
  const decoded = jwt.decode(token)
  const user = await User.findOne({ _id :decoded._id })
  try {
    // if( !user || !user.avatar) {
    //     throw new Error()
    // }
    res.send(user)
} catch (error) {
    res.status(404).send(error)
}
})



function validatePassword(password) {
  const schema = Joi.object({
    password: Joi.string().required().min(5),
  });

  return schema.validate(password);
}





module.exports = router;
