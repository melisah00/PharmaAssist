"use client"
import { useState, useEffect } from "react"
import {
  Box, Container, Paper, Typography, TextField, MenuItem,
  Button, Alert, CircularProgress, Fade, Chip, Grid,
  Card, CardContent, IconButton, AppBar, Toolbar, alpha,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material"
import {
  Assignment, Person, Add, Edit, Clear, Refresh,
  AccessTime, PlayArrow, CheckCircle, Close
} from "@mui/icons-material"

const API_BASE = "http://localhost:8000"

// Boje
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

const statusConfig = {
  pending: { color: colors.lightGray, icon: <AccessTime />, label: "Pending" },
  in_progress: { color: colors.secondary, icon: <PlayArrow />, label: "In Progress" },
  done: { color: colors.success, icon: <CheckCircle />, label: "Done" }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [assignTaskId, setAssignTaskId] = useState(null)
  const [selectedTechnician, setSelectedTechnician] = useState(null)
  const [editTaskId, setEditTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editStatus, setEditStatus] = useState("pending")
  const [loading, setLoading] = useState({ tasks: false, assign: false, create: false, edit: false })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const fetchTasks = async () => {
    setLoading(prev => ({ ...prev, tasks: true }))
    try {
      const res = await fetch(`${API_BASE}/tasks/`)
      if (!res.ok) throw new Error("Failed to fetch tasks")
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }))
    }
  }

  const fetchTechnicians = async () => {
    try {
      const res = await fetch(`${API_BASE}/technicians/`)
      if (!res.ok) throw new Error("Failed to fetch technicians")
      const techs = await res.json()
      setTechnicians(techs)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchTechnicians()
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle || !newTaskDescription) {
      setError("Fill in all fields")
      return
    }
    setLoading(prev => ({ ...prev, create: true }))
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription
        }),
      })
      if (!res.ok) throw new Error("Failed to create task")
      setSuccess("Task created successfully!")
      setNewTaskTitle("")
      setNewTaskDescription("")
      fetchTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, create: false }))
    }
  }

  const handleAssign = async () => {
    if (!assignTaskId || !selectedTechnician) {
      setError("Please select both a task and a technician")
      return
    }

    setLoading(prev => ({ ...prev, assign: true }))
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`${API_BASE}/tasks/${assignTaskId}/assign/${selectedTechnician}`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to assign task")
      setSuccess("Task assigned successfully!")
      setAssignTaskId(null)
      setSelectedTechnician(null)
      fetchTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, assign: false }))
    }
  }

  const handleEditTask = async () => {
    if (!editTitle || !editDescription) {
      setError("Please fill in all fields")
      return
    }

    setLoading(prev => ({ ...prev, edit: true }))
    setError(null)
    setSuccess(null)

    try {
      const url = `${API_BASE}/tasks/${editTaskId}`
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Error response data:", errorData)
        throw new Error("Failed to update task")
      }

      const responseData = await res.json()
      console.log("Success response:", responseData)

      setSuccess("Task updated successfully!")
      setEditDialogOpen(false)
      setEditTaskId(null)
      setEditTitle("")
      setEditDescription("")
      setEditStatus("pending")
      fetchTasks()
    } catch (err) {
      console.error("Error updating task:", err)
      setError(err.message)
    } finally {
      setLoading(prev => ({ ...prev, edit: false }))
    }
  }

  const handleSelectTaskForEdit = (task) => {
    setEditTaskId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditStatus(task.status)
    setEditDialogOpen(true)
  }

  const handleCancelEdit = () => {
    setEditDialogOpen(false)
    setEditTaskId(null)
    setEditTitle("")
    setEditDescription("")
    setEditStatus("pending")
  }

  const currentTask = tasks.find(task => task.id === assignTaskId)

  return (
    <Box sx={{
      py: 4,
      textAlign: "center",
      background: "linear-gradient(135deg, #FCF7F8 0%, #CED3DC 50%, #EAE9F2 100%)",
      mb: 4,
      borderBottom: `1px solid ${colors.lightGray}`,
      marginBottom: "0%"
    }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: colors.primary,
          textAlign: "left",
          marginLeft: "2%"
        }}
      >
        Task Management System
      </Typography>



      <Container maxWidth="xl">
        <Fade in={true} timeout={800}>
          <Box>
            {error && (
              <Alert severity="error" sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: alpha(colors.error, 0.1),
                color: colors.error
              }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: alpha(colors.success, 0.1),
                color: colors.success
              }} onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Left Column - Forms */}
              <Grid item xs={12} md={4}>
                {/* Create Task */}
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colors.lightPurple} 0%, ${alpha(colors.lightPurple, 0.7)} 100%)`,
                  mb: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                }}>
                  <Typography variant="h6" sx={{
                    mb: 3,
                    color: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600
                  }}>
                    <Add sx={{ mr: 1.5, fontSize: 28 }} /> Create New Task
                  </Typography>
                  <Box component="form" onSubmit={handleCreateTask} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                      label="Title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      required
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                    <TextField
                      label="Description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      required
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading.create}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        backgroundColor: colors.primary,
                        '&:hover': {
                          backgroundColor: colors.darkGray,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 8px ${alpha(colors.primary, 0.4)}`
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {loading.create ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Create Task"}
                    </Button>
                  </Box>
                </Paper>


                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colors.lightPurple} 0%, ${alpha(colors.lightPurple, 0.7)} 100%)`,
                  mb: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                }}>
                  <Typography variant="h6" sx={{
                    mb: 3,
                    color: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600
                  }}>
                    <Person sx={{ mr: 1.5, fontSize: 28 }} /> Assign Task
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                      select
                      label="Select Task"
                      value={assignTaskId ?? ""}
                      onChange={(e) => setAssignTaskId(e.target.value === "" ? null : Number(e.target.value))}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    >
                      <MenuItem value="">— None —</MenuItem>
                      {tasks.map(task => (
                        <MenuItem key={task.id} value={task.id}>{task.title}</MenuItem>
                      ))}
                    </TextField>

                    {currentTask && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: alpha(colors.lightGray, 0.3)
                      }}>
                        <Typography variant="body2" sx={{ color: colors.darkGray }}>
                          Currently assigned to:
                        </Typography>
                        <Chip
                          icon={<Person />}
                          label={currentTask.assigned_to ? `${currentTask.assigned_to.first_name} ${currentTask.assigned_to.last_name}` : "Unassigned"}
                          size="small"
                          color={currentTask.assigned_to ? "primary" : "default"}
                          variant={currentTask.assigned_to ? "filled" : "outlined"}
                        />
                      </Box>
                    )}

                    <TextField
                      select
                      label="Select Technician"
                      value={selectedTechnician ?? ""}
                      onChange={(e) => setSelectedTechnician(e.target.value === "" ? null : Number(e.target.value))}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    >
                      <MenuItem value="">— None —</MenuItem>
                      {technicians.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                      variant="contained"
                      onClick={handleAssign}
                      disabled={loading.assign}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        backgroundColor: colors.secondary,
                        '&:hover': {
                          backgroundColor: colors.darkGray,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 8px ${alpha(colors.secondary, 0.4)}`
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {loading.assign ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Assign Task"}
                    </Button>
                  </Box>
                </Paper>
              </Grid>


              <Grid item xs={12} md={8}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${colors.lightPurple} 0%, ${alpha(colors.lightPurple, 0.7)} 100%)`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  height: '100%'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
                      All Tasks ({tasks.length})
                    </Typography>
                    <Button
                      onClick={fetchTasks}
                      disabled={loading.tasks}
                      startIcon={<Refresh />}
                      size="small"
                      sx={{
                        color: colors.primary,
                        '&:hover': {
                          backgroundColor: alpha(colors.primary, 0.1)
                        }
                      }}
                    >
                      Refresh
                    </Button>
                  </Box>

                  {loading.tasks ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: colors.primary }} />
                    </Box>
                  ) : tasks.length === 0 ? (
                    <Typography variant="body2" sx={{
                      textAlign: 'center',
                      py: 4,
                      color: colors.darkGray
                    }}>
                      No tasks available. Create your first task!
                    </Typography>
                  ) : (
                    <TableContainer sx={{
                      maxHeight: '70vh',
                      borderRadius: 2,
                      '& .MuiTableRow-root:hover': {
                        backgroundColor: alpha(colors.primary, 0.05)
                      }
                    }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: colors.lightPurple }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: colors.lightPurple }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: colors.lightPurple }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: colors.lightPurple }}>Assigned To</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: colors.lightPurple }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tasks.map(task => (
                            <TableRow key={task.id} sx={{
                              borderLeft: `4px solid ${statusConfig[task.status].color}`,
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}>
                              <TableCell sx={{ fontWeight: 600, color: colors.primary }}>
                                {task.title}
                              </TableCell>
                              <TableCell sx={{ maxWidth: 300 }}>
                                <Typography variant="body2" sx={{
                                  color: colors.darkGray,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {task.description}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={statusConfig[task.status].icon}
                                  label={statusConfig[task.status].label}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(statusConfig[task.status].color, 0.2),
                                    color: statusConfig[task.status].color,
                                    fontWeight: 500
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={<Person />}
                                  label={task.assigned_to ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : "Unassigned"}
                                  size="small"
                                  color={task.assigned_to ? "secondary" : "default"}
                                  variant={task.assigned_to ? "filled" : "outlined"}
                                  sx={{
                                    backgroundColor: task.assigned_to ? alpha(colors.secondary, 0.2) : undefined,
                                    color: task.assigned_to ? colors.secondary : undefined
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleSelectTaskForEdit(task)}
                                  sx={{
                                    color: colors.primary,
                                    '&:hover': {
                                      backgroundColor: alpha(colors.primary, 0.1)
                                    }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>


      <Dialog open={editDialogOpen} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: colors.primary,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1.5 }} /> Edit Task
          </Box>
          <IconButton onClick={handleCancelEdit} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
            <TextField
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            />
            <TextField
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            />
            <TextField
              select
              label="Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            >
              {Object.entries(statusConfig).map(([value, config]) => (
                <MenuItem key={value} value={value}>
                  {config.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={handleCancelEdit}
            sx={{
              borderRadius: 2,
              py: 1,
              borderColor: colors.primary,
              color: colors.primary,
              '&:hover': {
                borderColor: colors.darkGray,
                backgroundColor: alpha(colors.primary, 0.1)
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditTask}
            disabled={loading.edit}
            sx={{
              borderRadius: 2,
              py: 1,
              backgroundColor: colors.primary,
              '&:hover': {
                backgroundColor: colors.darkGray,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 8px ${alpha(colors.primary, 0.4)}`
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {loading.edit ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Update Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}