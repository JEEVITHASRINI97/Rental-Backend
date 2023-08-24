import * as dotenv from 'dotenv' 
dotenv.config();
import  express  from "express";
import { MongoClient } from "mongodb";

const app = express();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import mongodb from "mongodb";
import {ObjectId} from "mongodb";
const PORT = process.env.PORT;
console.log(process.env.MONGO_URL);
//const MONGO_URL = "mongodb://127.0.0.1";

const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");
app.use(express.json());


app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use(cors())

app.get("/product", async function (request, response) {
  const product = await client.db("esta")
  .collection("products")
  .find({})
  .toArray();
  response.send(product);
});
app.post("/product", async function(request,response){
  const data = request.body;
  const result = await client.db("esta")
  .collection("products")
  .insertMany(data);
  response.send(result);

});


app.get("/Products/:id", async (req, res) => {
try {
 
 
  const product = await client.db("esta")
    .collection("products")
    .findOne({ _id: mongodb.ObjectId(req.params.productId) });

  if (product) {
    res.json(product);
    await connection.close();
  } else {
    res.status(404).json({ message: "Product not found" });
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Something went wrong" });
}
});

app.delete("/Products/:id",async(req,res)=>{
  try {
      const connection =await mongoclient.connect();
      const db = connection.db(DB);
      const productData = await client.db("esta")
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
      res.json(productData);
      if (productData) {
          const product = await db
            .collection("products")
            .deleteOne({ _id: mongodb.ObjectId(req.params.id) }); 
            res.json(product);
            await connection.close();
        } else {
          res.status(404).json({ message: "Product not found" });
        }
  
  } catch (error) {
      console.log(error);
      res.json({message:"something Went Wrong"});
  }
})



app.get("/Product/:id",async(req,res)=>{
  try {
     
      const Products =  await client.db("esta")
      .collection("products").findOne({_id:mongodb.ObjectId(req.params.id)}); 
      res.json(Products);
      await connection.close();
  
  } catch (error) {
      console.log(error);
      res.json({message:"something Went Wrong"});
  }
})

app.put("/Products/:id", async (req, res) => {
try {

  const productData = await client.db("esta")
    .collection("products")
    .findOne({ _id: mongodb.ObjectId(req.params.id) });

  if (productData) {
    delete req.body._id;
    const product = await db
      .collection("products")
      .updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    res.json(product);
    await connection.close();
  } else {
    res.status(404).json({ message: "Product not found" });
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Something went wrong" });
}

});

app.post("/hours/:id",async(req,res)=>{
  try {
   
      const Products =  await client.db("esta")
      .collection("products").findOne({_id:mongodb.ObjectId(req.params.id)});
      var date1 = new Date(req.body.startDate);
      var date2 = new Date(req.body.endDate);
      var hours = (date2-date1)/(1000*3600);
      res.json(hours)
      await connection.close();    
  } catch (error) {
      console.log(error);
      res.json({message:"Something Went Wrong"});
  }
});

app.post("/admin/register", async (req, res) => {
  try {
    

    //hash the password
    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    // Select Collection
    // Do operation (CRUD)
    await db.collection("admin").insertOne(req.body);

    res.json({ message: "Admin created Sucessfully" });

   // Close the connection
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    
    const admin = await client.db("esta")
    .collection("admin")
      .findOne({ email: req.body.email });
    if (admin) {
      const compare = await bcrypt.compare(req.body.password, admin.password);
      if (compare) {
        //issue token
        const token = jwt.sign({ _id: admin._id }, jwt_secret, {
          expiresIn: "3m",
        });
  
        res.json({ message: "Success", token });
      } else {
        res.json({ message: "Incorrect email/password" });
      }
    } else {
      res.status(404).json({ message: "Incorrect email/password" });
    }

    // Close the connection
    db.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.post("/Contacts",async(req,res)=>{
  try {
    const data = req.body;
    const contact = await client.db("esta")
    .collection("Contacts")
    .insertOne(data);
  
      await connection.close();
      res.json(contact);

      
  } catch (error) {
      console.log(error);
      res.json({message:"something Went Wrong"});
  }
})
export const closeDBConnection = async () => {
  try {
    if( mongoClient != null ){
      await mongoClient.close();
      mongoClient = null;
      cachedDb = null;

      console.log("db connection closed");
      return true;
    } 
  } catch (error) {
    console.log("Error in closeDBConnection => ", error);
    return false;
  } 
};


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));