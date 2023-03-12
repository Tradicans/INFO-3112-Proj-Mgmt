//Products have a list of sprints. Because a story cannot exist without a sprint, we reference
//the stories from the products through their respective sprints.

//Sprints reference their respective products by the productid, stories reference their respective
//sprint by the sprintid

//Stories can reference many sprints, sprints can reference many stories, but the stories/sprints can only
//reference one product.

//Stories contain a list of tasks and a task can reference a story. The tasks contain a user

//Users hold a list of products they're working on

//TESTED:

//MUTATIONS~~~~~~~
//addproduct [check]
//adduser [check]
//addstory [check]
//addsprint [check]
//addtask [check]
//QUERY~~~~~~~~~~~
//users [check]
//tasks [check]
//sprints [check]
//stories [check]
//products [check]
//sprintsbyproject(productid: String) [check]
//storiesbysprint(sprintid: String) [check]
//tasksbystory(storyid: String) [check]
//usersbyproject(productid: String) [check]
//project_setup: [?]

const schema = `
type Query {
    users: [User]
    tasks: [Task]
    sprints: [Sprint]
    products: [Product]
    stories: [Story]
    sprintsbyproduct(productid: String): [Sprint]
    storiesbysprint(sprintid: String): [Story]
    tasksbystory(storyid: String): [Task]
    usersbyproduct(productid: String): [User]
    project_setup: [String]
},

type User {
    _id: String
    name: String
    role: String
    products: [String]
},

type Product {
    _id: String
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
    _id: String
    productid: String
    sprintname: String
    startdate: String
    enddate: String
    iscompleted: Boolean
    stories: [String]
},

type Story {
    _id: String
    storyname: String
    storydescription: String
    sprints: [String]
    storypoints: Int
    costperhour: Float
    priority: Int
    tasks: [String]
},

type Task {
    _id: String
    taskname: String
    storyid: String
    taskdetails: String
    teammember: String
    hourscompleted: Int
    iscompleted: Boolean
},

type Mutation {
    addproduct(productname: String, teamname: String, startdate: String, enddate: String, productowner: String, teammembers: [String], hoursperstorypoint: Int, estimatestorypoints: Int, estimatetotalcost: Int, sprints: [String]): Product,
    adduser(name: String, role: String): User,
    addsprint(productid: String, sprintname: String, startdate: String, enddate: String, iscompleted: Boolean, stories: [String]): Sprint,
    addstory(storyname: String, storydescription: String, sprints: [String], storypoints: Int, costperhour: Float, priority: Int, tasks: [String]): Story,
    addtask(taskname: String, storyid: String, taskdetails: String, teammember: String, hourscompleted: Int, iscompleted: Boolean): Task
},
`;
export default schema;
