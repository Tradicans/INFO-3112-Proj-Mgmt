import * as rtn from "./db_routines.js";
import * as cfg from "./config.js";
import { ObjectId } from "mongodb";

const resolvers = {
  //Queries
  users: async () => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.userColl, {}, {});
  },

  tasks: async () => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.taskColl, {}, {});
  },

  sprints: async () => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.sprintColl, {}, {});
  },

  products: async () => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.productColl, {}, {});
  },

  stories: async () => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.storyColl, {}, {});
  },

  sprintsbyproject: async (projectId) => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(
      db,
      cfg.sprintColl,
      { _id: ObjectId(projectId) },
      {}
    );
  },
  //Mutations
  addproduct: async (args) => {
    let db = await rtn.getDBInstance();
    let product = {
      productname: args.productname,
      teamname: args.teamname,
      startdate: args.startdate,
      enddate: args.enddate,
      productowner: args.productowner,
      teammembers: args.teammembers,
      hoursperstorypoint: args.hoursperstorypoint,
      estimatestorypoints: args.estimatestorypoints,
      estimatetotalcost: args.estimatetotalcost,
      iscompleted: args.iscompleted,
    };

    return await rtn.addOne(db, cfg.productColl, product);
  },
  adduser: async (args) => {
    let db = await rtn.getDBInstance();
    let user = { name: args.name, role: args.role };
    return await rtn.addOne(db, cfg.userColl, user);
  },
  addsprint: async (args) => {
    let db = await rtn.getDBInstance();
    let sprint = {
      productid: args.productid,
      sprintname: args.sprintname,
      startdate: args.startdate,
      enddate: args.enddate,
      iscompleted: args.iscompleted,
      stories: args.stories,
    };

    return await rtn.addOne(db, cfg.sprintColl, sprint);
  },
  /*
  type Mutation {

    addstory(storyname: String, storydescription: String, sprintid: String, productid: String, storypoints: Int, costperhour: Float, iscompleted: String): Story,

    addtask(taskname: String, storyid: String, sprintid: String, productid: String, taskdetails: String, teammembers: [String], hourscompleted: Int, iscompleted: String): Task

}
  */
};

export default resolvers;
