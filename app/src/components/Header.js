"use client";

import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

const colors = {
  bgDark: "#2A2D3A",
  accentLight: "#3A3E4A",
  textLight: "#F0F2F5",
};

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth();
  const router = useRouter();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setAnchorEl(null);
    document.cookie = "access_token=; path=/; max-age=0";
    if (logout) logout();
    router.push("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: colors.bgDark,
        height: 64,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        borderBottom: `1px solid ${colors.accentLight}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: 64 }}>
        {/* Lijevo - naslov */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: colors.textLight,
              display: { xs: "none", sm: "block" },
            }}
          >
            PharmaAssist
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: colors.textLight,
              display: { xs: "block", sm: "none" },
            }}
          >
            PA
          </Typography>
        </Box>

        {/* Desno - ikona profila */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            edge="end"
            sx={{ color: colors.textLight, "&:hover": { backgroundColor: colors.accentLight } }}
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: colors.bgDark,
                border: `1px solid ${colors.accentLight}`,
                borderRadius: 2,
                mt: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                "& .MuiMenuItem-root": {
                  color: colors.textLight,
                  fontSize: "0.9rem",
                  "&:hover": { backgroundColor: colors.accentLight },
                },
              },
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
