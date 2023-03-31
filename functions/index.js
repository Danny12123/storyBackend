const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require('./route/users');
const authRoute = require('./route/auth');
const PostRoute = require('./route/post');
const Conversation = require('./route/conversation');
const MessageRoute = require('./route/message');
const multer = require("multer");
const path = require("path");
const Comment = require('./route/comment');
const Coinbase = require("coinbase");
const suerRouter = require('./route/Suers')
const sauthRouter = require('./route/Sauth')
const profileRouter = require('./route/profile')
const cors = require('cors');
const serverless = require("serverless-http");


dotenv.config();

// initializeApp(config.firebaseConfig)

// coinbase
// const client = new Coinbase.Client({
//   apiKey: "your-api-key",
//   apiSecret: "your-api-secret",
//   // const amount = req.body.amount;
//   // const currency = req.body.currency;
//   // const walletAddress = req.body.walletAddress;
//   // const { amount, walletAddress } = req.body;
// )};
//Hostwallet = {add: 1Lk2A4cPogNDgk29sWFvqYnnFmak7zAuu6, apiS: L23L4ZDPUopKwtyLS55Ffnz1tV5AeJso31xxYBtgSxF87FSq9uZp}
//sender = {add: 1G65evjXiP3NGCXJ2Ykn51NqcKjjQip55D , apiS: L3UQKajk4DeK25gJh1gN6gN5fXzNP4FSqPToEhEMpkVmTfz7wM9b}
  const options = {
    rejectUnauthorized: false,
    // other options
  };
const client = new Coinbase.Client({
  apiKey: " lwIKjIbVriqmzA0e",
  apiSecret: "W72XH9KHvDnWHZW1vEaPS8NuwODTBsOa",
});
app.post("/.netlify/functions/api/payments", (req, res) => {
  // const { amount, walletAddress } = req.body;
 
  // initiate a cryptocurrency payment using Coinbase API
  client.getAccounts({}, (err, accounts) => {
    if (err) {
      console.error("Coinbase API error:", err);
      res.status(500).send({ error: "Payment failed" });
      return;
    }
    const account = accounts[0];
    account.sendMoney(
      {
        to: req.body.walletAddress,
        amount: req.body.amount,
        currency: "BTC",
        description: "Payment for goods or services",
      },
      (err, tx) => {
        if (err) {
          console.error("Coinbase API error:", err);
          res.status(500).send({ error: "Payment failed" });
          return;
        }
        console.log("Payment successful:", tx);
        res.send({ success: true });
      }
    );
  });
});


//End of coinbase


mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
    },
    options
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  app.use(express.static("public/image"));
  //middleware

  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));
// req.body.name

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/image");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      // cb(null, Date.now() + '-' + file.name);
    },
  });

  const upload = multer({ storage })
  app.post("/.netlify/functions/api/upload", upload.array("files"), (req, res) => {
    try {
      return res.status(200).json("File has been uploaded");
    } catch (error) {
      console.error(error);
    }
  });

  const uploadMut = multer({ storage });
  app.post("/.netlify/functions/api/profilepic", uploadMut.single("file"), (req, res) => {
    try {
      return res.status(200).json("File has been uploaded");
    } catch (error) {
      console.error(error);
    }
  });

  // Define a route to retrieve all items in the collection
  app.get('/.netlify/functions/api/items', async (req, res) => {
    try {
      const collection = db('storymain').collection('post');
      const items = await collection.find().toArray();
      res.status(200).json(items);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });

  app.use("/.netlify/functions/api/users", userRoute);
  app.use("/.netlify/functions/api/auth", authRoute);
  app.use("/.netlify/functions/api/post", PostRoute);
  app.use("/.netlify/functions/api/conversation", Conversation);
  app.use("/.netlify/functions/api/message", MessageRoute);
  app.use("/.netlify/functions/api/comment", Comment);
  app.use("/.netlify/functions/api/susers", suerRouter);
  app.use("/.netlify/functions/api/sauth", sauthRouter);
  app.use("/.netlify/functions/api/profile", profileRouter);

module.exports.handler = serverless(app);

app.listen(7878,()=> console.log("Backend is running!"))