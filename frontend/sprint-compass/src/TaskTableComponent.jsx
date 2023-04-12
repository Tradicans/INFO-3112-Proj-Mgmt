import * as React from "react";
import {
	Autocomplete,
	Box,
	Button,
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
const initialState = {
	showAddCard: false,
	storyid: "",
	taskName: "",
	taskDesc: "",
	taskHrs: "",
	taskOwner: "",
	usersList: [],
	sprintid: "",
	sprintArray: [],
	//
};
const state = initialState;
let taskrows = [];

const getTasks = async (props) => {
	let tasks = [];
	if (props._id !== undefined) {
		let query = `query {tasksbystory(storyid:"${props._id}"){_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted}}`;
		tasks = await queryFunction(query);
		taskrows = tasks.data.tasksbystory;
	} else {
		taskrows = [];
	}
};

const StoryRow = (props) => {
	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = React.useReducer(reducer, initialState);

	const { storyrow } = props;
	let storyid = storyrow._id;
	getTasks(storyrow);

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
	//for initial hours estimate on new task addition
	const handleTaskHrsInput = (e) => {
		setState({ taskHrs: e.target.value });
	};
	const handleTaskOwnerInput = (e, selectedOption, reason) => {
		if (reason === "clear" || selectedOption === null) {
			setState({ taskOwner: "" });
		} else {
			setState({ taskOwner: selectedOption });
		}
	};
	const onTaskAddClicked = async () => {
		// code to add task to db

		let query = `mutation {addtask(taskname:"${state.taskName}",storyid:"${storyid}",taskdetails:"${state.taskDesc}",teammember:"${state.taskOwner._id}",hourscompleted:0,iscompleted:false) {_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted}}`;

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
					<CardContent style={{ flexWrap: "nowrap", overflowX: "scroll" }}>
						<div style={{ textAlign: "center" }}>
							<TextField
								style={{ margin: "1%", width: "90%" }}
								onChange={handleTaskNameInput}
								placeholder="Task Name"
								value={state.taskName}
							/>
						</div>
						<div style={{ textAlign: "center" }}>
							<TextField
								style={{ margin: "1%", width: "90%" }}
								onChange={handleTaskDescInput}
								placeholder="Task Details"
								value={state.taskDesc}
							/>
						</div>
						<div
							style={{
								textAlign: "center",
							}}
						>
							<Autocomplete
								id="userField"
								options={state.usersList}
								getOptionLabel={(option) => option.name}
								onChange={handleTaskOwnerInput}
								renderInput={(params) => (
									<TextField
										style={{
											margin: "1%",
											width: "90%",
											flexWrap: "nowrap",
											overflowX: "scroll",
										}}
										{...params}
										label="Team Member"
										fullWidth="false"
										variant="outlined"
										data-testid="userField"
									/>
								)}
							/>
							<TextField
								style={{ margin: "1%", width: "90%" }}
								onChange={handleTaskHrsInput}
								placeholder="Estimated # Hours"
								value={state.taskHrs}
							/>
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
										<TableCell>Total Hours Completed</TableCell>
										<TableCell>Add to Sprint</TableCell>
										<TableCell>Update Task</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{taskrows.map((taskrow) => (
										<TaskRow
											key={taskrow._id}
											taskrow={taskrow}
											story={storyrow}
										/>
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

const TaskRow = (props) => {
	const { taskrow } = props;
	let taskRowState = {
		taskRowHrs: taskrow.hourscompleted,
		taskRowSprint: "",
		taskRowComplete: taskrow.iscompleted,
	};
	const handleClick = async () => {
		taskRowState.taskRowComplete = !taskRowState.taskRowComplete;
		let query = "";
		query = `mutation{updatetask(_id:"${taskrow._id}", taskname:"${taskrow.taskname}", storyid:"${taskrow.storyid}", taskdetails:"${taskrow.taskdetails}", teammember:"${taskrow.teammember}", hourscompleted:${taskrow.hourscompleted}, iscompleted:${taskRowState.taskRowComplete}) {_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted  }}`;
		await queryFunction(query);
	};

	const handleHrsInput = (e) => {
		taskRowState.taskRowHrs = e.target.value;
	};
	const handleSprintChange = (e, selectedOption, reason) => {
		//update assigned user
		if (reason === "clear" || selectedOption === null) {
			taskRowState.taskRowSprint = "";
		} else {
			taskRowState.taskRowSprint = selectedOption._id;
		}
	};
	const updateTask = async () => {
		let query = "";
		query = `mutation{updatetask(_id:"${taskrow._id}", taskname:"${taskrow.taskname}", storyid:"${taskrow.storyid}", taskdetails:"${taskrow.taskdetails}", teammember:"${taskrow.teammember}", hourscompleted:${taskRowState.taskRowHrs}, iscompleted:${taskrow.iscompleted}) {_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted  }}`;
		await queryFunction(query);
		if (taskRowState.taskRowSprint !== "") {
			//update story to include new sprint
			//TODO - GET THIS WORKING TO ADD SPRINT TO ARRAY WITHIN STORY OBJECT-----------------------------------------------------------------------------------------
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------
			//-----------------------------------------------------------------------------------------------------------------------------------
			//get story info from props
			const story = props.story;
			const sprints = story.sprints;
			sprints.push(taskRowState.taskRowSprint);

			query = `mutation{updatestory(_id:"${story._id}", storyname:"${story.storyname}", storydescription:"${story.storydescription}", sprints:"${sprints}", storypoints:${story.storypoints}, costperhour:${story.costperhour}, priority:${story.priority}, tasks:"${story.tasks}") {_id, storyname, storydescription, sprints, storypoints, costperhour, priority, tasks  }}`;
			await queryFunction(query);
		}

		//reset fields
		taskRowState = {
			taskRowHrs: taskrow.hourscompleted,
			taskRowSprint: "",
			taskRowComplete: taskrow.iscompleted,
		};
	};
	function selectName(id) {
		let userName = "";
		state.usersList.forEach((user) => {
			if (id === user._id) userName = user.name;
		});

		return userName;
	}

	return (
		<React.Fragment>
			<TableRow
				hover
				// onClick={(event) => handleClick(event, taskrow._id)}
				role="checkbox"
				// aria-checked={taskRowState.taskRowComplete}
				tabIndex={-1}
				key={taskrow._id}
				// selected={taskRowState.taskRowComplete}
				sx={{ cursor: "pointer" }}
			>
				{" "}
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						checked={taskRowState.taskRowComplete}
						aria-checked={taskRowState.taskRowComplete}
						onChange={handleClick}
					/>
				</TableCell>
				<TableCell component="th" scope="taskrow">
					{taskrow.taskname}
				</TableCell>
				<TableCell>{taskrow.taskdetails}</TableCell>
				<TableCell>{selectName(taskrow.teammember)}</TableCell>
				<TableCell>
					<TextField onChange={handleHrsInput} label={taskrow.hourscompleted} />
				</TableCell>
				<TableCell>
					<Autocomplete
						id="rowSprintField"
						options={state.sprintArray}
						getOptionLabel={(option) => option.sprintname}
						onChange={handleSprintChange}
						//
						renderInput={(params) => (
							<TextField
								style={{
									margin: "1%",
									width: "90%",
									flexWrap: "nowrap",
									overflowX: "scroll",
								}}
								{...params}
								label="add to sprint"
								fullWidth="false"
								variant="outlined"
								data-testid="sprintField"
							/>
						)}
					/>
				</TableCell>
				<TableCell>
					<Button
						style={{ margin: "1%", width: "25%" }}
						color="secondary"
						variant="contained"
						onClick={updateTask}
					>
						Update
					</Button>
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
	state.usersList = props.usersForTable;
	state.sprintid = props.sprintForTable._id;
	state.sprintArray = props.sprintArrayForTable;
	return (
		<TableContainer component={Paper}>
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
					{rows.map((storyrow) => (
						<StoryRow key={storyrow._id} storyrow={storyrow} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TaskTableComponent;
