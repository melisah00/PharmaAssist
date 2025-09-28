"use client";

import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  Divider,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MedicationIcon from "@mui/icons-material/Medication";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import LookupIcon from '@mui/icons-material/Search';

const drawerWidth = 260;

const colors = {
  bgDark: "#2A2D3A",
  accentLight: "#3A3E4A",
  primary: "#275DAD",
  textLight: "#F0F2F5",
};

const navItemsByRole = {
  admin: [
    { label: "Profile", key: "pr", icon: <HomeIcon /> },
    { label: "Employees", key: "employees", icon: <PersonIcon /> },
    { label: "Tasks", key: "tasks", icon: <EventIcon /> },
    { label: "Medications", key: "medications", icon: <LocalPharmacyIcon /> },
    { label: "Medications CRUD", key: "med_crud", icon: <ForumIcon /> },
    { label: "Temperature & Humidity", key: "temp", icon: <InventoryIcon /> },
    { label: "Lookup Data", key: "lookup", icon: <LookupIcon /> },
  ],
  technician: [
    { label: "Profile", key: "pr", icon: <HomeIcon /> },
    { label: "Medications", key: "medications", icon: <InventoryIcon /> },
    { label: "Tasks", key: "my_tasks", icon: <EventIcon /> },
    { label: "Environment Logs", key: "env_logs", icon: <MedicationIcon /> },
  ],
  customer: [
    { label: "Profile", key: "pr", icon: <HomeIcon /> },
    { label: "Shop", key: "shop", icon: <MedicationIcon /> },
    { label: "Shopping Cart", key: "shopping_cart", icon: <ShoppingCartIcon /> },
    { label: "AI Assistant", key: "ai", icon: <CalendarTodayIcon /> },
  ],
};

export default function Sidebar({ open, onToggle, role, user, onSelect, activePage }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const effectiveOpen = !isSmallScreen && open;
  const widthToUse = effectiveOpen ? drawerWidth : 70;
  const navItems = navItemsByRole[role] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: widthToUse,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "fixed",
          top: "64px",
          height: "calc(100vh - 64px)",
          width: widthToUse,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: colors.bgDark,
          borderRight: `1px solid ${colors.accentLight}`,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* User Info */}
      {effectiveOpen && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.accentLight}` }}>
          <Typography
            variant="body1"
            fontWeight="medium"
            color={colors.textLight}
            sx={{ textAlign: "center" }}
          >
            {user?.name ||
              (role === "admin" && "Administrator") ||
              (role === "technician" && "Technician") ||
              (role === "customer" && "Customer")}
          </Typography>
        </Box>
      )}

      {/* Toggle Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        {!isSmallScreen && (
          <IconButton
            onClick={onToggle}
            sx={{ color: colors.textLight, "&:hover": { backgroundColor: colors.accentLight } }}
          >
            {effectiveOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ backgroundColor: colors.accentLight }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, p: 1 }}>
        {navItems.map(({ label, key, icon, badge }) => {
          const active = activePage === key;

          const listItem = (
            <ListItemButton
              onClick={() => onSelect(key)}
              sx={{
                minHeight: 48,
                justifyContent: effectiveOpen ? "initial" : "center",
                px: 2.5,
                mx: 0.5,
                borderRadius: 2,
                my: 0.5,
                color: colors.textLight,
                backgroundColor: active ? colors.primary : "transparent",
                "&:hover": { backgroundColor: colors.accentLight },
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: effectiveOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: active ? colors.bgDark : "inherit",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                sx={{
                  opacity: effectiveOpen ? 1 : 0,
                  "& .MuiTypography-root": {
                    fontWeight: active ? "600" : "400",
                    fontSize: "0.9rem",
                  },
                }}
              />
              {badge > 0 && effectiveOpen && (
                <Badge badgeContent={badge} color="error" sx={{ ml: "auto" }} />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={key || label} disablePadding sx={{ display: "block" }}>
              {effectiveOpen ? listItem : <Tooltip title={label}>{listItem}</Tooltip>}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
