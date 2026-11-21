import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import SelectBus from "../Pages/SelectBus";
import Details from "../Pages/Details";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import Myticket from "../Pages/Myticket";
import { Private } from "./Private";
import Bookseat from "../Pages/Bookseat";
import Management from "../Pages/Management";

import MiniAI from "../Components/AI/MiniAI";

function AllRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/selectbus" element={<SelectBus />} />
        <Route path="/bookticket/:id" element={<Bookseat />} />
        <Route path="/details/:id" element={<Details />} />
        <Route
          path="/myticket"
          element={
            <Private>
              <Myticket />
            </Private>
          }
        />
        <Route path="/management" element={<Management />} />
      </Routes>
      <Footer />
      <MiniAI />
    </>
  );
}

export default AllRoutes;
