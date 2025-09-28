"use client"

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Snackbar, IconButton, Typography, Box, Fade, Chip,
  LinearProgress, Tooltip, alpha
} from "@mui/material";
import {
  Delete, Edit, Add, Thermostat, Opacity,
  AccessTime, Warning, CheckCircle
} from "@mui/icons-material";
import api from "@/lib/api";


const getTempStatus = (temp) => {
  if (temp < 15) return { status: "Low", color: "primary", icon: <Warning /> };
  if (temp > 25) return { status: "High", color: "error", icon: <Warning /> };
  return { status: "Normal", color: "success", icon: <CheckCircle /> };
};

const getHumidityStatus = (humidity) => {
  if (humidity < 30) return { status: "Low", color: "primary", icon: <Warning /> };
  if (humidity > 70) return { status: "High", color: "error", icon: <Warning /> };
  return { status: "Normal", color: "success", icon: <CheckCircle /> };
};

const TemperatureHumidity = () => {
  const [logs, setLogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editLog, setEditLog] = useState(null);
  const [formData, setFormData] = useState({ temperature: "", humidity: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/temperature-humidity/");
      setLogs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setSnackbar({ open: true, message: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleOpenDialog = (log = null) => {
    setConfirmDelete(false);
    if (log) {
      setEditLog(log);
      setFormData({ temperature: log.temperature, humidity: log.humidity });
    } else {
      setEditLog(null);
      setFormData({ temperature: "", humidity: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editLog) {
        await api.put(`/temperature-humidity/${editLog.id}`, formData);
        setSnackbar({ open: true, message: "Log updated successfully!" });
      } else {
        await api.post("/temperature-humidity/", formData);
        setSnackbar({ open: true, message: "Log created successfully!" });
      }
      fetchLogs();
      handleCloseDialog();
    } catch (err) {
      console.error("Submit error:", err);
      setSnackbar({ open: true, message: "Error saving data" });
    }
  };

  const handleDelete = async () => {
    if (!editLog) return;
    try {
      await api.delete(`/temperature-humidity/${editLog.id}`);
      setSnackbar({ open: true, message: "Log deleted successfully!" });
      fetchLogs();
      handleCloseDialog();
    } catch (err) {
      console.error("Delete error:", err);
      setSnackbar({ open: true, message: "Error deleting data" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #FCF7F8 0%, #CED3DC 50%, #EAE9F2 100%)`,
        py: 6,
        px: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
            backgroundColor: alpha("#fff", 0.9),
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha("#CED3DC", 0.4)}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Thermostat sx={{ mr: 1, color: "#275DAD" }} />
            <Typography variant="h5" fontWeight="bold" color="#275DAD">
              Temperature & Humidity Monitoring
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              mb: 3,
              borderRadius: 3,
              px: 3,
              py: 1,
              background: `linear-gradient(45deg, #ABA9C3, #275DAD, #5B616A)`,
              "&:hover": {
                background: `linear-gradient(45deg, #5B616A, #275DAD, #ABA9C3)`,
              },
            }}
          >
            Add New Log
          </Button>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {/* Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: `linear-gradient(45deg, #ABA9C3, #275DAD)` }}>
                  {["Status", "Temperature (°C)", "Humidity (%)", "Recorded At", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ color: "white", fontWeight: "bold" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="textSecondary">
                        No data available
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Click "Add New Log" to create your first record
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const tempStatus = getTempStatus(log.temperature);
                    const humidityStatus = getHumidityStatus(log.humidity);

                    return (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Chip icon={tempStatus.icon} label={`Temp: ${tempStatus.status}`} size="small" color={tempStatus.color} />
                          <Chip icon={humidityStatus.icon} label={`Humid: ${humidityStatus.status}`} size="small" color={humidityStatus.color} sx={{ ml: 1 }} />
                        </TableCell>
                        <TableCell>{log.temperature}°C</TableCell>
                        <TableCell>{log.humidity}%</TableCell>
                        <TableCell>{new Date(log.recorded_at).toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" onClick={() => handleOpenDialog(log)}>
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setEditLog(log);
                              setConfirmDelete(true);
                              setOpenDialog(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <Fade in={openDialog}>
          <Box>
            <Box
              sx={{
                background: `linear-gradient(45deg, #275DAD, #ABA9C3)`,
                color: "white",
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                {confirmDelete ? "Confirm Deletion" : editLog ? "Edit Log" : "Add New Log"}
              </Typography>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {confirmDelete ? (
                <Typography>Are you sure you want to delete this log?</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField label="Temperature (°C)" type="number" name="temperature" value={formData.temperature} onChange={handleChange} />
                  <TextField label="Humidity (%)" type="number" name="humidity" value={formData.humidity} onChange={handleChange} />
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Cancel
              </Button>
              {!confirmDelete ? (
                <Button onClick={handleSubmit} variant="contained" sx={{ background: `linear-gradient(45deg, #ABA9C3, #275DAD)` }}>
                  {editLog ? "Update" : "Create"}
                </Button>
              ) : (
                <Button onClick={handleDelete} variant="contained" color="error">
                  Delete
                </Button>
              )}
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default TemperatureHumidity;
