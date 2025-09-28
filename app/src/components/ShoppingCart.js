'use client'

import { useEffect, useState } from 'react'
import { 
  Box, Container, Paper, Typography, Card, CardContent, CardMedia, 
  Button, IconButton, CircularProgress, Alert, Divider
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import Footer from '@/components/Footer'

const API_BASE = 'http://localhost:8000'

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const colors = {
    primary: '#275DAD',
    secondary: '#ABA9C3',
    accentDark: '#5B616A',
    background: '#FCF7F8',
  }

  const fetchCart = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/shopping-cart/`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load cart')
      const data = await res.json()
      setCartItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const removeItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/shopping-cart/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to remove item')
      setCartItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCheckout = async () => {
    try {
      const res = await fetch(`${API_BASE}/shopping-cart/checkout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      alert(data.detail)
      setCartItems([])
    } catch (err) {
      alert(err.message)
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.medicine) return sum
    return sum + item.medicine.price * item.quantity
  }, 0)

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #FCF7F8 0%, #CED3DC 50%, #EAE9F2 100%)' }}>
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 3, width: '100%', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)' }}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #ABA9C3, #275DAD, #5B616A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Shopping Cart
          </Typography>

          {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4, color: colors.primary }} />}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {!loading && cartItems.length === 0 && <Typography textAlign="center" sx={{ my: 4 }}>Your cart is empty.</Typography>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.map(item => (
              <Card key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 70, height: 70, borderRadius: 2 }}
                    image={item.medicine.image_path ? `${API_BASE}/${item.medicine.image_path.replaceAll("\\", "/")}` : '/placeholder-medicine.png'}
                    alt={item.medicine.name}
                  />
                  <CardContent sx={{ py: 0, px: 1 }}>
                    <Typography variant="subtitle1">{item.medicine.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.quantity} × {item.medicine.price} BAM</Typography>
                  </CardContent>
                </Box>
                <IconButton onClick={() => removeItem(item.id)} color="error">
                  <Delete />
                </IconButton>
              </Card>
            ))}

            {cartItems.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Total: {totalPrice} BAM</Typography>
                  <Button
                    variant="contained"
                    onClick={handleCheckout}
                    sx={{
                      background: 'linear-gradient(45deg, #ABA9C3, #275DAD, #5B616A)',
                      color: '#fff',
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5B616A, #275DAD, #ABA9C3)',
                      },
                    }}
                  >
                    Buy
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Container>
      
    </Box>
  )
}
