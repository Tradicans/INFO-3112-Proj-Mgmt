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
	Autocomplete,
} from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import theme from "./theme";
import "./App.css";
import HomeComponent from "./HomeComponent";
import queryFunction from "./queryfunction";
import TaskTableComponent from "./TaskTableComponent";

const BacklogComponent = (props) => {
	const initialState = {
		showStoryAddCard: false,
		showSprintAddCard: false,
		sprintArray: [],
		storyName: "",
		storyDescription: "",
		priority: "",
		sprintID: "",
		productID: "",
		teammembers: [],
		storyPts: "",
		costPerHr: "",
		isCompleted: "",
		productList: [],
		selectedSprint: {},
		stories: [],
		sprintName: "",
		sprintStartDate: "",
		sprintEndDate: "",
		selectedProduct: "",
	};

	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);
	useEffect(() => {
		readProductArray();
	}, []);
	const readProductArray = async () => {
		//Grab all products
		let query = `query {products {_id, productname, teamname, startdate, enddate, productowner, teammembers, hoursperstorypoint, estimatestorypoints, estimatetotalcost, sprints}}`;
		let json = await queryFunction(query);

		setState({ productList: json.data.products });
	};

	const productSelection = async (e, selectedOption, reason) => {
		let query = "";
		if (reason === "clear" || selectedOption === null) {
			setState({ sprintArray: [], selectedProduct: {}, users: [] });
		} else {
			query = `query{sprintsbyproduct(productid:"${selectedOption._id}") {_id, productid, sprintname, startdate, enddate, iscompleted }}`;
			let json = await queryFunction(query);
			query = `query{usersbyproduct(productid:"${selectedOption._id}") {_id, name, role, products}}`;
			let users = await queryFunction(query);
			setState({
				selectedProduct: selectedOption,
				sprintArray: json.data.sprintsbyproduct,
				teammembers: users.data.usersbyproduct,
			});
		}
		//setState({ teamArray: [] });
		// Dropdown list of all products uses this. This selects a product from the options available and takes its product ID and list of current sprints. Then sets those in state under selectedProduct and sets the teammembers to the teamArray.
	};
	const readStoriesArray = async (e, selectedOption, reason) => {
		if (reason === "clear" || selectedOption === null) {
			setState({ stories: [], selectedSprint: {} });
		} else {
			//load existing array if exists
			let query = `query {storiesbysprint(sprintid:"${selectedOption._id}"){_id, storyname, storydescription, storypoints, costperhour, priority, tasks}}`;

			let json = await queryFunction(query);
			setState({
				stories: json.data.storiesbysprint,
				selectedSprint: selectedOption,
			});
		}
	};
	const onStoryCancelClicked = () => {
		closeStoryModal();
	};
	const onStoryAddClicked = async () => {
		// code to add story to db

		let query = `mutation {addstory(storyname: "${state.storyName}", storydescription: "${state.storyDescription}", sprints: ["${state.selectedSprint._id}"], storypoints: ${state.storyPts}, costperhour: ${state.costPerHr}, priority: ${state.priority}, tasks: []) 
            {_id, storyname, storydescription, sprints, storypoints, costperhour, priority, tasks},
            }`;
		let story = await queryFunction(query);
		query = `mutation {updatesprint(productid:"${state.selectedProduct._id}",sprintname:"Backlog",startdate:"${state.selectedProduct.startdate}",stories:["${story.data.addstory._id}"],enddate:"",iscompleted:false) {_id, productid, sprintname, startdate, enddate, iscompleted}}`;

		await queryFunction(query);
		//reset state

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
		closeStoryModal();
	};
	const showStoryModal = () => {
		setState({ showStoryAddCard: true });
	};
	const closeStoryModal = () => {
		setState({ showStoryAddCard: false });
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
	const onSprintCancelClicked = () => {
		closeSprintModal();
	};
	const onSprintAddClicked = async () => {
		// code to add sprint to db

		let query = `mutation {addsprint(productid: "${state.selectedProduct._id}", sprintname: "${state.sprintName}", startdate: "${state.sprintStartDate}", enddate: "${state.sprintEndDate}", iscompleted: false, stories: [])
		    {_id, productid, sprintname, startdate, enddate, iscompleted, stories},
		    }`;
		//todo: update product to include sprint
		// let sprint = await queryFunction(query);
		// query = `mutation {updateproduct(productid:"${state.selectedProduct._id}",sprintname:"Backlog",startdate:"${state.selectedProduct.startdate}",stories:["${story.data.addstory._id}"],enddate:"",iscompleted:false) {_id, productid, sprintname, startdate, enddate, iscompleted}}`;

		await queryFunction(query);
		// reset state
		setState({
			sprintName: "",
			sprintStartDate: "",
			sprintEndDate: "",
		});
		closeSprintModal();
	};
	const showSprintModal = () => {
		setState({ showSprintAddCard: true });
	};
	const closeSprintModal = () => {
		setState({ showSprintAddCard: false });
	};
	const handleSprintNameInput = (e) => {
		setState({ sprintName: e.target.value });
	};
	const handleSprintStartDateInput = (e) => {
		setState({ sprintStartDate: e.target.value });
	};
	const handleSprintEndDateInput = (e) => {
		setState({ sprintEndDate: e.target.value });
	};

	return (
		<ThemeProvider theme={theme}>
			<Card className="card">
				<HomeComponent />
				<Modal open={state.showStoryAddCard}>
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
									onClick={onStoryCancelClicked}
								>
									Cancel
								</Button>
								<Button
									style={{ margin: "1%", width: "25%" }}
									color="secondary"
									variant="contained"
									onClick={onStoryAddClicked}
								>
									Add
								</Button>
							</div>
						</CardContent>
					</Card>
				</Modal>
				<Modal open={state.showSprintAddCard}>
					<Card className="card">
						<CardHeader
							title="Add Sprint"
							style={{ color: theme.palette.primary.main, textAlign: "center" }}
						/>
						<CardContent>
							<div style={{ textAlign: "center" }}>
								<TextField
									style={{ margin: "1%", width: "98%" }}
									onChange={handleSprintNameInput}
									placeholder="Sprint Name"
									value={state.sprintName}
								/>
							</div>
							<div style={{ textAlign: "center" }}>
								<TextField
									style={{ margin: "1%", width: "48%" }}
									onChange={handleSprintStartDateInput}
									placeholder="Start Date"
									value={state.sprintStartDate}
								/>
								<TextField
									style={{ margin: "1%", width: "48%" }}
									onChange={handleSprintEndDateInput}
									placeholder="End Date"
									value={state.sprintEndDate}
								/>
							</div>

							<div style={{ textAlign: "center" }}>
								<Button
									style={{ margin: "1%", width: "25%" }}
									color="secondary"
									variant="contained"
									onClick={onSprintCancelClicked}
								>
									Cancel
								</Button>
								<Button
									style={{ margin: "1%", width: "25%" }}
									color="secondary"
									variant="contained"
									onClick={onSprintAddClicked}
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
					<Autocomplete
						id="productField"
						options={state.productList}
						getOptionLabel={(option) => option.productname}
						style={{ width: 300 }}
						onChange={productSelection}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Products"
								variant="outlined"
								fullWidth
								data-testid="productField"
							/>
						)}
					/>
					<Autocomplete
						id="sprintField"
						options={state.sprintArray}
						getOptionLabel={(option) => option.sprintname}
						style={{ width: 300 }}
						onChange={readStoriesArray}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Sprints"
								variant="outlined"
								fullWidth
								data-testid="storyField"
							/>
						)}
					/>
					{/* {
						<List style={{ color: theme.palette.error.main }}>
							{state.stories.map((story, index) => {
								return (
									<div key={index}>
										<ListItem>
											<ListItemText primary={story.storyname} />
										</ListItem>
										<Divider />
									</div>
								);
							})}
						</List>
					} */}
					<TaskTableComponent
						storiesForTable={state.stories}
						usersForTable={state.teammembers}
					/>
				</CardContent>
				<CardContent>
					<div style={{ textAlign: "center" }}>
						<Button
							style={{ margin: "1%", width: "25%" }}
							color="secondary"
							variant="contained"
							onClick={showStoryModal}
						>
							Add Story
						</Button>
						<Button
							style={{ margin: "1%", width: "25%" }}
							color="secondary"
							variant="contained"
							onClick={showSprintModal}
						>
							Add Sprint
						</Button>
					</div>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};
export default BacklogComponent;
/*
 *
 */
