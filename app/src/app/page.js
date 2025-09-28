'use client'
import { useState, useEffect } from 'react'
import { 
  Box, Button, Typography, Container, Paper, Grid, 
  Fade, useTheme, alpha, Card, CardContent 
} from '@mui/material'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import {
  LocalPharmacy,
  Medication,
  People,
  Inventory,
  Description,
  Security,
  TrendingUp,
  HealthAndSafety,
  ArrowForward
} from '@mui/icons-material'

export default function LandingPage() {
  const router = useRouter()
  const theme = useTheme()
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const features = [
    {
      icon: <Description sx={{ fontSize: 40, color: '#275DAD' }} />,
      title: 'E-Prescriptions',
      description: 'Create, manage, and share electronic prescriptions securely with patients and pharmacies.'
    },
    {
      icon: <Inventory sx={{ fontSize: 40, color: '#275DAD' }} />,
      title: 'Inventory Management',
      description: 'Track medication stock levels with alerts for low inventory or expiring drugs.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#275DAD' }} />,
      title: 'Patient Records',
      description: 'Maintain comprehensive patient profiles with medication history and treatment plans.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#275DAD' }} />,
      title: 'Secure Data',
      description: 'HIPAA-compliant security measures to protect sensitive patient information.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#275DAD' }} />,
      title: 'Analytics & Reports',
      description: 'Generate insightful reports on prescriptions, inventory, and patient trends.'
    },
    {
      icon: <HealthAndSafety sx={{ fontSize: 40, color: '#275DAD' }} />,
      title: 'Patient Safety',
      description: 'Drug interaction checks and allergy alerts to ensure patient safety.'
    }
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E4E7EB 50%, #CBD2D9 100%)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(39,93,173,0.15) 0%, rgba(39,93,173,0) 70%)',
          top: '-100px',
          right: '-100px',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(171,169,195,0.1) 0%, rgba(171,169,195,0) 70%)',
          bottom: '-100px',
          left: '-100px',
          zIndex: 0,
        }
      }}
    >
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Fade in={fadeIn} timeout={1000}>
          <Box>
            <LocalPharmacy 
              sx={{ 
                fontSize: 60, 
                color: '#275DAD',
                mb: 2,
                background: 'linear-gradient(45deg, #ABA9C3, #275DAD, #5B616A)',
                borderRadius: '50%',
                p: 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                marginTop: "2%"
              }} 
            />
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #275DAD, #5B616A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              PharmaAssist 
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                color: 'rgba(0,0,0,0.7)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Revolutionizing pharmaceutical management for healthcare professionals. 
              Streamline operations, manage prescriptions, and improve patient care with our comprehensive platform.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 6 }}>
              <Button
                variant="contained"
                onClick={() => router.push('/login')}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #275DAD, #5B616A)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(39,93,173,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5B616A, #275DAD)',
                    boxShadow: '0 6px 20px rgba(39,93,173,0.4)',
                  },
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                onClick={() => router.push('/register')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: '#275DAD',
                  color: '#275DAD',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'rgba(39,93,173,0.1)',
                    borderColor: '#5B616A',
                  },
                }}
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
  <Fade in={fadeIn} timeout={1500}>
    <Box>
      <Typography 
        variant="h3" 
        align="center" 
        sx={{ mb: 2, fontWeight: 'bold', color: '#275DAD' }}
      >
        Why Choose PharmaAssist?
      </Typography>
      
      <Typography 
        variant="h6" 
        align="center" 
        sx={{ mb: 6, color: 'rgba(0,0,0,0.7)', maxWidth: '700px', mx: 'auto' }}
      >
        Our comprehensive platform offers everything you need to manage your pharmacy operations efficiently.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                maxWidth: 320, // 👈 ograniči širinu kartice
                mx: 'auto',    // 👈 centriraj kartice
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(39,93,173,0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ mb: 1.5, fontWeight: 'bold', color: '#275DAD' }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Fade>
</Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Fade in={fadeIn} timeout={2000}>
          <Paper
            sx={{
              p: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(39,93,173,0.1) 0%, rgba(171,169,195,0.1) 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(39,93,173,0.1)'
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#275DAD'
              }}
            >
              Ready to Transform Your Pharmacy Management?
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                color: 'rgba(0,0,0,0.7)',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Join thousands of healthcare professionals who trust PharmaAssist for their daily operations.
            </Typography>
            
            <Button
              variant="contained"
              onClick={() => router.push('/register')}
              endIcon={<ArrowForward />}
              sx={{
                px: 5,
                py: 1.5,
                background: 'linear-gradient(45deg, #275DAD, #5B616A)',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(39,93,173,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5B616A, #275DAD)',
                  boxShadow: '0 6px 20px rgba(39,93,173,0.4)',
                },
              }}
            >
              Sign Up Free
            </Button>
          </Paper>
        </Fade>
      </Container>

      {/* Footer */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </Box>
    </Box>
  )
}