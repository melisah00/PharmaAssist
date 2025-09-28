'use client'

import { useEffect, useState } from "react"
import {
  Box, Paper, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Select, MenuItem,
  Button, Modal, CircularProgress, Fade, Alert, alpha
} from "@mui/material"
import { useAuth } from "@/components/AuthProvider"

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

export default function MyTaskTable() {
  const { user } = useAuth() // Dohvat ulogovanog korisnika
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTask, setModalTask] = useState(null)

  const fetchTasks = async () => {
    if (!user) return // ako user nije učitan, ne fetchuj
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:8000/tasks/user/${user.id}`, {
        credentials: 'include' // šalje cookie
      })
      if (!res.ok) throw new Error("Failed to fetch tasks")
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: 'include'
      })
      if (!res.ok) throw new Error("Failed to update task status")
      fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const openModal = (task) => { setModalTask(task); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setModalTask(null) }

  useEffect(() => { fetchTasks() }, [user])

  if (!user) return <CircularProgress sx={{ mt: 4 }} /> // čekaj dok user nije učitan

  return (
    <Box sx={{ minHeight: "100vh", background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.lightGray} 50%, ${colors.lightPurple} 100%)`, py: 6, px: 2 }}>
      <Fade in={true} timeout={800}>
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: "0 6px 25px rgba(0,0,0,0.15)", backgroundColor: alpha(colors.background, 0.9), backdropFilter: "blur(8px)", border: `1px solid ${alpha(colors.lightGray, 0.4)}` }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: colors.primary }}>
            My Tasks
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {loading && <CircularProgress sx={{ mb: 2 }} />}

          <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3, overflow: "hidden", backgroundColor: alpha(colors.background, 0.9) }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})` }}>
                  {["ID", "Title", "Description", "Status"].map(h => (
                    <TableCell key={h} sx={{ color: "white", fontWeight: "bold", borderBottom: "none" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((t, idx) => (
                  <TableRow key={t.id} sx={{ backgroundColor: idx % 2 === 0 ? alpha(colors.background, 0.3) : alpha(colors.background, 0.2), "&:hover": { backgroundColor: alpha(colors.primary, 0.05) } }}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell onClick={() => openModal(t)} sx={{ cursor: "pointer", color: colors.primary }}>{t.title}</TableCell>
                    <TableCell onClick={() => openModal(t)} sx={{ cursor: "pointer", color: colors.darkGray }}>{t.description}</TableCell>
                    <TableCell>
                      <Select
                        value={t.status}
                        onChange={e => updateTaskStatus(t.id, e.target.value)}
                        size="small"
                        sx={{ minWidth: 140, borderRadius: 2, "& .MuiSelect-select": { py: 1 } }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal open={modalOpen} onClose={closeModal}>
            <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "90%", sm: 500 }, p: 4, borderRadius: 3, boxShadow: 24, backgroundColor: alpha(colors.background, 0.95) }}>
              {modalTask && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: colors.primary }}>Task Details</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Title:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{modalTask.title}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Description:</Typography>
                  <Typography variant="body1">{modalTask.description}</Typography>
                  <Box sx={{ mt: 3, textAlign: "right" }}>
                    <Button onClick={closeModal} variant="contained" sx={{ background: colors.primary, color: "#fff", "&:hover": { background: colors.darkGray } }}>
                      Close
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Modal>
        </Paper>
      </Fade>
    </Box>
  )
}
