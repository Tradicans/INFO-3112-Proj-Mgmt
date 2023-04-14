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
import queryFunction from "./queryfunction";

const ProjectInfoInputComponent = (props) => {
  //props to be used to send info to other components as needed
  const initialState = {
    teamName: "",
    productName: "",
    startDate: "",
    hoursPerStoryPt: "",
    storyPtEst: "",
    costEst: "",
    endDate: "",
    productOwner: "",
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const sendSnack = (msg) => {
    props.dataFromProjInfo(msg);
  };
  const onAddClicked = async () => {
    //code to send info to db here
    //todo: add empty values for missing properties to complete schema
    //todo: test query functionality
    //todo: add conversions for non-string values
    let query = `mutation {addproduct(productname: "${state.productName}",teamname: "${state.teamName}", startdate: "${state.startDate}", enddate: "${state.endDate}" , productowner:"${state.productOwner}", hoursperstorypoint: ${state.hoursPerStoryPt}, estimatestorypoints: ${state.storyPtEst}, estimatetotalcost: ${state.costEst}, sprints: [] ){ _id, productname, teamname, startdate, hoursperstorypoint, estimatestorypoints, estimatetotalcost }}`;

    let product = await queryFunction(query);

    let sprintquery = `mutation {addsprint(productid:"${product.data.addproduct._id}",sprintname:"Backlog",startdate:"${state.startDate}",stories:[],enddate:"",iscompleted:false) {_id, productid, sprintname, startdate, enddate, iscompleted}}`;
    let backlog = await queryFunction(sprintquery);
    query = `mutation {updateproduct(_id: "${product.data.addproduct._id}", productname: "${state.productName}",teamname: "${state.teamName}", startdate: "${state.startDate}", enddate: "${state.endDate}" , productowner:"${state.productOwner}", hoursperstorypoint: ${state.hoursPerStoryPt}, estimatestorypoints: ${state.storyPtEst}, estimatetotalcost: ${state.costEst}, sprints:["${backlog.data.addsprint._id}"] ){ productname, teamname, startdate, hoursperstorypoint, estimatestorypoints, estimatetotalcost, sprints }}`;
    //reset text entry fields
    await queryFunction(query);
    //reset text entry fields
    setState({
      teamName: "",
      productName: "",
      startDate: "",
      hoursPerStoryPt: "",
      storyPtEst: "",
      costEst: "",
      endDate: "",
      productOwner: "",
    });
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
    state.productName === "" ||
    state.startDate === undefined ||
    state.startDate === "" ||
    state.hoursPerStoryPt === undefined ||
    state.hoursPerStoryPt === "" ||
    state.storyPtEst === undefined ||
    state.storyPtEst === "" ||
    state.costEst === undefined ||
    state.costEst === "" ||
    state.endDate === undefined ||
    state.endDate === "" ||
    state.productOwner === undefined ||
    state.productOwner === "";
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
              style={{ margin: "1%", width: "48%" }}
              onChange={handleTeamNameInput}
              placeholder="Team Name"
              value={state.teamName}
            />

            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={handleProdNameInput}
              placeholder="Product Name"
              value={state.productName}
            />
          </div>
          <div>
            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={(e) => setState({ productOwner: e.target.value })}
              placeholder="Product Owner"
              value={state.productOwner}
            />

            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={handleHoursPerSTInput}
              placeholder="#Hours/Story Point"
              value={state.hoursPerStoryPt}
            />
          </div>
          <div>
            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={handleSPEstInput}
              placeholder="Total Story Point Estimate"
              value={state.storyPtEst}
            />

            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={handleCostEstInput}
              placeholder="Total Cost Estimate"
              value={state.costEst}
            />
          </div>
          <div>
            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={handleStartDateInput}
              placeholder="Project Start Date"
              value={state.startDate}
            />

            <TextField
              style={{ margin: "1%", width: "48%" }}
              onChange={(e) => setState({ endDate: e.target.value })}
              placeholder="Estimated Project End Date"
              value={state.endDate}
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
