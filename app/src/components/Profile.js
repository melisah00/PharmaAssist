"use client"
import React, { useState, useEffect } from "react"
import { useAuth } from '@/components/AuthProvider'
import api from '@/lib/api'
import {
  Box, Typography, Paper, Container, Fade, CircularProgress, Alert,
  Avatar, Chip, Divider, IconButton, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button
} from "@mui/material"
import { Edit, Person, Email, Badge, Security, VerifiedUser, Phone, LocationOn, CalendarToday } from "@mui/icons-material"

export default function Profile() {
  const { user, loading, setUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    current_password: "",
    new_password: ""
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        current_password: "",
        new_password: ""
      })
    }
  }, [user])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setError(null)
    setSuccess(null)
    setFormData(prev => ({
      ...prev,
      current_password: "",
      new_password: ""
    }))
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    const requestData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    }

    if (formData.current_password && formData.new_password) {
      requestData.password_data = {
        old_password: formData.current_password,
        new_password: formData.new_password,
      }
    }

    try {
      const res = await api.put("/me", requestData)   // ✅ use axios instance
      setUser(res.data)
      setSuccess("Profile updated successfully!")
      setTimeout(() => handleClose(), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
      console.error("Update error:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)"
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'primary.dark' }}>
            Loading your profile...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)"
      }}>
        <Alert severity="warning" sx={{ width: 'auto', maxWidth: 400, boxShadow: 3 }}>
          User not logged in. Please sign in to view your profile.
        </Alert>
      </Box>
    )
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'doctor': return 'primary';
      case 'pharmacist': return 'secondary';
      case 'patient': return 'success';
      default: return 'default';
    }
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%)",
      py: 4,
      position: "relative",
      overflow: "hidden"
    }}>
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            overflow: "hidden"
          }}>

            {/* Header */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              mb: 4,
              gap: 3
            }}>
              <Avatar sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                fontSize: "2.5rem",
                boxShadow: "0 6px 20px rgba(100, 181, 246, 0.3)"
              }}>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </Avatar>
              <Box sx={{
                flexGrow: 1,
                textAlign: { xs: "center", sm: "left" }
              }}>
                <Typography variant="h4" sx={{
                  fontWeight: "bold",
                  color: "primary.dark",
                  mb: 1
                }}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Box sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: { xs: "center", sm: "flex-start" }
                }}>
                  <Chip
                    icon={<Security />}
                    label={user.role}
                    color={getRoleColor(user.role)}
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                  <Chip
                    icon={<VerifiedUser />}
                    label="Verified Account"
                    color="success"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Box>
              <IconButton
                sx={{
                  bgcolor: "primary.light",
                  color: "white",
                  "&:hover": { bgcolor: "primary.main" },
                  boxShadow: 2
                }}
                onClick={handleOpen}
              >
                <Edit />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 4, borderColor: "rgba(0,0,0,0.1)" }} />

            {/* Profile Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  background: "linear-gradient(to bottom right, rgba(100, 181, 246, 0.1), rgba(186, 222, 251, 0.2))",
                  border: "1px solid rgba(100, 181, 246, 0.2)"
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.dark"
                    }}>
                      <Badge sx={{ color: "primary.main" }} /> Personal Information
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Person color="primary" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Username
                          </Typography>
                          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                            {user.username}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Email color="primary" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                      {user.phone && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Phone color="primary" />
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Phone
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {user.phone}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  background: "linear-gradient(to bottom right, rgba(129, 199, 132, 0.1), rgba(200, 230, 201, 0.2))",
                  border: "1px solid rgba(129, 199, 132, 0.2)"
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.dark"
                    }}>
                      <LocationOn sx={{ color: "primary.main" }} /> Additional Information
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {user.address && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <LocationOn color="primary" />
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Address
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {user.address}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CalendarToday color="primary" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Member Since
                          </Typography>
                          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Security color="primary" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Status
                          </Typography>
                          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                            {user.status || "Active"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Update Modal */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
              <DialogTitle>
                Update Profile
              </DialogTitle>
              <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                {error && (
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success">
                    {success}
                  </Alert>
                )}
                <TextField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">
                  Change Password (optional)
                </Typography>
                <TextField
                  label="Current Password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  type="password"
                  fullWidth
                />
                <TextField
                  label="New Password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  type="password"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
              </DialogActions>
            </Dialog>

          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}