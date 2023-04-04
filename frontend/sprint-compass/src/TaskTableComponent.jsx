import * as React from "react";
import {
	Box,
	Collapse,
	Checkbox,
	IconButton,
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
import theme from "./theme";
import "./App.css";
import queryFunction from "./queryfunction";

//**************for dev only
function createData(storyid, name, description, priority, storyPts, cost) {
	return {
		storyid,
		name,
		description,
		priority,
		storyPts,
		cost,
		tasks: [
			{
				taskid: "abc123",
				name: "task1",
				details: "task1 deets",
				teammember: "Amber",
				hrscomplete: 5,
				isComplete: true,
			},
			{
				taskid: "abc456",
				name: "task2",
				details: "task2 deets",
				teammember: "Ryan",
				hrscomplete: 8,
				isComplete: false,
			},
		],
	};
}
function Row(props) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);
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
	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.name}
				</TableCell>
				<TableCell>{row.description}</TableCell>
				<TableCell align="right">{row.priority}</TableCell>
				<TableCell align="right">{row.storyPts}</TableCell>
				<TableCell align="right">{row.cost}</TableCell>
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
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Complete?</TableCell>

										<TableCell>Name</TableCell>
										<TableCell>Details</TableCell>
										<TableCell>Team Member</TableCell>
										<TableCell>Hours Complete</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{/* for prod need to get data from props.dataForTaskTable */}
									{row.tasks.map((taskRow) => (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row.tasks.taskid)}
											role="checkbox"
											aria-checked={taskRow.isComplete}
											tabIndex={-1}
											key={taskRow.taskid}
											selected={taskRow.isComplete}
											sx={{ cursor: "pointer" }}
										>
											{" "}
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													checked={taskRow.isComplete}
													// onChange={onSelectAllClick}
												/>
											</TableCell>
											<TableCell component="th" scope="row">
												{taskRow.name}
											</TableCell>
											<TableCell>{taskRow.details}</TableCell>
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
													value={taskRow.hrscomplete}
												/>
											</TableCell>
											{/* todo: make teammember an autocomplete textbox 											 */}
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
}

//*******************for dev
const rows = [
	createData(1, "Story 1", "First Story", 1, 3, 65.0),
	createData(2, "Story 2", "Second Story", 3, 1, 75.0),
	createData(3, "Story 3", "Third Story", 2, 5, 65.0),
	createData(4, "Story 4", "Fourth Story", 5, 8, 45.0),
	createData(5, "Story 5", "Fifth Story", 4, 2, 65.0),
];

//done: checkboxes on task rows
//todo: tie in checkboxes to isComplete - use mutation

export default function TaskTableComponent(props) {
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
					</TableRow>
				</TableHead>
				<TableBody>
					{/* for prod need to get data from props.dataForTaskTable */}

					{rows.map((row) => (
						<Row key={row.name} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
