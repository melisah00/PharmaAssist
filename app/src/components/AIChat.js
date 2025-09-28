"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Fade,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  SendRounded,
  SmartToyRounded,
  PersonRounded,
  ContentCopyRounded,
  DeleteRounded,
  AutoFixHighRounded
} from "@mui/icons-material";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input, id: uuidv4() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          role: "user",
          conversation_id: conversationId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response, id: uuidv4() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.detail || "Error from AI", id: uuidv4() },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to server.", id: uuidv4() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          sx={{
            maxWidth: 900,
            width: "100%",
            mx: "auto",
            flexGrow: 1,
            p: isMobile ? 2 : 4,
            borderRadius: 4,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            display: "flex",
            flexDirection: "column",
            height: isMobile ? "90vh" : "85vh",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AutoFixHighRounded sx={{ fontSize: 32, mr: 1.5, color: "primary.main" }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #4776E6, #8E54E9)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI Assistant
              </Typography>
            </Box>
            
            {messages.length > 0 && (
              <Tooltip title="Clear conversation">
                <IconButton onClick={clearChat} color="error" size="small">
                  <DeleteRounded />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          {/* Chat messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "rgba(245, 247, 250, 0.7)",
              display: "flex",
              flexDirection: "column",
              "&::-webkit-scrollbar": {
                width: 6,
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(0,0,0,0.05)",
                borderRadius: 3,
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,0.2)",
                borderRadius: 3,
              },
            }}
          >
            {messages.length === 0 ? (
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                textAlign: "center",
                color: "text.secondary"
              }}>
                <SmartToyRounded sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  How can I help you today?
                </Typography>
                <Typography variant="body2">
                  Ask me anything and I'll do my best to assist you.
                </Typography>
              </Box>
            ) : (
              messages.map((msg) => (
                <Fade in={true} key={msg.id} timeout={500}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 3,
                      maxWidth: isMobile ? "90%" : "75%",
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      backgroundColor: msg.role === "user" 
                        ? "primary.main" 
                        : "grey.100",
                      color: msg.role === "user" ? "white" : "text.primary",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      position: "relative",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                      <Avatar sx={{ 
                        width: 24, 
                        height: 24, 
                        mr: 1.5,
                        bgcolor: msg.role === "user" ? "primary.dark" : "secondary.main"
                      }}>
                        {msg.role === "user" ? <PersonRounded /> : <SmartToyRounded />}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {msg.role === "user" ? "You" : "Assistant"}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}>
                      {msg.content}
                    </Typography>
                    
                    <Tooltip title="Copy text">
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.3)",
                          "&:hover": {
                            color: msg.role === "user" ? "white" : "primary.main",
                            backgroundColor: msg.role === "user" ? "primary.dark" : "rgba(0,0,0,0.05)"
                          }
                        }}
                        onClick={() => copyToClipboard(msg.content)}
                      >
                        <ContentCopyRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Fade>
              ))
            )}
            
            {loading && (
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                alignSelf: "flex-start",
                mb: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor: "grey.100",
                maxWidth: isMobile ? "90%" : "75%",
              }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1.5, bgcolor: "secondary.main" }}>
                  <SmartToyRounded />
                </Avatar>
                <CircularProgress size={16} sx={{ mr: 1.5 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Thinking...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "white",
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
            <Tooltip title="Send message">
              <span>
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  sx={{
                    minWidth: "auto",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #4776E6, #8E54E9)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #3B69D1, #7D4CD9)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                    "&:disabled": {
                      background: "grey.300",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <SendRounded />
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}