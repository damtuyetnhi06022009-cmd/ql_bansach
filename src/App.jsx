import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DetailProduct from './components/Products/DetailProduct';
import ProductList from "./components/Products/ProductList";
import ProductCard from "./components/Products/ProductCard";
import Cart from "./components/Pages/Cart";
import Admin from './components/Pages/Admin';
import AdminBill from './components/Pages/AdminBill';
import AdminCategory from './components/Pages/AdminCategory';
import AdminCustomer from './components/Pages/AdminCustomer';
import AdminEmployee from './components/Pages/AdminEmployee';
import AdminInvoiceDetails from './components/Pages/AdminInvoiceDetails';
import AdminProduct from './components/Pages/AdminProduct';
import Login from "./components/Pages/Login";
import Profile from "./components/Pages/Profile";
import Signup from "./components/Pages/Signup";
import Banner from './components/Banner/Banner';


function App() {
  const location = useLocation();
  const hideChrome =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin';

  return (
    <>
      {!hideChrome && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <ProductList />
            </>
          }
        />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;