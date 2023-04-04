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

  sprintsbyproduct: async (args) => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(
      db,
      cfg.sprintColl,
      { productid: args.productid },
      {}
    );
  },
  storiesbysprint: async (args) => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.storyColl, { sprints: args.sprintid }, {});
  },
  tasksbystory: async (args) => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(
      db,
      cfg.taskColl,
      {
        storyid: args.storyid,
      },
      {}
    );
  },
  usersbyproduct: async (args) => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(
      db,
      cfg.userColl,
      { products: args.productid },
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
      sprints: args.sprints,
    };
    let results = await rtn.addOne(db, cfg.productColl, product);
    return results.acknowledged ? product : null;
  },
  adduser: async (args) => {
    let db = await rtn.getDBInstance();
    let user = { name: args.name, role: args.role, products: [""] };
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
      taskname: args.taskname,
      storyid: args.storyid,
      taskdetails: args.taskdetails,
      teammember: args.teammember,
      hourscompleted: args.hourscompleted,
      iscompleted: args.iscompleted,
    };
    let results = await rtn.addOne(db, cfg.taskColl, task);
    return results.acknowledged ? task : null;
  },
  updateuser: async (args) => {
    let db = await rtn.getDBInstance();
    let results = await rtn.updateOne(
      db,
      cfg.userColl,
      { _id: new rtn.ObjectId(args._id) },
      { name: args.name, role: args.role, products: args.products }
    );
    if (args.products[0]?.length != 0)
      for (let i = 0; i < args.products.length; i++) {
        let product = await rtn.findOne(db, cfg.productColl, {
          _id: new ObjectId(args.products[i]),
        });
        if (product.teammembers[0]?.length != 0)
          if (!product.teammembers.includes(args._id)) {
            product.teammembers.push(args._id);
          } else {
          }
        else product.teammembers[0] = args._id;
        internalProductUpdate(product);
      }

    return results.value !== null
      ? args
      : {
          _id: args._id,
          name: "None found",
          role: "No user updated",
        };
  },
  updatetask: async (args) => {
    let db = await rtn.getDBInstance();
    let results = await rtn.updateOne(
      db,
      cfg.taskColl,
      { _id: new rtn.ObjectId(args._id) },
      {
        taskname: args.taskname,
        storyid: args.storyid,
        taskdetails: args.taskdetails,
        teammember: args.teammember,
        hourscompleted: args.hourscompleted,
        iscompleted: args.iscompleted,
      }
    );
    return results.value !== null
      ? args
      : {
          _id: args._id,
          taskname: "None found",
          taskdetails: "No task updated",
        };
  },
  updatestory: async (args) => {
    let db = await rtn.getDBInstance();
    let results = await rtn.updateOne(
      db,
      cfg.storyColl,
      { _id: new rtn.ObjectId(args._id) },
      {
        storyname: args.storyname,
        storydescription: args.storydescription,
        sprints: args.sprints,
        storypoints: args.storypoints,
        costperhour: args.costperhour,
        priority: args.priority,
        tasks: args.tasks,
      }
    );
    return results.value !== null
      ? args
      : {
          _id: args._id,
          storyname: "None found",
          storydescription: "No story updated",
        };
  },
  updateproduct: async (args) => {
    let db = await rtn.getDBInstance();
    let results = await rtn.updateOne(
      db,
      cfg.productColl,
      { _id: new rtn.ObjectId(args._id) },
      {
        productname: args.productname,
        teamname: args.teamname,
        startdate: args.startdate,
        enddate: args.enddate,
        productowner: args.productowner,
        teammembers: args.teammembers,
        hoursperstorypoint: args.hoursperstorypoint,
        estimatestorypoints: args.estimatestorypoints,
        estimatetotalcost: args.estimatetotalcost,
        sprints: args.sprints,
      }
    );
    return results.value !== null
      ? args
      : {
          _id: args._id,
          productname: "None found",
          teamname: "No product updated",
        };
  },
  project_setup: async () => {
    let db = await rtn.getDBInstance();
    await rtn.deleteAll(db, cfg.productColl, {}, {});
    await rtn.deleteAll(db, cfg.sprintColl, {}, {});
    await rtn.deleteAll(db, cfg.storyColl, {}, {});
    await rtn.deleteAll(db, cfg.userColl, {}, {});
    await rtn.deleteAll(db, cfg.taskColl, {}, {});
    return "all tables have been dropped.";
  },
  updatesprint: async (args) => {
    let db = await rtn.getDBInstance();
    let results = await rtn.updateOne(
      db,
      cfg.sprintColl,
      { _id: new rtn.ObjectId(args._id) },
      {
        productid: args.productid,
        sprintname: args.sprintname,
        startdate: args.startdate,
        enddate: args.enddate,
        iscompleted: args.iscompleted,
        stories: args.stories,
      }
    );
    return results.value !== null
      ? args
      : {
          _id: args._id,
          productid: "None found",
          sprintname: "No sprint updated",
        };
  },
};

let internalProductUpdate = async (args) => {
  await resolvers.updateproduct(args);
};

export default resolvers;
