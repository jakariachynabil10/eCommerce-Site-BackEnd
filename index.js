const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = 4612


app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aoalbnp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allColleges = client.db("eCommerceSite").collection("allColleges")
    const research = client.db("eCommerceSite").collection("research")

    app.get("/allColleges", async (req, res)=>{
      const result = await allColleges.find().toArray()
      res.send(result)
    })

    app.get("/research", async(req, res)=>{
      const result = await research.find().toArray()
      res.send(result)
    })

    app.get('/searchCollege', async(req, res)=>{
      // console.log(req.query.search)
      const search = req.query.search
      const query = { college_name : { $regex : search}}
      const result = await allColleges.find(query).toArray();
      res.send(result);
    })

    app.get("/allColleges/:id", async (req, res) => {
      const id = req.params.id;
    
     const query = {_id : new ObjectId(id)}
      const result = await allColleges.findOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('eCommerce server is running')
})

app.listen(port, () => {
  console.log(`eCommerce server is running on port ${port}`)
})