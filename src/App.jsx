import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectRoute";
import Nav from "./pages/components/Nav";
import Home from "./pages/Home";
import Signin from "./pages/accounts/Signin";
import SignUp from "./pages/accounts/SignUp";
import Eid from "./pages/Eid";
import EditInfo from "./pages/backend/Edit-info";
import ChangePassword from "./pages/backend/Change-pw";
import ForgetPw from "./pages/accounts/Forget-pw";
import Wallet from "./pages/Tabs/Wallet";
import About from "./pages/Tabs/About";
import Issue from "./pages/Tabs/Issue";
import ActivityConveyIdeas from "./pages/Tabs/Activity_convey_ideas";
import ActivityParticipation from "./pages/Tabs/Activity_participation";
import SocialImpactFrom from "./pages/Tabs/components/Social_impact_form";
import FootPrint from "./pages/Tabs/Foot_print";

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
            <Route path="foot_print" element={<FootPrint />} />
            <Route
              path="issue/tasks/activity_convey_ideas/:id"
              element={<ActivityConveyIdeas />}
            />
            <Route
              path="issue/tasks/activity_participation/:id"
              element={<ActivityParticipation />}
            />
          </Route>
          <Route path="social-impact/:id" element={<SocialImpactFrom />} />
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
