import db, { Collection } from "mongodb";

export const collections: {
  [key: string]: Collection;
} = {};

export const connectToMongoDb = async () => {
  const db_uri = process.env.DB_URI || process.env.MONGODB_URI;
  if (!db_uri) {
    throw Error("MongoDB URI not found");
  }

  const client = await db.MongoClient.connect(db_uri, {
    useUnifiedTopology: true,
  });

  console.log(`Mongoclient connected to database server:${client.isConnected()}`);

  // Retrieving mongodb collections
  collections.users = client.db().collection("users");
  collections.peaks = client.db().collection("peaks");
  collections.trips = client.db().collection("trips");
  collections.ascents = client.db().collection("ascents");
  collections.bucketlist = client.db().collection("bucketlist");
  collections.images = client.db().collection("images");

  // Creating indices
  collections.trips.createIndex({ updatedAt: 1 });
  collections.trips.createIndex({ tripDate: 1, createdAt: 1 });

  collections.peaks.createIndex({ name: 1 });

  //Connection events
  client.on("connected", () => {
    console.log("Mongoose connected to " + db_uri);
  });
  client.on("error", (err) => {
    console.log("Mongoose connection error: " + err);
  });
  client.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });

  //Capture app termination/restart events
  //To be called when process is restarted or terminated
  const gracefulShutdown = (msg: string, callback: any) => {
    client.close(() => {
      console.log("Mongo client disconnected through " + msg);
      callback();
    });
  };

  //For app termination
  process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => {
      process.exit(0);
    });
  });
  //For Heroku app termination
  process.on("SIGTERM", () => {
    gracefulShutdown("Heroku app termination", () => {
      process.exit(0);
    });
  });
};
