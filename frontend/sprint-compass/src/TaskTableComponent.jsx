import * as React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Checkbox,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  List,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddCircle from "@mui/icons-material/AddCircle";

import theme from "./theme";
import "./App.css";
import queryFunction from "./queryfunction";

//**************for dev only
// function createData(storyid, name, description, priority, storyPts, cost) {
// 	return {
// 		storyid,
// 		name,
// 		description,
// 		priority,
// 		storyPts,
// 		cost,
// 		tasks: [
// 			{
// 				taskid: "abc123",
// 				name: "task1",
// 				details: "task1 deets",
// 				teammember: "Amber",
// 				hrscomplete: 5,
// 				addtosprint: "",
// 				isComplete: true,
// 			},
// 			{
// 				taskid: "abc456",
// 				name: "task2",
// 				details: "task2 deets",
// 				teammember: "Ryan",
// 				hrscomplete: 8,
// 				addtosprint: "",
// 				isComplete: false,
// 			},
// 		],
// 	};
// }
const getTasks = async (props) => {
  let query = `query {tasksbystory(storyid:"${props.row._id}"){_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted}}`;
  let task = await queryFunction(query);
  return task.data.tasksbystory;
};
const initialState = {
  showAddCard: false,
  storyid: "",
  taskName: "",
  taskDesc: "",
  taskHrs: "",
  taskOwner: "",
};
const state = initialState;

