"use client"

import { useState, useEffect } from "react"
import {
  Box, Typography, Button, Paper, TextField, IconButton, Alert,
  CircularProgress, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Fade, alpha, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import api from "@/lib/api"

const colors = {
  primary: "#275DAD",
  secondary: "#ABA9C3",
  background: "#FCF7F8",
  lightGray: "#CED3DC",
  darkGray: "#5B616A",
  lightPurple: "#EAE9F2",
}

export default function LookupManager() {
  const [medicineTypes, setMedicineTypes] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [open, setOpen] = useState(false)
  const [activeType, setActiveType] = useState(null) 
  const [formData, setFormData] = useState({})
  const [editingId, setEditingId] = useState(null)

  // Fetch podaci
  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [mtRes, sRes] = await Promise.all([
        api.get("/lookup/medicine-types"),
        api.get("/lookup/suppliers"),
      ])
      setMedicineTypes(mtRes.data)
      setSuppliers(sRes.data)
    } catch (err) {
      setError("Failed to fetch lookup data")
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (type, item = null) => {
    setActiveType(type)
    setEditingId(item?.id || null)
    setFormData(item || {})
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({})
    setEditingId(null)
  }

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setError(null)
      if (activeType === "medicine") {
        if (editingId) {
          await api.put(`/lookup/medicine-types/${editingId}`, formData)
        } else {
          await api.post("/lookup/medicine-types", formData)
        }
      } else {
        if (editingId) {
          await api.put(`/lookup/suppliers/${editingId}`, formData)
        } else {
          await api.post("/lookup/suppliers", formData)
        }
      }
      fetchAll()
      handleClose()
    } catch (err) {
      setError("Save failed")
    }
  }

  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure?")) return
    try {
      await api.delete(`/lookup/${type === "medicine" ? "medicine-types" : "suppliers"}/${id}`)
      fetchAll()
    } catch (err) {
      setError("Delete failed")
    }
  }

  const renderTable = (title, data, type) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
        backgroundColor: alpha(colors.background, 0.9),
        backdropFilter: "blur(8px)",
        border: `1px solid ${alpha(colors.lightGray, 0.4)}`,
        mb: 4,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.darkGray }}>
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen(type)}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
            "&:hover": { background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})` },
          }}
        >
          Add
        </Button>
      </Box>

      <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})` }}>
              {type === "medicine" ? (
                <>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">Actions</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow
                key={item.id}
                sx={{
                  backgroundColor: idx % 2 === 0 ? alpha(colors.background, 0.5) : alpha(colors.lightGray, 0.2),
                  "&:hover": { backgroundColor: alpha(colors.primary, 0.05) },
                }}
              >
                {type === "medicine" ? (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                  </>
                )}
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(type, item)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(type, item.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.lightGray} 50%, ${colors.lightPurple} 100%)`,
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      <Fade in={true} timeout={800}>
        <Box>
          <Typography
            variant="h4"
            sx={{ mb: 4, fontWeight: "bold", color: colors.primary }}
          >
            Lookup Manager
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {loading && <CircularProgress sx={{ mb: 2 }} />}

          {renderTable("Medicine Types", medicineTypes, "medicine")}
          {renderTable("Suppliers", suppliers, "supplier")}

          {/* Dialog za Add/Edit */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingId ? "Edit" : "Add"} {activeType === "medicine" ? "Medicine Type" : "Supplier"}
            </DialogTitle>
            <DialogContent dividers>
              {activeType === "medicine" ? (
                <>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={formData.name || ""}
                    onChange={handleChange("name")}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={formData.description || ""}
                    onChange={handleChange("description")}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={formData.name || ""}
                    onChange={handleChange("name")}
                  />
                  <TextField
                    label="Address"
                    fullWidth
                    margin="normal"
                    value={formData.address || ""}
                    onChange={handleChange("address")}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    margin="normal"
                    value={formData.phone || ""}
                    onChange={handleChange("phone")}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={formData.email || ""}
                    onChange={handleChange("email")}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  )
}
