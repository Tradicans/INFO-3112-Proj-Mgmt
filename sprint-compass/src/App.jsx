import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
	Toolbar,
	AppBar,
	Menu,
	MenuItem,
	IconButton,
	Typography,
	Snackbar,
} from "@mui/material";

import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import HomeComponent from "./HomeComponent";
import ProjectInfoInputComponent from "./ProjectInfoInputComponent";
import TeamMemberComponent from "./TeamMemberComponent";

const App = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<ThemeProvider theme={theme}>
			<AppBar>
				<Toolbar>
					<Typography variant="h6" color="inerit">
						Sprint Compass
					</Typography>
					<IconButton
						id="menubtn"
						onClick={handleClick}
						color="inherit"
						style={{ marginLeft: "auto", paddingRight: "1vh" }}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem component={NavLink} to="/home" onClick={handleClose}>
							Home
						</MenuItem>
						<MenuItem component={NavLink} to="/infoinput" onClick={handleClose}>
							Project Information Input
						</MenuItem>
						<MenuItem component={NavLink} to="/team" onClick={handleClose}>
							Team Members
						</MenuItem>
					</Menu>
				</Toolbar>
			</AppBar>
			<Routes>
				<Route path="/" element={<HomeComponent />} />
				<Route path="/home" element={<HomeComponent />} />
				<Route path="/infoinput" element={<ProjectInfoInputComponent />} />
				<Route path="/team" element={<TeamMemberComponent />} />
			</Routes>
		</ThemeProvider>
	);
};

export default App;
