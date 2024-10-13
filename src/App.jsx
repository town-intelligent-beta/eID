//import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./pages/components/Nav";
import Home from "./pages/Home";
import Signin from "./pages/Signin";

function App() {
  return (
    <div className="mx-auto border-main border-8 w-full">
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/signin" element={<Signin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
