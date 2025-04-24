// TaskManagementSystem.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
  ThemeProvider,
  createTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function TaskManagementSystem({ userId }) {
  // Custom theme with green palette
  const theme = createTheme({
    palette: {
      primary: {
        light: "#7CB342",
        main: "#4CAF50",
        dark: "#2E7D32",
        contrastText: "#fff",
      },
      secondary: {
        light: "#AED581",
        main: "#8BC34A",
        dark: "#689F38",
        contrastText: "#fff",
      },
      background: {
        default: "#F9FBF7",
      },
      success: {
        main: "#66BB6A",
        light: "#E8F5E9",
      },
      error: {
        main: "#F44336",
        light: "#FFEBEE",
      },
      warning: {
        main: "#FFA726",
        light: "#FFF3E0",
      },
      info: {
        main: "#29B6F6",
        light: "#E3F2FD",
      },
    },
  });

  // State variables
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    category: "Maintenance",
    priority: "Medium",
    notes: "",
    completed: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "Maintenance",
    "Planting",
    "Harvesting",
    "Treatment",
    "Fertilization",
    "Irrigation",
    "Other",
  ];
  const priorities = ["Low", "Medium", "High", "Urgent"];

  // Reference to the tasks collection
  const tasksCollectionRef = collection(
    db,
    "users",
    userId || "anonymous",
    "tasks"
  );

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const tasksQuery = query(
          tasksCollectionRef,
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(tasksQuery);

        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Format date for the UI
          dueDate: doc.data().dueDate?.toDate?.()
            ? doc.data().dueDate.toDate().toISOString().split("T")[0]
            : doc.data().dueDate,
        }));

        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // Add task to Firestore
  const addTaskToFirestore = async (taskData) => {
    try {
      // Format date for Firestore
      const formattedTask = {
        ...taskData,
        createdAt: serverTimestamp(),
        userId: userId || "anonymous",
      };

      const docRef = await addDoc(tasksCollectionRef, formattedTask);

      // Update local state with the new task including the Firestore ID
      setTasks((prevTasks) => [
        {
          ...taskData,
          id: docRef.id,
        },
        ...prevTasks,
      ]);

      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
      return false;
    }
  };

  // Update task in Firestore
  const updateTaskInFirestore = async (taskId, taskData) => {
    try {
      const taskRef = doc(db, "users", userId || "anonymous", "tasks", taskId);

      // Format date for Firestore
      const formattedTask = {
        ...taskData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(taskRef, formattedTask);

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...taskData } : task
        )
      );

      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
      return false;
    }
  };

  // Delete task from Firestore
  const deleteTaskFromFirestore = async (taskId) => {
    try {
      const taskRef = doc(db, "users", userId || "anonymous", "tasks", taskId);
      await deleteDoc(taskRef);

      // Update local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
      return false;
    }
  };

  // Handler for marking a task as complete/incomplete
  const handleTaskComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedCompleted = !taskToUpdate.completed;

    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: updatedCompleted } : task
      )
    );

    // Update in Firestore
    await updateTaskInFirestore(id, { completed: updatedCompleted });
  };

  // Handler for deleting a task
  const handleDeleteTask = async (id) => {
    await deleteTaskFromFirestore(id);
  };

  // Handler for editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      dueDate: task.dueDate,
      category: task.category,
      priority: task.priority,
      notes: task.notes || "",
      completed: task.completed,
    });
    setIsDialogOpen(true);
  };

  // Handler for saving a task (create or update)
  const saveTask = async () => {
    if (!newTask.title || !newTask.dueDate) return;

    let success;

    if (editingTaskId) {
      // Update existing task
      success = await updateTaskInFirestore(editingTaskId, newTask);
      if (success) setEditingTaskId(null);
    } else {
      // Add new task
      success = await addTaskToFirestore(newTask);
    }

    if (success) {
      // Reset form
      setNewTask({
        title: "",
        dueDate: "",
        category: "Maintenance",
        priority: "Medium",
        notes: "",
        completed: false,
      });
      setIsDialogOpen(false);
    }
  };

  // Get color for priority badge
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return { color: "info", bgcolor: theme.palette.info.light };
      case "Medium":
        return { color: "success", bgcolor: theme.palette.success.light };
      case "High":
        return { color: "warning", bgcolor: theme.palette.warning.light };
      case "Urgent":
        return { color: "error", bgcolor: theme.palette.error.light };
      default:
        return { color: "default", bgcolor: "#f5f5f5" };
    }
  };

  // Check if a task is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Filter tasks based on selection
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    const statusMatch =
      filter === "all"
        ? true
        : filter === "completed"
        ? task.completed
        : filter === "upcoming"
        ? !task.completed
        : filter === "overdue"
        ? !task.completed && isOverdue(task.dueDate)
        : true;

    // Category filter
    const categoryMatch =
      categoryFilter === "all" ? true : task.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // Then by the selected sort criteria
    if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === "priority") {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  // Calculate completion percentage
  const completionPercentage =
    tasks.length > 0
      ? Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        )
      : 0;

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(to bottom, #f1f8e9, #ffffff)",
          border: `1px solid ${theme.palette.primary.light}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
              color: theme.palette.primary.dark,
            }}
          >
            <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Garden Task Manager
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
            sx={{
              borderRadius: 20,
              px: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
              "&:hover": {
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.6
                )}`,
              },
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* Progress bar */}
        <Box sx={{ mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
          >
            <Typography variant="body2" color="text.secondary">
              Task completion ({completionPercentage}%)
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              color={theme.palette.primary.main}
            >
              {tasks.filter((t) => t.completed).length} / {tasks.length}{" "}
              completed
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        </Box>

        {/* Filter and sort controls */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          mb={3}
          p={2}
          borderRadius={2}
          bgcolor={alpha(theme.palette.primary.light, 0.08)}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading state */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          /* Task List */
          <Box sx={{ maxHeight: "500px", overflow: "auto", px: 0.5 }}>
            {sortedTasks.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={6}
                bgcolor={alpha(theme.palette.primary.light, 0.05)}
                borderRadius={2}
              >
                <AssignmentIcon
                  sx={{
                    fontSize: 60,
                    color: alpha(theme.palette.primary.main, 0.3),
                    mb: 2,
                  }}
                />
                <Typography align="center" color="textSecondary">
                  No tasks found. Add a new task to get started.
                </Typography>
              </Box>
            ) : (
              sortedTasks.map((task) => (
                <Card
                  key={task.id}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    bgcolor: task.completed
                      ? alpha(theme.palette.success.light, 0.5)
                      : "white",
                    borderRadius: 2,
                    borderLeft: 4,
                    borderColor: `${
                      theme.palette[getPriorityColor(task.priority).color].main
                    }`,
                    transition: "all 0.2s ease",
                    boxShadow: task.completed
                      ? "none"
                      : `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
                    "&:hover": {
                      boxShadow: task.completed
                        ? "none"
                        : `0 4px 12px ${alpha(
                            theme.palette.common.black,
                            0.08
                          )}`,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ pb: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box display="flex" alignItems="flex-start">
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                          color="primary"
                          sx={{
                            mt: -0.5,
                            ml: -1,
                            color: theme.palette.primary.main,
                            "&.Mui-checked": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />

                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              textDecoration: task.completed
                                ? "line-through"
                                : "none",
                              color: task.completed
                                ? "text.secondary"
                                : "text.primary",
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            <Chip
                              icon={<EventIcon fontSize="small" />}
                              label={`Due: ${new Date(
                                task.dueDate
                              ).toLocaleDateString()}`}
                              size="small"
                              color={
                                isOverdue(task.dueDate) && !task.completed
                                  ? "error"
                                  : "default"
                              }
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />

                            <Chip
                              label={task.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 1,
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.08
                                ),
                                borderColor: alpha(
                                  theme.palette.primary.main,
                                  0.3
                                ),
                                color: theme.palette.primary.dark,
                              }}
                            />

                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                borderRadius: 1,
                                bgcolor: getPriorityColor(task.priority)
                                  .bgcolor,
                                color:
                                  theme.palette[
                                    getPriorityColor(task.priority).color
                                  ].dark,
                                fontWeight: 500,
                              }}
                            />
                          </Box>

                          {task.notes && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              {task.notes}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditTask(task)}
                          sx={{
                            color: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                            },
                            mr: 1,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                          sx={{
                            color: theme.palette.error.main,
                            bgcolor: theme.palette.error.light,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.error.main, 0.15),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Task Summary */}
        <Divider
          sx={{ my: 3, borderColor: alpha(theme.palette.primary.main, 0.1) }}
        />

        <Box
          display="flex"
          justifyContent="space-around"
          flexWrap="wrap"
          p={2}
          borderRadius={2}
          bgcolor={alpha(theme.palette.primary.light, 0.08)}
        >
          <Box display="flex" flexDirection="column" alignItems="center" p={1}>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
            <Typography
              variant="h6"
              color={theme.palette.primary.main}
              fontWeight={600}
            >
              {tasks.length}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" p={1}>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
            <Typography
              variant="h6"
              color={theme.palette.success.main}
              fontWeight={600}
            >
              {tasks.filter((t) => t.completed).length}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" p={1}>
            <Typography variant="body2" color="text.secondary">
              Upcoming
            </Typography>
            <Typography
              variant="h6"
              color={theme.palette.info.main}
              fontWeight={600}
            >
              {
                tasks.filter(
                  (t) => !t.completed && new Date(t.dueDate) >= new Date()
                ).length
              }
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" p={1}>
            <Typography variant="body2" color="text.secondary">
              Overdue
            </Typography>
            <Typography
              variant="h6"
              color={theme.palette.error.main}
              fontWeight={600}
            >
              {
                tasks.filter(
                  (t) => !t.completed && new Date(t.dueDate) < new Date()
                ).length
              }
            </Typography>
          </Box>
        </Box>

        {/* Task Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 2,
              backgroundImage: `linear-gradient(to bottom, ${alpha(
                theme.palette.primary.light,
                0.05
              )}, white)`,
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              pb: 2,
            }}
          >
            {editingTaskId ? "Edit Garden Task" : "Add New Garden Task"}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField
                  label="Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  error={!newTask.title && isDialogOpen}
                  helperText={
                    !newTask.title && isDialogOpen ? "Title is required" : ""
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  variant="outlined"
                  error={!newTask.dueDate && isDialogOpen}
                  helperText={
                    !newTask.dueDate && isDialogOpen
                      ? "Due date is required"
                      : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    label="Priority"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(
                          theme.palette[
                            getPriorityColor(newTask.priority).color
                          ].main,
                          0.5
                        ),
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          theme.palette[
                            getPriorityColor(newTask.priority).color
                          ].main,
                      },
                    }}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor:
                                theme.palette[getPriorityColor(priority).color]
                                  .main,
                              mr: 1,
                            }}
                          />
                          {priority}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    label="Category"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Notes (Optional)"
                  value={newTask.notes}
                  onChange={(e) =>
                    setNewTask({ ...newTask, notes: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                  placeholder="Add any additional details about this garden task..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setIsDialogOpen(false)}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  bgcolor: alpha(theme.palette.common.black, 0.05),
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveTask}
              variant="contained"
              disabled={!newTask.title || !newTask.dueDate}
              sx={{
                borderRadius: 20,
                px: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
                "&:hover": {
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.6
                  )}`,
                },
                "&.Mui-disabled": {
                  background: theme.palette.action.disabledBackground,
                },
              }}
            >
              {editingTaskId ? "Update Task" : "Add Task"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </ThemeProvider>
  );
}
