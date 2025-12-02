import * as React from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const columns = [
  { id: "id", label: "ID", minWidth: 100 },
  { id: "avatar", label: "Avatar", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "createdAt", label: "Created At", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 120 },
  { id: "update", label: "Update", minWidth: 120 },
  
];

export default function StickyHeadTable() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    avatar: "",
    createdAt: "",
  });

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("https://68a04cea6e38a02c58184c4b.mockapi.io/users")
      .then((res) => {
        setRows(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`https://68a04cea6e38a02c58184c4b.mockapi.io/users/${id}`)
      .then((res) => {
        setRows(rows.filter((row) => row.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleOpenAddDialog = () => {
    setFormData({ name: "", avatar: "", createdAt: "" });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({ name: "", avatar: "", createdAt: "" });
  };

  const handleOpenUpdateDialog = (row) => {
    setEditingId(row.id);
    setFormData({
      name: row.name || "",
      avatar: row.avatar || "",
      createdAt: row.createdAt || "",
    });
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setEditingId(null);
    setFormData({ name: "", avatar: "", createdAt: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post("https://68a04cea6e38a02c58184c4b.mockapi.io/users", {
        name: formData.name,
        avatar: formData.avatar,
        createdAt: formData.createdAt || new Date().toISOString(),
      });
      setRows([...rows, res.data]);
      handleCloseAddDialog();
      setPage(0);
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user. Please try again.");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://68a04cea6e38a02c58184c4b.mockapi.io/users/${editingId}`,
        {
          name: formData.name,
          avatar: formData.avatar,
          createdAt: formData.createdAt,
        }
      );
      setRows(rows.map((row) => (row.id === editingId ? res.data : row)));
      handleCloseUpdateDialog();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" disableElevation onClick={handleOpenAddDialog}>
          Add New User
        </Button>
      </Box>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Avatar URL"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              fullWidth
              placeholder="https://example.com/avatar.jpg"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!formData.name}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Avatar URL"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              fullWidth
              placeholder="https://example.com/avatar.jpg"
            />
            <TextField
              label="Created At"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleInputChange}
              fullWidth
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={!formData.name}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                        No users found. Click "Add New User" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    if (column.id === "avatar") {
                      return (
                        <TableCell key={column.id}>
                          <img
                            src={value}
                            alt="Avatar"
                            width={40}
                            height={40}
                            style={{ borderRadius: "50%" }}
                          />
                        </TableCell>
                      );
                    }

                    if (column.id === "update") {
                      return (
                        <TableCell key={column.id}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpenUpdateDialog(row)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      );
                    }

                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </>
  );
}
