const express = require( 'express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iohyjcv.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    const database = client.db("brandDB");
    const brandCollection = database.collection("brand");
    const cartCollection = client.db("cartDB").collection("cart");
    app.get('/brand',async(req,res)=>{
      const cursor = brandCollection.find()
      const result  = await cursor.toArray();
      res.send(result);
    } )
    app.get('/cart',async(req,res)=>{
      const cursor = cartCollection.find()
      const result  = await cursor.toArray();
      res.send(result);
    } )
    app.get('/brand/:id',async(req,res)=>{
      const id = req.params.id;
      //console.log(id);
      const query = {_id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    } )

    
   app.post('/brand',async(req,res)=>{
    const brands= req.body;
    console.log(brands);
    const result = await brandCollection.insertOne(brands);
    res.send(result);

   })
   app.post('/cart',async(req,res)=>{
    const cart= req.body;
    console.log(cart);
    const result = await cartCollection.insertOne(cart);
    res.send(result);

   })
   app.put('/brand/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedUser = req.body;
    console.log(updatedUser);
    const filter = {_id: new ObjectId(id) };
    const options = { upsert: true };
    const userUpdate = {
      $set: {
        name: updatedUser.name,
        image: updatedUser.image,
        brand: updatedUser.brand,
        type: updatedUser.type,
        shortDescription: updatedUser.shortDescription,
        price: updatedUser.price,
        rating:updatedUser.rating
      },
    }
    const result = await brandCollection.updateOne(filter, userUpdate, options);
    res.send(result)

   })
   
   app.delete('/cart/:id',async(req,res)=>{
    const id = req.params.id;
    console.log('delete',id);
    const query = {_id: id };
    const result = await cartCollection.deleteOne(query);
    res.send(result);
   } )




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("brand names")
} )
app.listen(port,(req,res)=>{
    console.log(`server side  is running ${port}`);
} )
