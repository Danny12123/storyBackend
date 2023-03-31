const User = require("../models/User");
const ProfileSet = require("../models/Profile");

const router = require("express").Router();
const multer = require("multer");
// const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname
    );
  },
});
// const upload = multer({ storage: storage }).fields([
//   { name: "profileImage", maxCount: 1 },
//   { name: "coverImage", maxCount: 1 },
// ]);

// router.post("/upload", (req, res) => {
//   upload(req, res, (err) => {
//     const profileitem = new ProfileSet(req.body);
//     if (err) {
//       // handle error
//       res.status(500).json(err);
//     } else {
//       // save data to MongoDB
//       res.profileitem.save()
//       res.status(200).send("profile uploaded");
//     }
//   });
// });
const upload = multer({ storage: storage });

router.post(
  "/uploads",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const { profileImage, coverImage, description, userId } = req.body;

    // Store the uploaded files in the server's file system or cloud storage service

    // Create a new user in the MongoDB database using Mongoose
    const userProfile = new ProfileSet({
      profileImage: profileImage,
      coverImage: coverImage,
      description,
      userId,
    });
    try {
      await userProfile.save();
      res.status(201).json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
);





// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// // const upload = multer({ dest: 'public/profile/' });
// const upload = multer({
//   storage: storage,
// });

// router.post("/:id", upload.array("files"), async (req,res)=> {
//     const profile = new ProfileSet(re.body);
//     try {
//         const userProfile = await profile.save();
//         res.status(200).json(userProfile);
//     } catch (err) {
//         res.status(500).json(err);
//     }

// })


module.exports = router;