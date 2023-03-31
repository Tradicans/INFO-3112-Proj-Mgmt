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

const BacklogComponent = (props) => {
	const initialState = {
		showAddCard: false,
		storiesArray: [],
		storyName: "",
		storyDescription: "",
		priority: "",
		sprintID: "",
		productID: "",
		teammembers: [],
		storyPts: "",
		costPerHr: "",
		isCompleted: "",
	};

	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);
	const sendSnack = (msg) => {
		props.dataFromBacklog(msg);
	};
	//todo: uncomment when query can be used
	useEffect(() => {
		readStoriesArray();
	}, []);
	const readStoriesArray = async () => {
		//load existing array if exists
		let query = JSON.stringify({
			query: `query {stories{}}`,
		});
		try {
			//todo: test this returns array of stories as expected
			let json = await queryFunction(query);
			setState({ storiesArray: json.data.stories });
		} catch (error) {
			sendSnack(`Problem loading server data - ${error.message}`);
		}
	};
	const resetState = () => {
		setState({
			storyName: "",
			storyDescription: "",
			priority: "",
			sprintID: "",
			productID: "",
			teammembers: [],
			storyPts: "",
			costPerHr: "",
			isCompleted: "",
		});
		closeModal();
	};
	const onCancelClicked = () => {
		resetState();
	};
	const onAddClicked = async () => {
		// code to add story to db
		//todo: add priority
		//todo: change ones not collected from user to preset values
		let query = JSON.stringify({
			query: `mutation {addstory(storyname: "${state.storyName}", storydescription: "${state.storyDescription}", sprintid: "${state.sprintID}", productid: "${state.productID}", storypoints: "${state.storyPts}", costperhour: "${state.costPerHr}", iscompleted: "${state.isCompleted}") 
            {storyname, storydescription, sprintid, productid, storypoints, costperhour, iscompleted},
            }`,
		});
		try {
			let json = await queryFunction(query);
			sendSnack(`${json.data.addstory.storyName} added`);
		} catch (error) {
			sendSnack(`Problem adding story - ${error.message}`);
		}

		resetState();
	};
	const showModal = () => {
		setState({ showAddCard: true });
	};
	const closeModal = () => {
		setState({ showAddCard: false });
	};
	const handleStoryNameInput = (e) => {
		setState({ storyName: e.target.value });
	};
	const handleDescriptionInput = (e) => {
		setState({ storyDescription: e.target.value });
	};
	const handlePriorityInput = (e) => {
		setState({ priority: e.target.value });
	};
	const handleStoryPtsInput = (e) => {
		setState({ storyPts: e.target.value });
	};
	const handleCostInput = (e) => {
		setState({ costPerHr: e.target.value });
	};

	//todo: set up table rather than list for card content
	//use code similar to AR JS case1 advisory list?
	return (
		<ThemeProvider theme={theme}>
			<Card className="card">
				<HomeComponent />
				<Modal open={state.showAddCard}>
					<Card className="card">
						<CardHeader
							title="Add User Story"
							style={{ color: theme.palette.primary.main, textAlign: "center" }}
						/>
						<CardContent>
							<div style={{ textAlign: "center" }}>
								<TextField
									style={{ margin: "1%", width: "48%" }}
									onChange={handleStoryNameInput}
									placeholder="Story Name"
									value={state.storyName}
								/>
								<TextField
									style={{ margin: "1%", width: "48%" }}
									onChange={handlePriorityInput}
									placeholder="Priority"
									value={state.priority}
								/>
							</div>
							<div style={{ textAlign: "center" }}>
								<TextField
									style={{ margin: "1%", width: "98%" }}
									onChange={handleDescriptionInput}
									placeholder="Description: I want to...."
									value={state.storyDescription}
								/>
							</div>
							<div style={{ textAlign: "center" }}>
								<TextField
									style={{ margin: "1%", width: "48%" }}
									onChange={handleStoryPtsInput}
									placeholder="Estimated # Story Points"
									value={state.storyPts}
								/>
								<TextField
									style={{ margin: "1%", width: "48%" }}
									onChange={handleCostInput}
									placeholder="Estimated Cost/Hour"
									value={state.costPerHr}
								/>
							</div>
							<div style={{ textAlign: "center" }}>
								<Button
									style={{ margin: "1%", width: "25%" }}
									color="secondary"
									variant="contained"
									onClick={onCancelClicked}
								>
									Cancel
								</Button>
								<Button
									style={{ margin: "1%", width: "25%" }}
									color="secondary"
									variant="contained"
									onClick={onAddClicked}
								>
									Add
								</Button>
							</div>
						</CardContent>
					</Card>
				</Modal>
				<CardHeader
					title="Backlog"
					style={{ color: theme.palette.primary.main, textAlign: "center" }}
				/>
				<CardContent>
					{/* todo: Change to table
                    <List style={{ color: theme.palette.error.main }}>
						{state.storiesArray.map((name, index) => {
							return (
								<div key={index}>
									<ListItem>
										<ListItemText primary={name} />
									</ListItem>
									<Divider />
								</div>
							);
						})}
					</List> */}
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
export default BacklogComponent;
