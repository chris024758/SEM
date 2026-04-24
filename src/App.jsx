import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import ListingDetail from './pages/ListingDetail';
import PostListing from './pages/PostListing';
import Search from './pages/Search';
import Admin from './pages/Admin';
import SellerProfile from './pages/SellerProfile';
import Chat from './pages/Chat';
import Auth from './pages/Auth';
import Saved from './pages/Saved';

// Wrap inner app in SavedProvider so it has access to useAuth
function InnerApp() {
  const { user } = useAuth();
  return (
    <SavedProvider user={user}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/post" element={<PostListing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:id" element={<SellerProfile />} />
        <Route path="/messages" element={<Chat />} />
        <Route path="/messages/:targetId" element={<Chat />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </SavedProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
