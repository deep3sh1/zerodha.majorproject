import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  const [userLoaded, setUserLoaded] = useState(false);

 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const username = params.get("username");

  if (token && username) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ username }));
    window.history.replaceState({}, document.title, "/"); // clean URL
  }
}, []);


  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>

      <div className="content">
        <Routes>
          <Route index element={<Summary />} />
          <Route path="orders" element={<Orders />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="positions" element={<Positions />} />
          <Route path="funds" element={<Funds />} />
          <Route path="apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
