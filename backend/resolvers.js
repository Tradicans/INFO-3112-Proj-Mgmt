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
    let results = await rtn.addOne(db, cfg.productColl, product);
    return results.acknowledged ? product : null;
  },
  adduser: async (args) => {
    let db = await rtn.getDBInstance();
    let user = { name: args.name, role: args.role };
    let results = await rtn.addOne(db, cfg.userColl, user);
    return results.acknowledged ? user : null;
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
    let results = await rtn.addOne(db, cfg.sprintColl, sprint);
    return results.acknowledged ? sprint : null;
  },
  addstory: async (args) => {
    let db = await rtn.getDBInstance();
    let story = {
      storyname: args.storyname,
      storydescription: args.storydescription,
      sprints: args.sprints,
      storypoints: args.storypoints,
      costperhour: args.costperhour,
      priority: args.priority,
      tasks: args.tasks,
    };
    let results = await rtn.addOne(db, cfg.storyColl, story);
    return results.acknowledged ? story : null;
  },
  addtask: async (args) => {
    let db = await rtn.getDBInstance();
    let task = {
      taskname: args.storyname,
      storyid: args.storydescription,
      taskdetails: args.sprints,
      teammember: args.storypoints,
      hourscompleted: args.costperhour,
      iscompleted: args.iscompleted,
    };
    let results = await rtn.addOne(db, cfg.storyColl, task);
    return results.acknowledged ? task : null;
  },
};

export default resolvers;
