import app from './app';
// import mongoose from 'mongoose';

const hostname = process.env.HOST ?? '127.0.0.1';
const port = process.env.PORT ?? 3000;
const uri:any = process.env.MONGODB_URL;


/**
 * Uncomment this if you want to connect to MongoDB with mongoose
 */

// const connectDB = async () => {
//  try {
//    await mongoose.connect(uri);
//    console.log("🚀 You successfully connected to MongoDB!");
//  } catch (error) {
//    console.error("Error connecting to the database", error);
//  }
// }


async function run() {
    // Connect to the database server
    // await connectDB();
    // start server
    app.listen(3000, () =>
      console.log(`🚀 Server ready at:  http://${hostname}:${port} \n⭐️ Get a coffee and say hi to the creator of this project: https://www.buymeacoffee.com/codelab_sn \n👤 Follow me on GitHub: https://github.com/abdoulayeDABO 👤`
    ));
}


// run the application
run().catch(console.dir);

