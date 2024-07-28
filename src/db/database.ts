import mongoose from "mongoose";
export const connectDB = async()=>{
  await  mongoose.connect(`${process.env.MONGODB_URL}`,{
        dbName: "Job_Prtal_App"
    })
    .then((c)=> console.log(`Connected to MongoDB`))
    .catch((e)=> console.log(e))
}
