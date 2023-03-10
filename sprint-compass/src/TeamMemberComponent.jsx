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
} from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import theme from "./theme";
import "./App.css";
import HomeComponent from "./HomeComponent";

const TeamMemberComponent = (props) => {
	const initialState = {
		teamArray: [],
		showAddCard: false,
		firstName: "",
		lastName: "",
	};
	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);
	const onAddClicked = async () => {
		let teamMember = {
			firstName: state.firstName,
			lastName: state.lastName,
		};
	};
	return (
		<ThemeProvider theme={theme}>
			<Card className="card">
				<HomeComponent />
				<CardHeader
					title="Team Members"
					style={{ color: theme.palette.primary.main, textAlign: "center" }}
				/>
				<CardContent>
					<Modal isOpen={state.showAddCard}>
						<div>
							<p>test</p>
						</div>
					</Modal>
					<IconButton
						color="secondary"
						style={{ marginTop: 50, float: "right" }}
						// onClick={}
					>
						<AddCircle fontSize="large" />
					</IconButton>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};

export default TeamMemberComponent;