const Row = (props) => {
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = React.useReducer(reducer, initialState);
  //let task = getTask(props);

  const { storyrow } = props;
  let storyid = storyrow._id;
  // taskrows = getTasks(props);
  //

  const [open, setOpen] = React.useState(false);

  const showTaskAddModal = () => {
    setState({ showAddCard: true });
  };
  const closeTaskAddModal = () => {
    setState({ showAddCard: false });
  };
  const onTaskCancelClicked = () => {
    closeTaskAddModal();
  };
  const handleTaskNameInput = (e) => {
    setState({ taskName: e.target.value });
  };
  const handleTaskDescInput = (e) => {
    setState({ taskDesc: e.target.value });
  };
  const handleTaskHrsInput = (e) => {
    setState({ taskHrs: e.target.value });
  };
  const handleTaskOwnerInput = (e) => {
    setState({ taskOwner: e.target.value });
  };
  const onTaskAddClicked = async () => {
    // code to add task to db

    //todo: fill this in
    let query = `mutation {addtask(taskname:"${state.taskName}",storyid:"${storyid}",taskdetails:"${state.taskDesc}",teammember:"${state.taskOwner}",hourscompleted:0,iscompleted:false) {_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted},}`;
    //todo: update sprint to include task
    // let task = await queryFunction(query);
    // query = `query {addtask(taskname:"${state.taskName}",storyid:"${storyid}",taskdetails:"${state.taskDesc}",teammember:"",hourscompleted:0,iscompleted:false) {_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted}}`;

    await queryFunction(query);
    // reset state
    setState({
      taskName: "",
      taskDesc: "",
      taskHrs: "",
      taskOwner: "",
    });
    closeTaskAddModal();
  };

  return (
    <React.Fragment>
      <Modal open={state.showAddCard}>
        <Card className="card">
          <CardHeader
            title="Add Task"
            style={{ color: theme.palette.primary.main, textAlign: "center" }}
          />
          <CardContent>
            <div style={{ textAlign: "center" }}>
              <TextField
                style={{ margin: "1%", width: "98%" }}
                onChange={handleTaskNameInput}
                placeholder="Task Name"
                value={state.taskName}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <TextField
                style={{ margin: "1%", width: "98%" }}
                onChange={handleTaskDescInput}
                placeholder="Task Details"
                value={state.taskDesc}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <TextField
                style={{ margin: "1%", width: "48%" }}
                onChange={handleTaskHrsInput}
                placeholder="Estimated # Hours"
                value={state.taskHrs}
              />
              <TextField
                style={{ margin: "1%", width: "48%" }}
                onChange={handleTaskOwnerInput}
                placeholder="Team Member"
                value={state.taskOwner}
              />
              {/* todo: change to dropdown autofill */}
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                style={{ margin: "1%", width: "25%" }}
                color="secondary"
                variant="contained"
                onClick={onTaskCancelClicked}
              >
                Cancel
              </Button>
              <Button
                style={{ margin: "1%", width: "25%" }}
                color="secondary"
                variant="contained"
                onClick={onTaskAddClicked}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand storyrow"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="storyrow">
          {storyrow.storyname}
        </TableCell>
        <TableCell>{storyrow.storydescription}</TableCell>
        <TableCell align="right">{storyrow.priority}</TableCell>
        <TableCell align="right">{storyrow.storypoints}</TableCell>
        <TableCell align="right">{storyrow.costperhour}</TableCell>
        <TableCell align="right">
          <IconButton
            color="secondary"
            aria-label="add task"
            size="small"
            onClick={showTaskAddModal}
          >
            <AddCircle fontSize="large" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ color: theme.palette.secondary.main }}
              >
                Tasks
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Complete?</TableCell>

                    <TableCell>Name</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Team Member</TableCell>
                    <TableCell>Hours Complete</TableCell>
                    <TableCell>Add to Sprint</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowTasks.map((taskRow, index) => (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, taskRow._id)}
                      role="checkbox"
                      aria-checked={taskRow.iscompleted}
                      tabIndex={-1}
                      key={index}
                      selected={taskRow.iscompleted}
                      sx={{ cursor: "pointer" }}
                    >
                      {" "}
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={taskRow.iscompleted}
                          // onChange={onSelectAllClick}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {taskRow.taskname}
                      </TableCell>
                      <TableCell>{taskRow.taskdetails}</TableCell>
                      <TableCell>
                        <TextField
                          onChange={handleUserNameInput}
                          placeholder="Team Member"
                          value={taskRow.teammember}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          onChange={handleHrsInput}
                          placeholder="Hours Completed"
                          value={taskRow.hourscompleted}
                        />
                      </TableCell>
                      {/* todo: make teammember an autocomplete textbox 											 */}
                      <TableCell>
                        <TextField
                          onChange={handleSprintChange}
                          placeholder="Select sprint"
                          // value={taskRow.addtosprint}
                        />
                      </TableCell>
                      {/* todo: make sprint an autocomplete textbox 											 */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

//*******************for dev
// const rows = [
// 	createData(1, "Story 1", "First Story", 1, 3, 65.0),
// 	createData(2, "Story 2", "Second Story", 3, 1, 75.0),
// 	createData(3, "Story 3", "Third Story", 2, 5, 65.0),
// 	createData(4, "Story 4", "Fourth Story", 5, 8, 45.0),
// 	createData(5, "Story 5", "Fifth Story", 4, 2, 65.0),
// ];

//done: checkboxes on task rows
//todo: tie in checkboxes to isComplete - use mutation

const TaskTableComponent = (props) => {
  const rows = props.storiesForTable;
  return (
    <TableContainer component={Paper}>
      {/* <Modal open={state.showAddCard}>
				<Card className="card">
					<CardHeader
						title="Add User Story"
						style={{ color: theme.palette.primary.main, textAlign: "center" }}
					/>
					<CardContent></CardContent>
				</Card>
			</Modal> */}
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />

            <TableCell>
              <Typography
                variant="h6"
                style={{ color: theme.palette.primary.main }}
              >
                Story
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h6"
                style={{ color: theme.palette.primary.main }}
              >
                Description
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="h6"
                style={{ color: theme.palette.primary.main }}
              >
                Priority
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="h6"
                style={{ color: theme.palette.primary.main }}
              >
                Story Points
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="h6"
                style={{ color: theme.palette.primary.main }}
              >
                Cost Per Hour
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                variant="h6"
                style={{ color: theme.palette.primary.main }}
              >
                Add Task
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTableComponent;
