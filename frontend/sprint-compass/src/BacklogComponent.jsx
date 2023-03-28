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

const BacklogComponent = (props) => {
  const initialState = {
    showAddCard: false,
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
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  //todo: uncomment when query can be used
  useEffect(() => {
    readProductArray();
  }, []);
  const readProductArray = async () => {
    //Grab all products
    let query = `query {products {_id, productname, teamname, startdate, enddate, productowner, teammembers, hoursperstorypoint, estimatestorypoints, estimatetotalcost}}`;
    let json = await queryFunction(query);

    setState({ productList: json.data.products });
  };

  const productSelection = async (e, selectedOption, reason) => {
    if (reason === "clear" || selectedOption === null) {
      setState({ sprintArray: [], selectedProduct: {} });
    }
    //setState({ teamArray: [] });
    // Dropdown list of all products uses this. This selects a product from the options available and takes it's product ID and list of current sprints. Then sets those in state under selectedProduct and sets the teammembers to the teamArray.
    let query = `query{sprintsbyproduct(productid:"${selectedOption._id}") {_id, productid, sprintname, startdate, enddate, iscompleted }}`;
    let json = await queryFunction(query);
    setState({
      selectedProduct: selectedOption,
      sprintArray: json.data.sprintsbyproduct,
    });
  };
  const readStoriesArray = async () => {
    //load existing array if exists
    let query = JSON.stringify({
      query: `query {stories{}}`,
    });
    //todo: test this returns array of stories as expected
    let json = await queryFunction(query);
    setState({ storiesArray: json.data.stories });
    //todo: error handling if needed if array returns null, still need page to load
  };
  const onCancelClicked = () => {
    closeModal();
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
    closeModal();
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
          <Autocomplete
            id="productField"
            options={state.productList}
            getOptionLabel={(option) => option.productname}
            style={{ width: 300 }}
            onChange={productSelection}
            renderInput={(params) => (
              <TextField
                {...params}
                label={state.labelName}
                variant="outlined"
                fullWidth
                data-testid="productField"
              />
            )}
          />
        </CardContent>
        <CardContent>
          {
            <List style={{ color: theme.palette.error.main }}>
              {state.sprintArray.map((sprint, index) => {
                return (
                  <div key={index}>
                    <ListItem>
                      <ListItemText primary={sprint.sprintname} />
                    </ListItem>
                    <Divider />
                  </div>
                );
              })}
            </List>
          }
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
