"use client"
import { useEffect, useState } from "react"
import {
    Box, Container, Paper, Typography, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Alert, alpha
} from "@mui/material"
import { Assignment, Refresh } from "@mui/icons-material"

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

export default function MedicineTable() {
    const [medicines, setMedicines] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMedicines = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/medicine/expiring-soon`, { credentials: "include" })
            if (!res.ok) throw new Error("Failed to fetch medicines")
            const data = await res.json()
            setMedicines(data)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMedicines()
    }, [])

    return (
        <Box sx={{
            minHeight: "100vh",
            background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.lightGray} 50%, ${colors.lightPurple} 100%)`,
            pb: 6,
            pt: 4
        }}>
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Assignment sx={{ mr: 2, fontSize: 32, color: colors.primary }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary }}>
                        Medicine Inventory ({medicines.length})
                    </Typography>
                    <Button
                        onClick={fetchMedicines}
                        disabled={loading}
                        startIcon={<Refresh />}
                        sx={{
                            ml: 'auto',
                            color: colors.primary,
                            '&:hover': { backgroundColor: alpha(colors.primary, 0.1) }
                        }}
                    >
                        Refresh
                    </Button>
                </Box>

                {loading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: colors.primary }} />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2, backgroundColor: alpha(colors.error, 0.1), color: colors.error }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", backgroundColor: colors.background }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: colors.lightPurple }}>
                                    <TableCell sx={{ fontWeight: 600, color: colors.primary }}>ID</TableCell> {/* Dodano */}
                                    <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Form</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Strength</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Quantity</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: colors.primary }}>Expiration Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {medicines.map(med => (
                                    <TableRow key={med.id} sx={{ '&:hover': { backgroundColor: alpha(colors.primary, 0.05) } }}>
                                        <TableCell sx={{ color: colors.darkGray }}>{med.id}</TableCell> {/* Dodano */}

                                        <TableCell sx={{ color: colors.darkGray }}>{med.name}</TableCell>
                                        <TableCell sx={{ color: colors.darkGray }}>{med.dosage_form || "-"}</TableCell>
                                        <TableCell sx={{ color: colors.darkGray }}>{med.strength || "-"}</TableCell>
                                        <TableCell sx={{ color: colors.darkGray }}>{med.quantity}</TableCell>
                                        <TableCell sx={{ color: colors.darkGray }}>{med.expiration_date || "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Button
                            variant="contained"
                            sx={{ mt: 2, ml: 2, borderRadius: 2, py: 1.2, backgroundColor: colors.secondary, '&:hover': { backgroundColor: colors.primary } }}
                            onClick={() => window.open(`${API_BASE}/medicine/pdf`, "_blank")}
                        >
                            Generate PDF
                        </Button>
                    </TableContainer>
                )}
            </Container>
        </Box>
    )
}
