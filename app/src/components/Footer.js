"use client"
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 2.5,
        textAlign: "center",
        background: "linear-gradient(135deg, #FCF7F8 0%, #CED3DC 40%, #EAE9F2 100%)",
        color: "#5B616A",
        borderTop: "1px solid rgba(171, 169, 195, 0.3)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ fontWeight: 500, color: "rgba(0,0,0,0.65)" }}
      >
        &copy; {new Date().getFullYear()}{" "}
        <strong style={{ color: "#275DAD" }}>PharmaAssist</strong>. All rights reserved.
      </Typography>
    </Box>
  );
}
