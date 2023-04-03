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

const TeamMemberComponent = (props) => {
  const initialState = {
    //test data for ui dev
    teamArray: ["Gavin G", "Ryan M", "Amber R"],
    // teamArray: [],
    showAddCard: false,
    newName: "",
    selectedProduct: {},
    productList: [],
    newRole: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  //todo: uncomment when query can be used
  useEffect(() => {
    readProductArray();
  }, []);

  const productSelection = async (e, selectedOption, reason) => {
    if (reason === "clear") {
      setState({ teamArray: [], selectedProduct: {} });
    }
    //setState({ teamArray: [] });
    // Dropdown list of all products uses this. This selects a product from the options available and takes it's product ID and list of current users. Then sets those in state under selectedProduct and sets the teammembers to the teamArray.
    let query = ``;
    if (selectedOption !== null) {
      query = `query {usersbyproduct(productid: "${selectedOption._id}"){name, role}}`;
    } else {
      query = `query {usersbyproduct(productid: ""){name, role}}`;
    }
    let json = await queryFunction(query);
    setState({
      selectedProduct: selectedOption,
      teamArray: json.data.usersbyproduct,
    });
  };

  const readProductArray = async () => {
    //Grab all products
    let query = `query {products {_id, productname, teamname, startdate, enddate, productowner, teammembers, hoursperstorypoint, estimatestorypoints, estimatetotalcost}}`;
    let json = await queryFunction(query);

    setState({ productList: json.data.products });
  };

  const readTeamArray = async () => {
    //load existing array if exists
    let query = `query {usersbyproduct(productid: "${state.selectedProduct}")}`;
    let json = await queryFunction(query);
    //todo: check this returns just the team array of names as expected
    setState({ teamArray: json.data.usersbyproduct.name });
    //todo: error handling if needed if query returns null, still need page to load
  };

  const onCancelClicked = () => {
    closeModal();
  };
  const onAddClicked = async () => {
    //todo: code to add team member to db
    //need to pull existing array with one query, add teammember, then a second query to return modified array?
    let query = `mutation{adduser(name:"${state.newName}",role:"${state.newRole}"){_id, name, role}}`;
    let json = await queryFunction(query);
    //reset name
    //state.selectedProduct.teammembers.push(json.data.adduser._id);
    let updateQuery = `mutation{updateuser(_id:"${json.data.adduser._id}", name:"${state.newName}", role: "${state.newRole}", products: "${state.selectedProduct._id}") {_id, name, role}}`;
    let secondJson = await queryFunction(updateQuery);
    if (secondJson !== null) {
      setState({ newName: "", newRole: "" });
      closeModal();
      useEffect();
    }
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
  const handleNewRoleInput = (e) => {
    setState({ newRole: e.target.value });
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
                <TextField
                  style={{ margin: "1vw", width: "52vw" }}
                  onChange={handleNewRoleInput}
                  placeholder="Team Member's Role"
                  value={state.newRole}
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
            {state.teamArray.map((user, index) => {
              return (
                <div key={index}>
                  <ListItem style={{ textAlign: "center" }}>
                    <ListItemText primary={user.name} />
                    <ListItemText primary={user.role} />
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
      </Card>
    </ThemeProvider>
  );
};

export default TeamMemberComponent;
