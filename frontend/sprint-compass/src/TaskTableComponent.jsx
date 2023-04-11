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
let storyRowTasks = [];
const getTasks = async (props) => {
	let query = `query {tasksbystory(storyid:"${props.storyrow._id}"){_id, taskname, storyid, taskdetails, teammember, hourscompleted, iscompleted}}`;
	let task = await queryFunction(query);
	return task.data.tasksbystory;
};
const initialState = {
	showAddCard: false,
};
const state = initialState;

function StoryRow(props) {
	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = React.useReducer(reducer, initialState);
	//let task = getTask(props);

	const { storyrow } = props;
	// let taskrows = getTasks(props);

	// storyRowTasks = await getTasks(props);
	const [open, setOpen] = React.useState(false);

	//todo: move out of scope
	const showModal = () => {
		setState({ showAddCard: true });
	};
	const closeModal = () => {
		setState({ showAddCard: false });
	};
	return (
		<React.Fragment>
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
						// onClick={showModal}
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
								{/* <TableBody>
									{taskrows.map((taskrow) => (
										<TaskRow key={taskrow._id} taskrow={taskrow} />
									))}
								</TableBody> */}
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

async function TaskRow(props) {
	const { taskrow } = props;
	const handleClick = (event, taskid) => {
		//todo: task mutation query
		//change complete status
	};
	const handleUserNameInput = (e) => {
		//todo: task mutation query
		//update assigned user
	};
	const handleHrsInput = (e) => {
		//todo: task mutation query
		//update hrs
	};
	const handleSprintChange = (e) => {
		//todo: story mutation query
		//update sprint array within story
		//todo: sprint mutation query
		//update story array within sprint
	};
	return (
		<React.Fragment>
			<TableRow
				hover
				// onClick={(event) => handleClick(event, taskrow._id)}
				role="checkbox"
				aria-checked={taskrow.iscompleted}
				tabIndex={-1}
				key={index}
				selected={taskrow.iscompleted}
				sx={{ cursor: "pointer" }}
			>
				{" "}
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						checked={taskrow.iscompleted}
						// onChange={onSelectAllClick}
					/>
				</TableCell>
				<TableCell component="th" scope="taskrow">
					{taskrow.taskname}
				</TableCell>
				<TableCell>{taskrow.taskdetails}</TableCell>
				<TableCell>
					<TextField
						onChange={handleUserNameInput}
						placeholder="Team Member"
						value={taskrow.teammember}
					/>
				</TableCell>
				<TableCell>
					<TextField
						onChange={handleHrsInput}
						placeholder="Hours Completed"
						value={taskrow.hourscompleted}
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
		</React.Fragment>
	);
}

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
					{rows.map((storyrow) => (
						<StoryRow key={storyrow._id} storyrow={storyrow} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TaskTableComponent;
