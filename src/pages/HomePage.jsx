import React from "react";
import { Outlet } from "react-router-dom";
import PageNav from "../components/PageNav";

const HomePage = () => {
  return (
    <main>
      <PageNav />
      <Outlet />
    </main>
  );
};

export default HomePage;
