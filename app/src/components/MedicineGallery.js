"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    TextField,
    CircularProgress,
    Alert,
    Pagination,
    MenuItem,
    Select,
    FormControl,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
} from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";

const API_BASE = "http://localhost:8000";

const colors = {
    primary: "#275DAD",
    secondary: "#ABA9C3",
    background: "#FCF7F8",
    accentDark: "#5B616A",
};

const ITEMS_PER_PAGE = 8;

export default function MedicineGallery() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMed, setSelectedMed] = useState(null);
    const [sort, setSort] = useState("");
    const [quantityDialog, setQuantityDialog] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Fetch medicines
    const fetchMedicines = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/medicine/`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch medicines");
            const data = await res.json();
            setMedicines(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const filteredMedicines = useMemo(() => {
        let filtered = medicines.filter((med) =>
            med.name.toLowerCase().includes(search.toLowerCase())
        );

        switch (sort) {
            case "name-asc":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "price-asc":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        return filtered;
    }, [medicines, search, sort]);

    const pageCount = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
    const paginatedMeds = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredMedicines.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredMedicines, page]);

    // Add to cart
    const handleAddToCart = async (medicine) => {
        try {
            const res = await fetch(`${API_BASE}/shopping-cart/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    user_id: 1, // privremeno dok se ne poveže JWT
                    medicine_id: medicine.id,
                    quantity: quantity,
                }),
            });

            if (!res.ok) throw new Error("Failed to add to cart");
            const data = await res.json();
            console.log("Added to cart:", data);
            setQuantityDialog(null);
            setQuantity(1);
        } catch (err) {
            console.error(err);
            alert("Error adding to cart");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                py: 4,
                background: "linear-gradient(120deg, #FCF7F8 0%, #EAE9F2 100%)",
            }}
        >
            <Container maxWidth="lg">
                {/* Search and Sort */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 4,
                        alignItems: "center",
                    }}
                >
                    <TextField
                        placeholder="Search medicine..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        sx={{
                            maxWidth: 300,
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                backgroundColor: "#fff",
                                paddingRight: 1,
                                height: 40,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: colors.accentDark }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl sx={{ minWidth: 180, height: 40 }}>
                        <Select
                            displayEmpty
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            sx={{
                                height: 40,
                                borderRadius: 3,
                                backgroundColor: "#fff",
                                "& .MuiSelect-select": {
                                    display: "flex",
                                    alignItems: "center",
                                    paddingY: 0,
                                },
                            }}
                        >
                            <MenuItem value="" disabled>Sort by</MenuItem>
                            <MenuItem value="">Default</MenuItem>
                            <MenuItem value="name-asc">Name A-Z</MenuItem>
                            <MenuItem value="name-desc">Name Z-A</MenuItem>
                            <MenuItem value="price-asc">Price Low → High</MenuItem>
                            <MenuItem value="price-desc">Price High → Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Loading, Error, No items */}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                        <CircularProgress sx={{ color: colors.primary }} />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}
                {!loading && !error && filteredMedicines.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="h6" color={colors.accentDark}>
                            No medicines found
                        </Typography>
                    </Box>
                )}

                {/* Medicine Grid */}
                <Grid container spacing={3} justifyContent="center">
                    {paginatedMeds.map((med) => (
                        <Grid item key={med.id}>
                            <Card
                                sx={{
                                    width: 220,
                                    height: 360,
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 3,
                                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                                        cursor: "pointer",
                                    },
                                }}
                                onClick={() => setSelectedMed(med)}
                            >
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={med.image_path ? `${API_BASE}/${med.image_path}` : "/placeholder-medicine.png"}
                                    alt={med.name}
                                    sx={{ objectFit: "cover" }}
                                />
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        p: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: "bold", mb: 0.5 }}>
                                            {med.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {med.dosage_form || "-"} | {med.strength || "-"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                        <Typography variant="h6" color={colors.primary} sx={{ fontWeight: "bold" }}>
                                            {med.price} BAM
                                        </Typography>
                                        <IconButton
                                            color="primary"
                                            sx={{
                                                backgroundColor: "rgba(39,93,173,0.1)",
                                                "&:hover": { backgroundColor: "rgba(39,93,173,0.2)" },
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setQuantityDialog(med);
                                            }}
                                        >
                                            <ShoppingCart />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination */}
                {pageCount > 1 && (
                    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                        />
                    </Box>
                )}

                {/* Medicine Dialog */}
                <Dialog
                    open={!!selectedMed}
                    onClose={() => setSelectedMed(null)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle
                        sx={{
                            background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary}, ${colors.accentDark})`,
                            color: "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        {selectedMed?.name}
                    </DialogTitle>
                    <DialogContent dividers sx={{ p: 3 }}>
                        {selectedMed && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={selectedMed.image_path ? `${API_BASE}/${selectedMed.image_path}` : "/placeholder-medicine.png"}
                                        alt={selectedMed.name}
                                        sx={{ objectFit: "cover", borderRadius: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom color={colors.primary}>
                                        Medicine Details
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Form: {selectedMed.dosage_form || "-"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Strength: {selectedMed.strength || "-"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Quantity: {selectedMed.quantity || "-"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Expiration Date: {selectedMed.expiration_date || "-"}
                                    </Typography>
                                    <Typography variant="h6" color={colors.primary} sx={{ mt: 1 }}>
                                        {selectedMed.price} BAM
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<ShoppingCart />}
                                        sx={{
                                            mt: 2,
                                            py: 1.5,
                                            borderRadius: 3,
                                            background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary}, ${colors.accentDark})`,
                                            color: "#fff",
                                            "&:hover": {
                                                background: `linear-gradient(45deg, ${colors.accentDark}, ${colors.primary}, ${colors.secondary})`,
                                            },
                                        }}
                                        onClick={() => setQuantityDialog(selectedMed)}
                                    >
                                        Add to Cart
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                </Dialog>

               
                <Dialog
                    open={!!quantityDialog}
                    onClose={() => setQuantityDialog(null)}
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle>Choose Quantity</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            type="number"
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            inputProps={{ min: 1 }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleAddToCart(quantityDialog)}
                        >
                            Confirm
                        </Button>
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
}
