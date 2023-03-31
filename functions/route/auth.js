const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
const Token = require("../models/token")
const sendEmail = require("../utli/sendEamil")
// const crypto = require("crypto")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "storytechpaartnersltd@gmail.com",
    pass: "Gr8king-live",
  },
});
//REGISTER
router.post("/signup" , async (req, res) => {
  
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      idNumber: req.body.idNumber,
      password: hashedPassword,
    });

    const user = await newUser.save();
    
    // const verificationCode = generateVerificationCode(); // implement your own verification code generator
    // const { email } = req.body;
    // const mailOptions = {
    //   from: "story.gmail.com",
    //   to: email,
    //   subject: "Email verification code",
    //   text: `Your email verification code is: ${verificationCode}`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).send("Error sending email");
    //   } else {
    //     console.log(`Email sent: ${info.response}`);
    //     res.status(200).send("Email sent successfully");
    //   }
    // });
    

    res.status(200).send("Account has bee created");
  }catch(err){
     res.status(500).json(err);
  }
  
});

router.post("/send-verification-email", (req, res) => {
  const { userId ,email } = req.body;
  const token = jwt.sign({ userId }, "vksdndosdfnvi24t8349tuen984", { expiresIn: "1h" });
  // const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" });

  let mailOptions = {
    //email must be will verfi
    from: "storytechpaartnersltd@gmail.com",
    to: email,
    subject: "Verify your email address",
    html: `
      <p>Hello,</p>
      <p>Please click the following link to verify your email address:</p>
      <a href="http://localhost:3000/verify-email/${token}">Verify email address</a>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log(`Email sent: ${info.response}`);
      res.status(200).send("Email sent successfully");
    }
  });
});
//get verfi
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { userId } = jwt.verify(req.params.token, "your_secret_key");
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).send("Invalid token");
    }

    user.verified = true;
    await user.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying email");
  }
});
//Login
router.post("/login", async (req,res)=>{
  try{
     const user = await User.findOne({ email: req.body.email });
     !user && res.status(404).send("user not found");

     const validPassword = await bcrypt.compare(req.body.password, user.password)
     !validPassword && res.status(400).json("wrong password")

    //  if (!user.verified) {
    //   let token = await Token.findOne({user: user._id})
    //   if(!token) {
    //     token = await new Token({
    //       userId: user._id,
    //       token: crypto.randomBytes(32).toString("hax"),
    //     }).save();
    //     const url = `${process.env.BASS_URL}users/${user._id}/verify/${token.token}`;
    //     await sendEmail(user.email, "Verify Email", url);
    //   }
    //   return res.status(400).send({message: "An Email has been sent to your account please verify"})
    //  }
    // req.session.user = res.body.email
     res.status(200).json(user)
  }catch(err){
    res.status(500).json(err)
  }
})
router.get('/logout', (req, res)=> {
  try{
    req.session.destroy((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Account has been logout");
      }
    });
  }catch(err){
    console.log(err)
  }
  
})
module.exports = router;
