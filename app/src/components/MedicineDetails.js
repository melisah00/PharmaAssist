"use client"

import { Box, Typography, Paper, Button, Divider } from "@mui/material"
import { Close } from "@mui/icons-material"

export default function MedicineDetails({ medicine, onClose }) {
  if (!medicine) return null

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Medicine Details
        </Typography>
        <Button onClick={onClose} startIcon={<Close />} color="error">Close</Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Typography><strong>ID:</strong> {medicine.id}</Typography>
      <Typography><strong>Name:</strong> {medicine.name}</Typography>
      <Typography><strong>Form:</strong> {medicine.dosage_form || "-"}</Typography>
      <Typography><strong>Strength:</strong> {medicine.strength || "-"}</Typography>
      <Typography><strong>Quantity:</strong> {medicine.quantity}</Typography>
      <Typography><strong>Expiration Date:</strong> {medicine.expiration_date || "-"}</Typography>
      <Typography><strong>Description:</strong> {medicine.description || "-"}</Typography>
      <Typography><strong>Manufacturer:</strong> {medicine.manufacturer || "-"}</Typography>
      <Typography><strong>Type ID:</strong> {medicine.type_id || "-"}</Typography>
      <Typography><strong>Supplier ID:</strong> {medicine.supplier_id || "-"}</Typography>
    </Paper>
  )
}
