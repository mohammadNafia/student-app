import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash, Edit, UserPlus, Loader, ChevronLeft, ChevronRight } from "lucide-react";

export default function StudentCard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  
  // table state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // modal state
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [targetId, setTargetId] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    avatar: "",
    createdAt: "",
  });

  const api_url = "https://68a04cea6e38a02c58184c4b.mockapi.io/users";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    axios.get(api_url)
      .then(res => {
        setList(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.log("fetch error", err);
        setErrMsg("Failed to load students list.");
        setLoading(false);
      });
  };

  const removeStudent = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    axios.delete(`${api_url}/${deleteId}`)
      .then(() => {
        setList(list.filter(item => item.id !== deleteId));
        setShowDelete(false);
        setDeleteId(null);
      })
      .catch(err => {
        alert("Delete failed");
        setShowDelete(false);
      });
  };

  const openEdit = (data) => {
    setTargetId(data.id);
    setForm({
      name: data.name || "",
      avatar: data.avatar || "",
      createdAt: data.createdAt || "",
    });
    setShowEdit(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    
    try {
      const payload = {
        name: form.name,
        avatar: form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`,
        createdAt: new Date().toISOString()
      };
      
      const res = await axios.post(api_url, payload);
      setList([res.data, ...list]);
      setForm({ name: "", avatar: "", createdAt: "" });
      setShowAdd(false);
      setCurrentPage(0);
    } catch (e) {
      alert("Error adding student");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${api_url}/${targetId}`, form);
      setList(list.map(s => s.id === targetId ? res.data : s));
      setShowEdit(false);
    } catch (e) {
      alert("Update failed");
    }
  };

  const onInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // pagination calc
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const displayList = list.slice(start, end);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => { setForm({name:"", avatar:"", createdAt:""}); setShowAdd(true); }}
          className="bg-[#A5C89E] hover:bg-[#D8E983] text-black font-semibold"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add New Student
        </Button>
      </div>

      {errMsg && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errMsg}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center py-20 bg-gray-50/50">
            <Loader className="animate-spin mb-2 text-gray-400" />
            <p className="text-gray-400 text-sm">Loading records...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold text-center w-20">Photo</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">No data found.</TableCell>
                  </TableRow>
                ) : (
                  displayList.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="text-gray-500">#{item.id}</TableCell>
                      <TableCell className="flex justify-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>{item.name[0]}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 bg-[#D8E983]/20 hover:bg-[#D8E983]" onClick={() => openEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-red-100 text-red-500 border-red-100" onClick={() => removeStudent(item.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-end px-4 py-3 border-t bg-gray-50/30 gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Rows:</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(0); }}>
                  <SelectTrigger className="w-16 h-8 text-xs border-none shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <span className="text-xs text-gray-500">
                {start + 1}-{Math.min(end, list.length)} of {list.length}
              </span>

              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={end >= list.length} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input name="name" value={form.name} onChange={onInputChange} placeholder="Ex: John Doe" />
            </div>
            <div className="space-y-1">
              <Label>Avatar Photo URL</Label>
              <Input name="avatar" value={form.avatar} onChange={onInputChange} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="bg-[#A5C89E] text-black" onClick={handleSave}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input name="name" value={form.name} onChange={onInputChange} />
            </div>
            <div className="space-y-1">
              <Label>Photo URL</Label>
              <Input name="avatar" value={form.avatar} onChange={onInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button className="bg-[#A5C89E] text-black" onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Are you sure?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500">
              Do you really want to delete this student profile? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
