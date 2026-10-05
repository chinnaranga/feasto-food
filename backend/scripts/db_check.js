import "dotenv/config";
import mongoose from "mongoose";

const run = async () => {
  try {
    const uri = "mongodb+srv://feasto_user:Feasto77024848@feasto.k9rhwi1.mongodb.net/food_platform?retryWrites=true&w=majority";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected!");
    
    // Count collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} documents`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Error checking db:", err);
    process.exit(1);
  }
};

run();
