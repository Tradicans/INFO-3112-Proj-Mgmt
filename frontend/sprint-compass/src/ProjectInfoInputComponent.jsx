import React, { useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
	Card,
	CardHeader,
	CardContent,
	TextField,
	Button,
} from "@mui/material";
import theme from "./theme";
import "./App.css";
import HomeComponent from "./HomeComponent";

const ProjectInfoInputComponent = (props) => {
	//props to be used to send info to other components as needed
	const initialState = {
		teamName: "",
		productName: "",
		startDate: "",
		hoursPerStoryPt: 0,
		storyPtEst: "",
		costEst: "",
	};
	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);
	const onAddClicked = async () => {
		//code to send info to db here
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		try {
			//    addproduct(productname: String, startdate: String, endate: String, productowner: String, teammembers: [String], hoursperstorypoint: Int, estimatestorypoints: Int, estimatetotalcost: String, iscompleted: String): Product,

			let query = JSON.stringify({
				query: `mutation {addproduct(productname: "${state.productName}",teamname: "${state.teamName}", startdate: "${state.startDate}", hoursperstorypoint: "${state.hoursPerStoryPt}", estimatestorypoints: "${state.storyPtEst}", estimatetotalcost: "${state.costEst}" ) 
           { productname, teamname, startdate, hoursperstorypoint, estimatestorypoints, estimatetotalcost }}`,
			});
			console.log(query);
			let response = await fetch("http://localhost:5000/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
				body: query,
			});
			let json = await response.json();
			//
			//reset text entry fields
			setState({
				teamName: "",
				productName: "",
				startDate: "",
				hoursPerStoryPt: "",
				storyPtEst: "",
				costEst: "",
			});
		} catch (error) {
			//code for error message to user here - use snackbox?
			//reset text entry fields
			setState({
				teamName: "",
				productName: "",
				startDate: "",
				hoursPerStoryPt: "",
				storyPtEst: "",
				costEst: "",
			});
		}
	};
	const handleTeamNameInput = (e) => {
		setState({ teamName: e.target.value });
	};
	const handleProdNameInput = (e) => {
		setState({ productName: e.target.value });
	};
	const handleStartDateInput = (e) => {
		setState({ startDate: e.target.value });
	};
	const handleHoursPerSTInput = (e) => {
		setState({ hoursPerStoryPt: e.target.value });
	};
	const handleSPEstInput = (e) => {
		setState({ storyPtEst: e.target.value });
	};
	const handleCostEstInput = (e) => {
		setState({ costEst: e.target.value });
	};
	const emptyorundefined =
		state.teamName === undefined ||
		state.teamName === "" ||
		state.productName === undefined ||
		state.productName === "";
	state.startDate === undefined || state.startDate === "";
	state.hoursPerStoryPt === undefined || state.hoursPerStoryPt === "";
	state.storyPtEst === undefined || state.storyPtEst === "";
	state.costEst === undefined || state.costEst === "";
	return (
		<ThemeProvider theme={theme}>
			<Card className="card">
				<HomeComponent />
				<CardHeader
					title="Project Information Input"
					style={{ color: theme.palette.primary.main, textAlign: "center" }}
				/>
				<CardContent>
					<div>
						<TextField
							style={{ margin: "1vw" }}
							onChange={handleTeamNameInput}
							placeholder="Team Name"
							value={state.teamName}
						/>

						<TextField
							style={{ margin: "1vw" }}
							onChange={handleProdNameInput}
							placeholder="Product Name"
							value={state.productName}
						/>
					</div>
					<div>
						<TextField
							style={{ margin: "1vw" }}
							onChange={handleStartDateInput}
							placeholder="Project Start Date"
							value={state.startDate}
						/>

						<TextField
							style={{ margin: "1vw" }}
							onChange={handleHoursPerSTInput}
							placeholder="#Hours/Story Point"
							value={state.hoursPerStoryPt}
						/>
					</div>
					<div>
						<TextField
							style={{ margin: "1vw" }}
							onChange={handleSPEstInput}
							placeholder="Total Story Point Estimate"
							value={state.storyPtEst}
						/>

						<TextField
							style={{ margin: "1vw" }}
							onChange={handleCostEstInput}
							placeholder="Total Cost Estimate"
							value={state.costEst}
						/>
					</div>
					<p></p>
					<div style={{ textAlign: "center" }}>
						<Button
							color="secondary"
							variant="contained"
							onClick={onAddClicked}
							disabled={emptyorundefined}
						>
							Add Project
						</Button>
					</div>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};
export default ProjectInfoInputComponent;
