import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DashboardPage from "./pages/Dashboard";
import JournalPage from "./pages/Journal";
import ProfilePage from "./pages/Profile";
import ClimatePage from "./pages/Climate";
import CCTVPage from "./pages/CCTV";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <DashboardPage />
      </Route>
      <Route exact path="/register">
        <SignUp />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/journal">
        <JournalPage />
      </Route>
      <Route exact path="/climate">
        <ClimatePage />
      </Route>
      <Route exact path="/profile">
        <ProfilePage />
      </Route>
      <Route exact path="/cctv">
        <CCTVPage />
      </Route>
    </Switch>
  );
}

export default App;
