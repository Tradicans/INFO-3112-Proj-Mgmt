//Products have a list of sprints. Because a story cannot exist without a sprint, we reference
//the stories from the products through their respective sprints.

//Sprints reference their respective products by the productid, stories reference their respective
//sprint by the sprintid

//Stories can reference many sprints, sprints can reference many stories, but the stories/sprints can only
//reference one product.

//Stories contain a list of tasks and a task can reference a story. The tasks contain a user

const schema = `
type Query {
    users: [User]
    tasks: [Task]
    sprints: [Sprint]
    products: [Product]
    stories: [Story]
    sprintsbyproject(productid: String): [Sprint]
    storiesbysprint(sprintid: String): [Story]
    tasksbystory(storyid: String): [Task]
    usersbyproject(productid: String): [User]
    project_setup: [String]
},

type User {
    name: String
    role: String
},

type Product {
    productname: String
    teamname: String
    startdate: String
    enddate: String
    productowner: String
    teammembers: [String]
    hoursperstorypoint: Int
    estimatestorypoints: Int
    estimatetotalcost: String
    sprints: [String]
},

type Sprint {
    productid: String
    sprintname: String
    startdate: String
    enddate: String
    iscompleted: Boolean
    stories: [String]
},

type Story {
    storyname: String
    storydescription: String
    sprints: [String]
    storypoints: Int
    costperhour: Double
    tasks: [String]
},

type Task {
    taskname: String
    storyid: String
    taskdetails: String
    teammember: String
    hourscompleted: Int
    iscompleted: Boolean
},

type Mutation {
    estimatestorypoints: Int
    estimatetotalcost: String
    sprints: [String]
    addproduct(productname: String, teamname: String, startdate: String, endate: String, productowner: String, teammembers: [String], hoursperstorypoint: Int, estimatestorypoints: Int, estimatetotalcost: String, iscompleted: String): Product,
    adduser(name: String, role: String): User,
    addsprint(productid: String, sprintname: String, teammembers: [String], startdate: String, enddate: String, iscompleted: String): Sprint,
    addstory(storyname: String, storydescription: String, sprintid: String, productid: String, storypoints: Int, costperhour: Float, iscompleted: String): Story,
    addtask(taskname: String, storyid: String, sprintid: String, productid: String, taskdetails: String, teammembers: [String], hourscompleted: Int, iscompleted: String): Task
},
`;
export default schema;
