import mongoose from "mongoose";

function mongoConnection(url){
    return mongoose.connect(url)
}

export default mongoConnection;