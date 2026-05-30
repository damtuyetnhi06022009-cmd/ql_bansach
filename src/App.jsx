import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DetailProduct from './components/Products/DetailProduct';
import ProductList from "./components/Products/ProductList";
import Cart from "./components/Pages/Cart";
import Login from "./components/Pages/Login"
import Profile from './components/Pages/profile';
import Admin from './components/Pages/Admin';
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

        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;