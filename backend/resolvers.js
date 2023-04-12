import * as rtn from "./db_routines.js";
import * as cfg from "./config.js";

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
    return await rtn.findAll(db, cfg.taskColl, { storyid: args.storyid }, {});
  },
  tasksbyuser: async (args) => {
    let db = await rtn.getDBInstance();
    return await rtn.findAll(db, cfg.taskColl, { teammember: args.userid }, {});
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
  incompletedstories: async (args) => {
    let db = await rtn.getDBInstance();
    let stories = await rtn.findAll(
      db,
      cfg.storyColl,
      { sprints: args.sprintid },
      {}
    );
    console.log(stories);
    let incomplete = await stories.map(async (s) => {
      let tasks = await rtn.findAll(
        db,
        cfg.taskColl,
        { storyid: s._id.toString(), iscompleted: true },
        {}
      );
      if (tasks.length > 0) return s;
    });
    return incomplete;
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
    let user = { name: args.name, role: args.role, products: args.products };

    let results = await rtn.addOne(db, cfg.userColl, user);

    args.products.forEach(async (prodId) => {
      let product = await rtn.findOne(db, cfg.productColl, {
        _id: new rtn.ObjectId(prodId),
      });
      if (product !== null) {
        if (product.teammembers !== null) product.teammembers?.push(user._id);
        else product.teammembers = [user._id];

        let productResults = await rtn.updateOne(
          db,
          cfg.productColl,
          { _id: new rtn.ObjectId(prodId) },
          product
        );
      } else {
        console.log("no product");
      }
    });

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

    let product = await rtn.findOne(db, cfg.productColl, {
      _id: new rtn.ObjectId(sprint.productid),
    });
    if (product !== null) {
      if (product.sprints !== null) product.sprints.push(sprint._id);
      else product.sprints = [sprint._id];

      let productResults = await rtn.updateOne(
        db,
        cfg.productColl,
        { _id: product._id },
        product
      );

      console.log(productResults);
    }

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

    await story.sprints.forEach(async (sprintId) => {
      let sprint = await rtn.findOne(db, cfg.sprintColl, {
        _id: new rtn.ObjectId(sprintId),
      });
      if (sprint !== null) {
        if (sprint.stories !== null) sprint.stories.push(story._id);
        else sprint.stories = [story._id];

        await rtn.updateOne(db, cfg.sprintColl, { _id: sprint._id }, sprint);
      } else console.log(`!!!ERROR, NO SPRINT WITH ID ${sprintId}!!!`);
    });

    return results.acknowledged ? story : null;
  },
  addtask: async (args) => {
    let db = await rtn.getDBInstance();
    let task = {
      taskname: args.taskname,
      storyid: args.storyid,
      taskdetails: args.taskdetails,
      teammember: new rtn.ObjectId(args.teammember),
      hourscompleted: args.hourscompleted,
      iscompleted: args.iscompleted,
    };
    let story = await rtn.findOne(db, cfg.storyColl, {
      _id: new rtn.ObjectId(args.storyid),
    });
    let results = await rtn.addOne(db, cfg.taskColl, task);
    if (story._id === null) {
      console.lot("!!!Story doesn't exist!!!");
    } else {
      if (story.tasks !== null) story.tasks.push(task._id);
      else story.tasks = [task._id];
      let storyResults = await rtn.updateOne(
        db,
        cfg.storyColl,
        { _id: story._id },
        story
      );
      console.log(storyResults);
    }
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
          _id: -1,
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
    await args.sprints.forEach(async (s) => {
      let sprint = await rtn.findOne(db, cfg.sprintColl, { _id: s });
      if (sprint !== null) {
        if (sprint.stories !== null) {
          if (!sprint.stories.includes(s)) {
            sprint.stories.push(s);
            let sprintResult = await rtn.updateOne(
              db,
              cfg.sprintColl,
              { _id: sprint._id },
              sprint
            );
            console.log(sprintResult);
          }
        } else sprint.stories = [s];
      }
    });
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
  deletetask: async (args) => {
    let db = await rtn.getDBInstance();
    let deleted = await rtn.deleteOne(db, cfg.taskColl, {
      _id: new rtn.ObjectId(args._id),
    });
    console.log(deleted);
    return deleted.acknowledged ? "Deleted task" : "Task not found";
  },
  /*deleteproduct: async (args) => {
    let db = await rtn.getDBInstance();
    //let res = await rtn.deleteOne(db, cfg.productColl, { _id: args._id });
    let users = await rtn.findAll(db, cfg.userColl, { products: args._id });
    users.value.foreach(async (u) => {
      if (u.products.includes(args._id)) {
        u.products.splice(u.products.indexOf(args._id), 1);
        await internalUserUpdate(u);
      }
    });
  },*/
};

let internalProductUpdate = async (args) => {
  await resolvers.updateproduct(args);
};

export default resolvers;
