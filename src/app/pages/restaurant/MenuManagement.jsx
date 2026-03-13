import { useEffect, useState } from "react";
import { Plus, Trash2, Search, Pencil } from "lucide-react";
import API from "../../api/axios";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  image: ""
};

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const user = JSON.parse(localStorage.getItem("user"));
  const ownerId = user?._id || user?.id;

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    let isActive = true;

    API
      .get(`/api/restaurants/owner/${ownerId}`)
      .then((res) => {
        if (!isActive) {
          return;
        }

        if (!res.data) {
          toast.error("Restaurant profile not found", {
            id: "restaurant-profile-not-found"
          });
          return;
        }

        setRestaurant(res.data);
      })
      .catch(() => {
        if (isActive) {
          toast.error("Restaurant profile not found", {
            id: "restaurant-profile-not-found"
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [ownerId]);

  useEffect(() => {
    if (!restaurant?._id) {
      return;
    }

    let isActive = true;

    API
      .get(`/api/menu/${restaurant._id}`)
      .then((res) => {
        if (isActive) {
          setMenuItems(res.data);
        }
      })
      .catch(() => {
        if (isActive) {
          toast.error("Failed to load menu items", {
            id: "menu-load-failed"
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [restaurant]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      price: item.price?.toString?.() || "",
      image: item.image || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!restaurant?._id) {
      toast.error("Restaurant account is not ready");
      return;
    }

    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Fill item name, category, and price");
      return;
    }

    const payload = {
      restaurantId: restaurant._id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      image: formData.image
    };

    try {
      if (editingItem) {
        const res = await API.put(
          `/api/menu/${editingItem._id}`,
          payload
        );

        setMenuItems((prev) =>
          prev.map((item) => item._id === editingItem._id ? res.data : item)
        );
        toast.success("Menu item updated");
      } else {
        const res = await API.post("/api/menu", payload);

        setMenuItems((prev) => [res.data, ...prev]);
        toast.success("Menu item added");
      }

      setFormData(emptyForm);
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save item");
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/api/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Item deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-gray-600">
            {restaurant?.name || "Your restaurant"} menu items
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={openCreateDialog}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
              <DialogDescription>
                Create or update an item for your restaurant menu
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingItem(null);
                  setFormData(emptyForm);
                }}
              >
                Cancel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave}>
                {editingItem ? "Update Item" : "Save Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item._id}>
            <img
              src={item.image || "https://placehold.co/600x400?text=Menu+Item"}
              className="h-48 w-full object-cover"
            />

            <CardHeader>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <Badge className="w-fit">{item.category}</Badge>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-gray-600">{item.description || "No description"}</p>
              <p className="text-orange-500 font-bold">
                ${Number(item.price).toFixed(2)}
              </p>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={() => openEditDialog(item)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => deleteItem(item._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {restaurant && filteredItems.length === 0 && (
        <p className="text-gray-500 mt-6">No menu items yet.</p>
      )}
    </div>
  );
}
