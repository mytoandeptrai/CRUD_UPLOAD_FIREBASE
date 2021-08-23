import "./App.css";
import { Route, Switch } from "react-router-dom";
import Homepage from "./components/Homepage";
import AddInfo from "./components/AddInfo";
import EditInfo from "./components/EditInfo";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/addUser" component={AddInfo} />
        <Route path="/editUser/:userId" component={EditInfo} />
      </Switch>
    </div>
  );
}

export default App;
