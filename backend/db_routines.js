import { MongoClient, ObjectId } from "mongodb";
import * as cfg from "./config.js";
//import got from "got";

let db;
const getDBInstance = async () => {
  if (db) {
    console.log(`using established connection`);
    return db;
  }
  let MongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
  try {
    const client = new MongoClient(cfg.dbUrl, MongoOptions);
    console.log(`establishing new connection to Atlas.`);
    const conn = await client.connect();
    db = conn.db(cfg.db);
  } catch (err) {
    console.log(err);
  }
  return db;
};
const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);
const count = (db, coll) => db.collection(coll).countDocuments();
const deleteAll = (db, coll) => db.collection(coll).deleteMany({});
const deleteMuch = (db, coll, criteria) =>
  db.collection(coll).deleteMany(criteria);
const addMany = (db, coll, docs) => db.collection(coll).insertMany(docs);
const findOne = (db, coll, criteria) => db.collection(coll).findOne(criteria);
const findAll = (db, coll, criteria, projection) =>
  db.collection(coll).find(criteria).project(projection).toArray();
const updateOne = (db, coll, criteria, projection) =>
  db
    .collection(coll)
    .findOneAndUpdate(criteria, { $set: projection }, { rawResult: true });
const deleteOne = (db, coll, criteria) =>
  db.collection(coll).deleteOne(criteria);
//const getJSONFromWWWPromise = (url) => got(url).json(); //For now we don't have/need got dependencies.
const findUniqueValues = (db, coll, field) =>
  db.collection(coll).distinct(field);

export {
  getDBInstance,
  addOne,
  count,
  deleteAll,
  deleteMuch,
  addMany,
  findOne,
  findAll,
  updateOne,
  deleteOne,
  //getJSONFromWWWPromise,
  findUniqueValues,
  ObjectId,
};
