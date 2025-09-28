"use client"
import { useState, useEffect } from "react"
import Sidebar from "../Sidebar"
import Header from "../Header"
import Footer from "../Footer"

import TasksPage from "../TasksPage"
import MedicineCRUD from "../MedicineCRUD"
import MyTaskTable from "../MyTaskTable"
import TemperatureHumidity from "../TemperatureHumidity"
import Profile from "../Profile"

const drawerWidth = 260
const collapsedWidth = 70
const headerHeight = 64

export default function TechnicianDashboard() {
  const [open, setOpen] = useState(true)
  const [activePage, setActivePage] = useState("home")

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }

  useEffect(() => {
    const savedPage = getCookie("techActivePage")
    if (savedPage) {
      setActivePage(savedPage)
    }
  }, [])

  const handleSelect = (page) => {
    setActivePage(page)
    document.cookie = `techActivePage=${page}; path=/; max-age=86400` // 1 dan
  }

  const renderContent = () => {
    switch (activePage) {
      case "my_tasks":
        return <MyTaskTable />
      case "medications":
        return <MedicineCRUD />
      case "env_logs":
        return <TemperatureHumidity />
      case "pr":
        return <Profile />
      default:
        return <Profile/>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1" style={{ paddingTop: `${headerHeight}px` }}>
        <Sidebar
          open={open}
          role="technician"
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
          <div className="w-full h-full">{renderContent()}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
