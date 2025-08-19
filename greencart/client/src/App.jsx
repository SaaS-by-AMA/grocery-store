import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import Features from './components/Features'
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import AllProducts from './pages/AllProducts';
import AboutUs from './pages/AboutUs';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import FramerHeroCarousel from './components/FramerHeroCarousel';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import PaymentInfo from './pages/PaymentInfo';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import DeliveryInfo from './pages/DelieveryInfo';
import Loading from './components/Loading';
import WhatsAppButton from './components/WhatsappButton';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/order-confirmation';
import Contact from './pages/Contact';

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { isSeller } = useAppContext(); // Removed showUserLogin from destructuring

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {/* Seller paths don't show navbar */}
      {isSellerPath ? null : <Navbar/>} 
      {isSellerPath ? null :<Features/>} 

      {/* Global toast notifications */}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-2 md:px-6 lg:px-10 xl:px-14"}`}>
        <Routes>
          {/* Customer Routes */}
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<AboutUs/>} />
          <Route path='/payment' element={<PaymentInfo/>} />
          <Route path='/delievery' element={<DeliveryInfo/>} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/product/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/contact-us" element={<Contact/>}/>
          
          {/* Seller Routes */}
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
          </Route>

          {/* Utility Routes */}
          <Route path='/loader' element={<Loading/>} />
        </Routes>
      </div>

      {/* Footer and WhatsApp button only for customer paths */}
      {!isSellerPath && <Footer/>}
      {!isSellerPath && <WhatsAppButton />}
    </div>
  )
}

export default App