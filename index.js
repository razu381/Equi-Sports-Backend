const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adfe3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    //strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    //database info
    const database = client.db("equipments");
    const equipmentsCollection = database.collection("equipments");
    //Get products from database
    app.get("/equipments", async (req, res) => {
      let result = await equipmentsCollection.find().toArray();
      res.send(result);
      console.log("All equipments data was requested");
    });
    //Get muy products from database for my equipment page
    app.get("/my-equipments/:email", async (req, res) => {
      let userEmail = req.params.email;
      let query = { email: userEmail };
      let result = await equipmentsCollection.find(query).toArray();
      res.send(result);
      console.log("My equipments data was requested");
    });
    //Get products from database for home only and only 6 products
    app.get("/equipments/for-home", async (req, res) => {
      let result = await equipmentsCollection.find().limit(6).toArray();
      res.send(result);
      console.log("All equipments data was requested");
    });
    //get single product from database
    app.get("/equipments/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) };
      let result = await equipmentsCollection.findOne(query);

      res.send(result);
    });
    //send product to databse
    app.post("/equipments", async (req, res) => {
      let equipment = req.body;
      let result = await equipmentsCollection.insertOne(equipment);
      res.send(result);
      console.log("equipment post was pinged");
    });
    //Update product in database
    app.put("/equipments/:id", async (req, res) => {
      let id = req.params.id;
      let equipment = req.body;
      let filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateEquiment = {
        $set: {
          name: equipment?.name,

          image: equipment?.image,

          price: equipment?.price,

          category: equipment?.category,

          rating: equipment?.rating,

          customization: equipment?.customization,

          processingTime: equipment?.processingTime,

          stock: equipment?.stock,

          details: equipment?.details,

          email: equipment?.email,

          userName: equipment?.userName,
        },
      };

      let result = await equipmentsCollection.updateOne(
        filter,
        updateEquiment,
        options
      );
      res.send(result);
    });
    //delete product from database
    app.delete("/equipments/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) };
      let result = await equipmentsCollection.deleteOne(query);

      res.send(result);
    });

    //get all categories from the database
    app.get("/categories", async (req, res) => {
      let result = await equipmentsCollection.distinct("category");
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
