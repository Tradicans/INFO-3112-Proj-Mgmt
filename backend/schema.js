const schema = `
type Query {

    users: [User],

    tasks: [Task],

    sprints: [Sprint],

    products: [Product],

    stories: [Story],

    sprintsbyproject(productid: String): [Sprint],

    storiesbysprint(sprintid: String): [Story],

    tasksbystory(storyid: String): [Task],

    usersbyproject(productid: String): [User],

    sprintsbyproject(productname: String): [Sprint],

    storiesbysprint(sprintname: String): [Story],

    tasksbystory(storyname: String): [Task],

    usersbyproject(productname: String): [User],

    project_setup: [String]

},

type User {

    name: String

    role: String

},

type Product {

    productname: String

    startdate: String

    enddate: String

    productowner: String

    teammembers: [String]

    hoursperstorypoint: Int

    estimatestorypoints: Int

    estimatetotalcost: String

    iscompleted: String

},

type Sprint {

    productid: String

    sprintname: String

    teammembers: [String]

    startdate: String

    enddate: String

    iscompleted: String
},

type Story {

    storyname: String

    storydescription: String

    sprintid: String

    productid: String

    teammembers: [String]

    storypoints: Int

    costperhour: Float

    iscompleted: String

},

type Task {

    taskname: String

    storyid: String

    sprintid: String

    productid: String

    taskdetails: String

    teammembers: [String]

    hourscompleted: Int

    iscompleted: String

},

type Mutation {

    addproduct(productname: String, startdate: String, endate: String, productowner: String, teammembers: [String], hoursperstorypoint: Int, estimatestorypoints: Int, estimatetotalcost: String, iscompleted: String): Product,

    adduser(name: String, role: String): User,

    addsprint(productid: String, sprintname: String, teammembers: [String], startdate: String, enddate: String, iscompleted: String): Sprint,

    addstory(storyname: String, storydescription: String, sprintid: String, productid: String, storypoints: Int, costperhour: Float, iscompleted: String): Story,

    addtask(taskname: String, storyid: String, sprintid: String, productid: String, taskdetails: String, teammembers: [String], hourscompleted: Int, iscompleted: String): Task

},

`;
export { schema };
