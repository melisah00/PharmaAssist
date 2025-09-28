"use client"

import { useEffect, useState } from "react"
import {
  Box, Paper, Typography, TextField, Button, Alert,
  CircularProgress, Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, Select, MenuItem, Fade, alpha
} from "@mui/material"


const colors = {
  primary: "#275DAD",
  secondary: "#ABA9C3",
  background: "#FCF7F8",
  lightGray: "#CED3DC",
  darkGray: "#5B616A",
  lightPurple: "#EAE9F2",
  success: "#4caf50",
  error: "#f44336"
}

export default function TechniciansTable() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ first_name: "", last_name: "", username: "", email: "", password: "" })

  const fetchTechnicians = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:8000/technicians")
      if (!res.ok) throw new Error("Failed to fetch technicians")
      const data = await res.json()
      setTechnicians(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTechnician = async () => {
    if (!form.first_name || !form.last_name || !form.username || !form.email || !form.password) {
      setError("All fields are required")
      return
    }
    try {
      setError(null)
      const res = await fetch("http://localhost:8000/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "technician", password: form.password }),
      })
      if (!res.ok) throw new Error("Failed to add technician")
      setForm({ first_name: "", last_name: "", username: "", email: "", password: "" })
      fetchTechnicians()
    } catch (err) {
      setError(err.message)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8000/technicians/${id}/status?status=${status}`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("Failed to update status")
      fetchTechnicians()
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  return (
    <Box sx={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.lightGray} 50%, ${colors.lightPurple} 100%)`,
      py: 6,
      px: 2
    }}>
      <Fade in={true} timeout={800}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
            backgroundColor: alpha(colors.background, 0.9),
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha(colors.lightGray, 0.4)}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            Manage Technicians
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {loading && <CircularProgress sx={{ mb: 2 }} />}

          {/* Add Technician Form */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} fullWidth />
            <TextField label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} fullWidth />
            <TextField label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} fullWidth />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth />
          </Box>

          <Button
            onClick={addTechnician}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${colors.secondary} 0%, ${colors.primary} 50%, ${colors.darkGray} 100%)`,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
              px: 3,
              py: 1,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.darkGray} 0%, ${colors.primary} 50%, ${colors.secondary} 100%)`,
              },
            }}
          >
            Add Technician
          </Button>

          
          <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3, overflow: "hidden", backgroundColor: alpha(colors.background, 0.9) }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})` }}>
                  {["ID", "Name", "Email", "Status", "Action"].map((h) => (
                    <TableCell key={h} sx={{ color: "white", fontWeight: "bold", borderBottom: "none" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {technicians.map((t, idx) => (
                  <TableRow
                    key={t.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? alpha(colors.background, 0.3) : alpha(colors.background, 0.2),
                      "&:hover": { backgroundColor: alpha(colors.primary, 0.05) },
                    }}
                  >
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.first_name} {t.last_name}</TableCell>
                    <TableCell>{t.email}</TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>
                      <Select
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                        size="small"
                        sx={{
                          minWidth: 120,
                          borderRadius: 2,
                          "& .MuiSelect-select": { py: 1 },
                        }}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="on_leave">On Leave</MenuItem>
                        <MenuItem value="vacation">Vacation</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>
    </Box>
  )
}
