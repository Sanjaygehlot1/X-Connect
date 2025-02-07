import mongoose from "mongoose";

type DBConnectionObj = {
    isConnected? : number
}

const connection: DBConnectionObj= {

}

async function DBConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected")
        return
    }
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || "",{})
       console.log(db)
       connection.isConnected = db.connections[0].readyState
       console.log("DB connected Successfully")
    } catch (error) {
        console.log("DB connection failed")
        
        process.exit(1)
    }

}

export  {DBConnect}