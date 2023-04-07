import { Route, Routes, BrowserRouter } from "react-router-dom";

import App from "./App";
import SignIn from "./sing_in_up/SignIn";
import SingUp from "./sing_in_up/SignUp";
import HomePage from "./components/HomePage";
import PrivateRoute from "./auth/PrivateRoute";

function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />

        <Route path="signin" element={<SignIn />} />

        <Route path="signup" element={<SingUp />} />

        <Route
          exact
          path="homepage"
          element={<PrivateRoute Component={HomePage} />}
        />

        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;
