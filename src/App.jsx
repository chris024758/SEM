import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import ListingDetail from './pages/ListingDetail';
import PostListing from './pages/PostListing';
import Search from './pages/Search';
import Admin from './pages/Admin';
import SellerProfile from './pages/SellerProfile';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/post" element={<PostListing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:id" element={<SellerProfile />} />
        <Route path="/messages" element={<Chat />} />
        <Route path="/messages/:targetId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
