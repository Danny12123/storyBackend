const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/token");
const multer = require("multer");
const sendEmail = require("../utli/sendEamil");
// const crypto = require("crypto");
// const {  validate } = require("../models/User");





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// const upload = multer({ dest: 'public/profile/' });
const upload = multer({
  storage: storage
})

//updateUser
router.put("/:id", async(req, res)=> {
  const userId = req.query.userId;
  const username = req.query.username;
    if(req.body.userId === req.params.id){
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err)
            }
        }
       

        try {
          const user = userId
            ? await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            : await User.findOne(req.params.id, { $set: req.body });
            // const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body});
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err);
        }
        // try {
        //     const user = userId
        //       ? await User.findByIdAndUpdate(req.params.id, { $set: {profilePicture: req.body} })
        //       : await User.findOne(req.params.id, { $set: req.body });
        //     // const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body});
        //     res.status(200).json("Account has been updated");
        // }catch (err) {
        //   return res.status(500).json(err);
        // }
    }else{
        return res.status(403).json("You can update only your account")
    }
})


// Update user by _id field and set profilePicture
router.post('/usersprofile/:id/profilePicture', upload.single('profilePicture'), (req, res) => {
  User.findByIdAndUpdate({_id: req.params.id}, {profilePicture: req.file.filename}, {new: true})
    .then(updatedUser => {
      // res.send(updatedUser);
      res.status(200).json("Account has been updated");
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
});
// Update user by _id field and set coverPicture
router.post('/userscover/:id/coverPicture', upload.single('coverPicture'), (req, res) => {
  
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { coverPicture: req.file.filename },
    { new: true }
  )
    .then((updatedUser) => {
      // res.send(updatedUser);
      res.status(200).json("coverPicture has been updated");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
});


//deleteUser

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id ) {
    
    try {
      const user = await User.findByIdAndDelete({_id: req.params.id});
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});


//get a user
router.get("/", async (req, res)=>{
    const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/search", async (req, res, next) => {
  // try {
    const searchQuery = req.query.q;
    // const user = await User.find({
    //   title: { $regex: query, $options: "i" },
    // }).limit(40);/
    const user = await User.find({
      username: { $regex: searchQuery, $options: "i" },
    });
    // res.json(users);
    res.status(200).json(user);
  // } catch (err) {
  //   next(err);
  // }
});
// export const search = async (req, res, next) => {
//     const query = req.query.q
//     try {
//         const videos = await Video.find({title: {$regex: query, $options: "i"}}).limit(40);
//         res.status(200).json(videos);
//     } catch (err) {
//       next(err);
//     }
// }
router.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging out");
    } else {
      // res.clearCookie("connect.sid");
      res.sendStatus(200);
    }
  });
});


module.exports = router