import React, { useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
	Card,
	CardHeader,
	CardContent,
	IconButton,
	TextField,
	Button,
	Modal,
	List,
	ListItem,
	ListItemText,
	Divider,
} from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import theme from "./theme";
import "./App.css";
import HomeComponent from "./HomeComponent";

const TeamMemberComponent = (props) => {
	const initialState = {
		//test data for ui dev
		teamArray: ["Gavin G", "Ryan M", "Amber R"],
		// teamArray: [],
		showAddCard: false,
		newName: "",
	};
	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);
	const onCancelClicked = () => {
		closeModal();
	};
	const onAddClicked = async () => {
		//todo: code to add team member to db
		//
		//reset name
		setState({ newName: "" });
		closeModal();
	};
	const showModal = () => {
		setState({ showAddCard: true });
	};
	const closeModal = () => {
		setState({ showAddCard: false });
	};
	const handleNewNameInput = (e) => {
		setState({ newName: e.target.value });
	};
	const emptyorundefined = state.newName === undefined || state.newName === "";
	return (
		<ThemeProvider theme={theme}>
			<Card className="card">
				<HomeComponent />
				<Modal open={state.showAddCard}>
					<Card className="card">
						<CardHeader
							title="Add Team Member"
							style={{ color: theme.palette.primary.main, textAlign: "center" }}
						/>
						<CardContent>
							<div style={{ textAlign: "center" }}>
								<TextField
									style={{ margin: "1vw" }}
									onChange={handleNewNameInput}
									placeholder="Team Member Name"
									value={state.newName}
								/>
							</div>
							<div style={{ textAlign: "center" }}>
								<Button
									color="secondary"
									variant="contained"
									onClick={onCancelClicked}
								>
									Cancel
								</Button>
								<Button
									color="secondary"
									variant="contained"
									onClick={onAddClicked}
									disabled={emptyorundefined}
								>
									Add
								</Button>
							</div>
						</CardContent>
					</Card>
				</Modal>
				<CardHeader
					title="Team Members"
					style={{ color: theme.palette.primary.main, textAlign: "center" }}
				/>
				<CardContent>
					<List style={{ color: theme.palette.error.main }}>
						{state.teamArray.map((name, index) => {
							return (
								<div key={index}>
									<ListItem>
										<ListItemText primary={name} />
									</ListItem>
									<Divider />
								</div>
							);
						})}
					</List>
					<IconButton
						color="secondary"
						style={{ marginTop: 50, float: "right" }}
						onClick={showModal}
					>
						<AddCircle fontSize="large" />
					</IconButton>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};

export default TeamMemberComponent;
