'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { 
  Box, TextField, Button, Typography, Link, Container, Paper, 
  InputAdornment, IconButton, Fade, Alert, CircularProgress 
} from '@mui/material'
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material'
import Footer from '@/components/Footer'


export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const res = await login(formData.username, formData.password)

    if (res.success) {
      router.push('/dashboard')
    } else {
      setError(res.error || 'Login failed. Please try again.')
    }

    setLoading(false)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #FCF7F8 0%, #CED3DC 50%, #EAE9F2 100%)',
      }}
    >
      

      <Container maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Fade in={true} timeout={800}>
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(206, 211, 220, 0.5)',
              width: '100%',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #ABA9C3, #275DAD, #5B616A)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sign In
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                Welcome back! Please enter your credentials
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Username"
                value={formData.username}
                onChange={handleChange('username')}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#5B616A' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#5B616A' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: '#5B616A' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  background: 'linear-gradient(45deg, #ABA9C3 0%, #275DAD 50%, #5B616A 100%)',
                  color: '#fff',
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5B616A 0%, #275DAD 50%, #ABA9C3 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </Box>

            <Typography sx={{ mt: 2, textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
              Don't have an account?{' '}
              <Link
                href="/register"
                sx={{
                  color: '#275DAD',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Paper>
        </Fade>
      </Container>

      
    </Box>
  )
}
