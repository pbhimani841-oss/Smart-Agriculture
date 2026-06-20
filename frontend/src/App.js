import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import FarmerSignup from './pages/FarmerSignup';
import CustomerSignup from './pages/CustomerSignup';

import { FarmerProfile, CustomerProfile } from './pages/ProfileElements';

import AdminDashboard from './pages/AdminDashboard';
import { FarmersList, CustomersList } from './pages/UserLists';

import QueryPage from './pages/QueryPage';
import AdminQueries from './pages/AdminQueries';

import ChatPage from './pages/ChatPage';
import WeatherPage from './pages/WeatherPage';
import TradeCropsPage from './pages/TradeCropsPage';
import SellingHistoryPage from './pages/SellingHistoryPage';
import OfferRequestsPage from './pages/OfferRequestsPage';
import MarketplacePage from './pages/MarketplacePage';
import MyOffersPage from './pages/MyOffersPage';
import CustomerBuyingHistoryPage from './pages/CustomerBuyingHistoryPage';
import AdminCropStocksPage from './pages/AdminCropStocksPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import CropRecommendationPage from './pages/CropRecommendationPage';
import FertilizerRecommendationPage from './pages/FertilizerRecommendationPage';
import YieldPredictionPage from './pages/YieldPredictionPage';
import RainfallPredictionPage from './pages/RainfallPredictionPage';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Guest Only Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup/farmer" element={!user ? <FarmerSignup /> : <Navigate to="/" />} />
          <Route path="/signup/customer" element={!user ? <CustomerSignup /> : <Navigate to="/" />} />

          {/* Protected Routes for Farmer */}
          <Route path="/farmer/profile" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <FarmerProfile />
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <ChatPage />
            </PrivateRoute>
          } />
          <Route path="/weather" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <WeatherPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/recommend/crop" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <CropRecommendationPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/recommend/fertilizer" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <FertilizerRecommendationPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/predict/yield" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <YieldPredictionPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/predict/rainfall" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <RainfallPredictionPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/trade-crops" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <TradeCropsPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/selling-history" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <SellingHistoryPage />
            </PrivateRoute>
          } />
          <Route path="/farmer/offers" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <OfferRequestsPage />
            </PrivateRoute>
          } />

          {/* Protected Routes for Customer */}
          <Route path="/customer/profile" element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerProfile />
            </PrivateRoute>
          } />
          <Route path="/customer/marketplace" element={
            <PrivateRoute allowedRoles={['customer']}>
              <MarketplacePage />
            </PrivateRoute>
          } />
          <Route path="/customer/my-offers" element={
            <PrivateRoute allowedRoles={['customer']}>
              <MyOffersPage />
            </PrivateRoute>
          } />
          <Route path="/customer/buying-history" element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerBuyingHistoryPage />
            </PrivateRoute>
          } />

          {/* Queries (Accessible by Customer and Farmer) */}
          <Route path="/queries" element={
            <PrivateRoute allowedRoles={['customer', 'farmer']}>
              <QueryPage />
            </PrivateRoute>
          } />

          {/* Protected Routes for Admin */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/farmers" element={
            <PrivateRoute allowedRoles={['admin']}>
              <FarmersList />
            </PrivateRoute>
          } />
          <Route path="/admin/customers" element={
            <PrivateRoute allowedRoles={['admin']}>
              <CustomersList />
            </PrivateRoute>
          } />
          <Route path="/admin/queries" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminQueries />
            </PrivateRoute>
          } />
          <Route path="/admin/crop-stocks" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminCropStocksPage />
            </PrivateRoute>
          } />
          <Route path="/admin/orders" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminOrdersPage />
            </PrivateRoute>
          } />

        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ToastContainer />
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
