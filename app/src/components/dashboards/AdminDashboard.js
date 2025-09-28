"use client"
import { useState, useEffect } from "react"
import Sidebar from "../Sidebar"
import Header from "../Header"
import TechniciansTable from "../TechniciansTable"
import Footer from "../Footer"
import TasksPage from "../TasksPage"
import MedicineTable from "../MedicineTable"
import MedicineCRUD from "../MedicineCRUD"
import TemperatureHumidity from "../AdminTemperatureTable"
import Profile from "../Profile"
import LookupManager from "../LookupManager"

const drawerWidth = 260
const collapsedWidth = 70
const headerHeight = 64

export default function AdminDashboard() {
  const [open, setOpen] = useState(true)
  const [activePage, setActivePage] = useState("home")

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }

  useEffect(() => {
    const savedPage = getCookie("adminActivePage")
    if (savedPage) {
      setActivePage(savedPage)
    }
  }, [])

  const handleSelect = (page) => {
    setActivePage(page)
    document.cookie = `adminActivePage=${page}; path=/; max-age=86400` // 1 dan
  }

  const renderContent = () => {
    switch (activePage) {
      case "pr":
            return <Profile />
      case "employees":
        return <TechniciansTable />
      case "tasks":
        return <TasksPage />
      case "medications":
        return <MedicineTable />
      case "lijekovi":
        return <MedicineCRUD />
        case "temp":
          return <TemperatureHumidity />
          case "med_crud":
            return <MedicineCRUD />
            case "lookup":
              return <LookupManager />
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
          role="admin"
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
        </main>
      </div>
      <Footer />
    </div>
  )
}
