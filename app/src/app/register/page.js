"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from '@/components/AuthProvider'
import { 
  Box, TextField, Button, Typography, Link, Container, Paper, 
  InputAdornment, IconButton, Fade, Alert, CircularProgress 
} from "@mui/material"
import { 
  Visibility, VisibilityOff, Person, Email, Lock, Badge 
} from "@mui/icons-material"
import Header from "@/components/Header"
import GuestHeader from "@/components/Header"
import Footer from "@/components/Footer"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const res = await register({
      first_name: formData.firstName,
      last_name: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    })

    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else {
      setError(res.error || "Registration failed. Please try again.")
    }

    setLoading(false)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FCF7F8 0%, #CED3DC 50%, #EAE9F2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      
      
      
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1, pt: 10 }}>
        <Fade in={true} timeout={800}>
          <Paper 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 3, 
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)", 
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(206, 211, 220, 0.5)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 1, 
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #ABA9C3, #275DAD, #5B616A)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)" }}>
                Join our community and start your journey
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                Registration successful! Redirecting to dashboard...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: "#5B616A" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: "#5B616A" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Username"
                value={formData.username}
                onChange={handleChange("username")}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#5B616A" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#5B616A" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#5B616A" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: "#5B616A" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  background: "linear-gradient(45deg, #ABA9C3 0%, #275DAD 50%, #5B616A 100%)",
                  color: "#fff",
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": { 
                    background: "linear-gradient(45deg, #5B616A 0%, #275DAD 50%, #ABA9C3 100%)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Box>

            <Typography sx={{ mt: 2, textAlign: "center", color: "rgba(0,0,0,0.6)" }}>
              Already have an account?{" "}
              <Link 
                href="/login" 
                sx={{ 
                  color: "#275DAD", 
                  fontWeight: "bold", 
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Paper>
        </Fade>
      </Container>
      
      </Box>
    
  )
}
