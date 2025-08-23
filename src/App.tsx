import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Paper,
} from "@mui/material";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending">("All");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
    setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, description, completed: false },
    ]);
    setTitle("");
    setDescription("");
  };

  const toggleCompletion = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const filtered = tasks.filter((t) =>
    filter === "Completed"
      ? t.completed
      : filter === "Pending"
      ? !t.completed
      : true
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Task Manager
        </Typography>

        <Stack spacing={2} direction="row" mb={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={addTask}>
            Add
          </Button>
        </Stack>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => val && setFilter(val)}
          sx={{ mb: 2 }}
          fullWidth
        >
          <ToggleButton value="All">All</ToggleButton>
          <ToggleButton value="Completed">Completed</ToggleButton>
          <ToggleButton value="Pending">Pending</ToggleButton>
        </ToggleButtonGroup>

        <List>
          {filtered.map((task) => (
            <ListItem
              key={task.id}
              sx={{ bgcolor: task.completed ? "#e0f7fa" : "#fff" }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
              />
              <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "gray" : "inherit",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default App;
