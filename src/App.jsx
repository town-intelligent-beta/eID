//import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectRoute.jsx";
import Nav from "./pages/components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/accounts/Signin.jsx";
import SignUp from "./pages/accounts/SignUp.jsx";
import Eid from "./pages/Eid.jsx";
import EditInfo from "./pages/backend/Edit-info.jsx";
import ChangePassword from "./pages/backend/Change-pw.jsx";
import ForgetPw from "./pages/accounts/Forget-pw.jsx";
import Wallet from "./pages/Tabs/Wallet.jsx";
import About from "./pages/Tabs/About.jsx";
import Issue from "./pages/Tabs/Issue.jsx";

function App() {
  return (
    <div className="mx-auto border-main border-8 w-full min-h-screen">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/signin" element={<Signin />} />
          <Route path="/accounts/signup" element={<SignUp />} />
          <Route path="/accounts/forget-pw" element={<ForgetPw />} />
          <Route
            path="/eid"
            element={
              <ProtectedRoute>
                <Eid />
              </ProtectedRoute>
            }
          >
            <Route path="about" element={<About />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="issue" element={<Issue />} />
          </Route>
          <Route
            path="/backend/edit-info"
            element={
              <ProtectedRoute>
                <EditInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/backend/change-pw"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
