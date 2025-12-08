import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Homepage from './landing_page/home/HomePage';
import PricingPage from './landing_page/pricing/PricingPage';
import AboutPage from './landing_page/about/AboutPage';
import Productpage from './landing_page/product/Productpage';
import Signup from './landing_page/signup/Signup';
import Supportpage from './landing_page/support/Supportpage';
import Notfound from './landing_page/Notfound';



  // ✅ DASHBOARD IMPORT

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './landing_page/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/productpage" element={<Productpage />} />
        <Route path="/pricingpage" element={<PricingPage />} />
        <Route path="/supportpage" element={<Supportpage />} />
        <Route path="/Login" element={<Login />} />

      

        <Route path="/*" element={<Notfound />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  </React.StrictMode>
);
