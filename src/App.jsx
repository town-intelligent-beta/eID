//import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./pages/components/Nav";
import Home from "./pages/Home";
import Signin from "./pages/accounts/Signin";
import SignUp from "./pages/accounts/SignUp";
import Eid from "./pages/eid";

function App() {
  return (
    <div className="mx-auto border-main border-8 w-full">
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/signin" element={<Signin />} />
          <Route path="/accounts/signup" element={<SignUp />} />
          <Route path="/eid" element={<Eid />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
