"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import MedicineGallery from "../MedicineGallery";
import ShoppingCart from "../ShoppingCart";
import AIChat from "../AIChat";
import Profile from "../Profile";

const drawerWidth = 260;
const collapsedWidth = 70;
const headerHeight = 64;

export default function CustomerDashboard() {
  const [open, setOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const savedPage = getCookie("customerActivePage");
    if (savedPage) {
      setActivePage(savedPage);
    }
  }, []);

  const handleSelect = (page) => {
    setActivePage(page);
    document.cookie = `customerActivePage=${page}; path=/; max-age=86400`; // 1 dan
  };

  const renderContent = () => {
    switch (activePage) {
      case "pr":
        return <Profile />;
      case "shop":
        return <MedicineGallery />;
      case "shopping_cart":
        return <ShoppingCart />;
      case "ai":
        return <AIChat />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Medicine Search</h2>
              <p>Find medicines by name, effect, or other criteria.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">AI Chat Assistant</h2>
              <p>Ask questions about medicines and get professional advice.</p>
            </div> */}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: `${headerHeight}px` }}>
        <Sidebar
          open={open}
          role="customer"
          onToggle={() => setOpen((prev) => !prev)}
          onSelect={handleSelect}
          activePage={activePage}
        />
        <main
          className="flex-1 flex flex-col p-6 overflow-auto"
          style={{
            marginLeft: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
            transition: "margin-left 0.3s ease",
          }}
        >
          {renderContent()}
          <Footer />
        </main>
      </div>
    </div>
  );
}
