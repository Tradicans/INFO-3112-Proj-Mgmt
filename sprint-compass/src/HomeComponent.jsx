import { React } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Card, CardHeader, CardContent } from "@mui/material";
import theme from "./theme";
import "./App.css";
import "./index.css";
import compass from "./assets/compassrose.png";

const HomeComponent = () => {
	return (
		<ThemeProvider theme={theme}>
			<Card style={{ margin: 0, width: "100vw" }}>
				<CardHeader />
				<CardContent style={{ textAlign: "center" }}>
					<div>
						<img
							src={compass}
							className="logo"
							alt="compass rose"
							width={"30%"}
						/>
					</div>
					<div>
						<h3>Sprint Compass</h3>
					</div>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};
export default HomeComponent;
