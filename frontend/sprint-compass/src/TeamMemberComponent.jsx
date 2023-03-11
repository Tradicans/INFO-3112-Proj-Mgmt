import React, { useReducer, useEffect } from "react";
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
import queryFunction from "./queryfunction";

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
	//todo: uncomment when query can be used
	// useEffect(() => {
	// 	readTeamArray();
	// }, []);
	const readTeamArray = async () => {
		//load existing array if exists
		let query = JSON.stringify({
			query: `query {products{teammembers}}`,
		});
		let json = await queryFunction(query);
		//todo: check this returns just the team array of names as expected
		setState({ teamArray: json.data.products.teammembers });
		//todo: error handling if needed if query returns null, still need page to load
	};
	const onCancelClicked = () => {
		closeModal();
	};
	const onAddClicked = async () => {
		//todo: code to add team member to db
		//need to pull existing array with one query, add teammember, then a second query to return modified array?
		let query = JSON.stringify({
			query: ``,
		});
		let json = await queryFunction(query);
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
									style={{ margin: "1vw", width: "52vw" }}
									onChange={handleNewNameInput}
									placeholder="Team Member Name"
									value={state.newName}
								/>
							</div>
							<div style={{ textAlign: "center" }}>
								<Button
									style={{ margin: "1vw", width: "25vw" }}
									color="secondary"
									variant="contained"
									onClick={onCancelClicked}
								>
									Cancel
								</Button>
								<Button
									style={{ margin: "1vw", width: "25vw" }}
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
					<List style={{ color: theme.palette.secondary.main }}>
						{state.teamArray.map((name, index) => {
							return (
								<div key={index}>
									<ListItem style={{ textAlign: "center" }}>
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
