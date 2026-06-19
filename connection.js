import mongoose from "mongoose";

// Fail fast instead of hanging when the DB is unreachable, so pages can still
// render (with empty data) when MONGODB_URI is missing or the DB is down.
mongoose.set("bufferTimeoutMS", 5000);

function mongoConnection(url) {
    return mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
}

export default mongoConnection;
