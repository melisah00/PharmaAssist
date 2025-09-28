"use client"
import { useEffect, useState } from "react"
import {
  Box, Container, Paper, Typography, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, alpha, FormControl, InputLabel, Select, MenuItem
} from "@mui/material"
import { Add, Edit, Delete, Refresh, Close } from "@mui/icons-material"

const API_BASE = "http://localhost:8000"

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

export default function MedicineCRUD() {
  const [medicines, setMedicines] = useState([])
  const [medicineTypes, setMedicineTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editMed, setEditMed] = useState(null)
  const [selectedMed, setSelectedMed] = useState(null)
  const [form, setForm] = useState({
    name: "",
    dosage_form: "",
    strength: "",
    quantity: 0,
    expiration_date: "",
    price: 0,
    type_id: "",
    image: null
  })

  const fetchMedicines = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/medicine/`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch medicines")
      const data = await res.json()
      setMedicines(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicineTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/medicine/medicine-type/`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch medicine types")
      const data = await res.json()
      setMedicineTypes(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchMedicines()
    fetchMedicineTypes()
  }, [])

  const handleOpenDialog = (med = null) => {
    setEditMed(med)
    if (med) {
      setForm({
        name: med.name || "",
        dosage_form: med.dosage_form || "",
        strength: med.strength || "",
        quantity: med.quantity || 0,
        expiration_date: med.expiration_date || "",
        price: med.price || 0,
        type_id: med.type_id || "",
        image: null
      })
    } else {
      setForm({ 
        name: "", 
        dosage_form: "", 
        strength: "", 
        quantity: 0, 
        expiration_date: "", 
        price: 0, 
        type_id: "", 
        image: null 
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditMed(null)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      const url = editMed ? `${API_BASE}/medicine/${editMed.id}` : `${API_BASE}/medicine/`
      const method = editMed ? "PUT" : "POST"

      const quantity = Number(form.quantity)
      const price = Number(form.price)
      const type_id = Number(form.type_id)

      if (!form.name || isNaN(quantity) || quantity < 0) {
        setError("Please enter valid name and quantity")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("dosage_form", form.dosage_form || "")
      formData.append("strength", form.strength || "")
      formData.append("quantity", quantity)
      formData.append("expiration_date", form.expiration_date || "")
      formData.append("price", price)
      formData.append("type_id", type_id)
      if (form.image) formData.append("file", form.image)

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include"
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || "Failed to save medicine")
      }

      await fetchMedicines()
      handleCloseDialog()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/medicine/${id}`, { method: "DELETE", credentials: "include" })
      if (!res.ok) throw new Error("Failed to delete medicine")
      await fetchMedicines()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkMedicineStatus = (med) => {
    const today = new Date()
    const expDate = med.expiration_date ? new Date(med.expiration_date) : null
    const warnings = []
    if (med.quantity <= 10) warnings.push("⚠️")
    if (expDate) {
      const diffDays = Math.floor((expDate - today) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays <= 90) warnings.push("⌛")
    }
    return warnings
  }

  // Function to get medicine type name by ID
  const getMedicineTypeName = (typeId) => {
    const type = medicineTypes.find(t => t.id === typeId)
    return type ? type.name : "Unknown"
  }

  return (
    <Box sx={{ minHeight: "100vh", background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.lightGray} 50%, ${colors.lightPurple} 100%)`, pb: 6, pt: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary }}>
            Medicines ({medicines.length})
          </Typography>
          <Button onClick={() => handleOpenDialog()} startIcon={<Add />} sx={{ ml: 'auto', backgroundColor: colors.secondary, '&:hover': { backgroundColor: colors.primary, color: "#fff" } }}>
            Add Medicine
          </Button>
          <Button onClick={fetchMedicines} startIcon={<Refresh />} sx={{ ml: 2, color: colors.primary }}>
            Refresh
          </Button>
        </Box>

        {loading && <CircularProgress sx={{ color: colors.primary, mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.lightPurple }}>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Form</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Strength</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Expiration</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Type</TableCell> {/* New column */}
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Warnings</TableCell>
                <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map(med => {
                const warnings = checkMedicineStatus(med)
                return (
                  <TableRow
                    key={med.id}
                    sx={{ '&:hover': { backgroundColor: alpha(colors.primary, 0.05), cursor: 'pointer' }, backgroundColor: warnings.length > 0 ? alpha(colors.error, 0.15) : 'inherit' }}
                    onClick={() => setSelectedMed(med)}
                  >
                    <TableCell>{med.id}</TableCell>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.dosage_form || "-"}</TableCell>
                    <TableCell>{med.strength || "-"}</TableCell>
                    <TableCell>{med.quantity}</TableCell>
                    <TableCell>{med.expiration_date || "-"}</TableCell>
                    <TableCell>{med.price}</TableCell>
                    <TableCell>{getMedicineTypeName(med.type_id)}</TableCell> {/* New cell */}
                    <TableCell>{warnings.join(' ')}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleOpenDialog(med) }} startIcon={<Edit />} sx={{ mr: 1 }}>Edit</Button>
                      <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(med.id) }} startIcon={<Delete />}>Delete</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editMed ? "Edit Medicine" : "Add Medicine"}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Form" value={form.dosage_form} onChange={e => setForm({ ...form, dosage_form: e.target.value })} fullWidth />
            <TextField label="Strength" value={form.strength} onChange={e => setForm({ ...form, strength: e.target.value })} fullWidth />
            <TextField label="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} fullWidth />
            <TextField label="Expiration Date" type="date" value={form.expiration_date} onChange={e => setForm({ ...form, expiration_date: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Medicine Type</InputLabel>
              <Select
                value={form.type_id}
                label="Medicine Type"
                onChange={e => setForm({ ...form, type_id: e.target.value })}
              >
                {medicineTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} accept="image/*" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : "Save"}</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={!!selectedMed} onClose={() => setSelectedMed(null)}>
          <DialogTitle>
            Medicine Details
            <Button onClick={() => setSelectedMed(null)} startIcon={<Close />} color="error" sx={{ float: 'right' }} />
          </DialogTitle>
          <DialogContent dividers>
            {selectedMed && (
              <>
                <Typography><strong>ID:</strong> {selectedMed.id}</Typography>
                <Typography><strong>Name:</strong> {selectedMed.name}</Typography>
                <Typography><strong>Form:</strong> {selectedMed.dosage_form || "-"}</Typography>
                <Typography><strong>Strength:</strong> {selectedMed.strength || "-"}</Typography>
                <Typography><strong>Quantity:</strong> {selectedMed.quantity}</Typography>
                <Typography><strong>Expiration Date:</strong> {selectedMed.expiration_date || "-"}</Typography>
                <Typography><strong>Price:</strong> {selectedMed.price || "-"}</Typography>
                <Typography><strong>Type:</strong> {getMedicineTypeName(selectedMed.type_id)}</Typography> {/* Added type to details */}
                {selectedMed.image_path && (
                  <Paper sx={{ mt: 2, p: 1, display: "flex", justifyContent: "center" }}>
                    <img
                      src={`${API_BASE}/${selectedMed.image_path.replace(/\\/g, "/")}`}
                      alt={selectedMed.name}
                      style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                  </Paper>
                )}
                <Typography><strong>Warnings:</strong> {checkMedicineStatus(selectedMed).join(' ') || "None"}</Typography>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  )
}