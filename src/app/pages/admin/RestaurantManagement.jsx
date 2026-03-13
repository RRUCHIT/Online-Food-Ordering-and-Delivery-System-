import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Star, CheckCircle, XCircle } from "lucide-react";
import API from "../../api/axios";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

const statusStyles = {
  approved: "bg-green-500 text-white",
  pending: "bg-orange-500 text-white",
  rejected: "bg-red-500 text-white",
};

export function RestaurantManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine: "",
    deliveryTime: "",
    rating: "",
    address: "",
    phone: "",
    image: "",
    status: "approved",
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/api/restaurants?includeAll=true");
      setRestaurants(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load restaurants");
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name?.toLowerCase().includes(query) ||
      restaurant.cuisine?.toLowerCase().includes(query) ||
      restaurant.ownerName?.toLowerCase().includes(query) ||
      restaurant.status?.toLowerCase().includes(query)
    );
  });

  const handleAddNew = () => {
    setEditingRestaurant(null);
    setFormData({
      name: "",
      description: "",
      cuisine: "",
      deliveryTime: "",
      rating: "",
      address: "",
      phone: "",
      image: "",
      status: "approved",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name || "",
      description: restaurant.description || "",
      cuisine: restaurant.cuisine || "",
      deliveryTime: restaurant.deliveryTime || "",
      rating: restaurant.rating?.toString?.() || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      image: restaurant.image || "",
      status: restaurant.status || "approved",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.cuisine) {
      toast.error("Please fill in required fields");
      return;
    }

    const payload = {
      ...formData,
      rating: Number(formData.rating || 0),
    };

    try {
      if (editingRestaurant) {
        await API.put(
          `/api/restaurants/${editingRestaurant._id}`,
          payload
        );
        toast.success("Restaurant updated successfully");
      } else {
        await API.post("/api/restaurants", payload);
        toast.success("Restaurant added successfully");
      }

      fetchRestaurants();
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/restaurants/${id}`);
      toast.success("Restaurant removed");
      fetchRestaurants();
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/api/restaurants/${id}/status`, {
        status
      });

      toast.success(`Restaurant ${status}`);
      fetchRestaurants();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Restaurant Management</h1>
          <p className="text-gray-600">
            Review pending signup requests and manage platform restaurants
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? "Edit Restaurant" : "Add Restaurant"}
              </DialogTitle>
              <DialogDescription>
                Fill restaurant details
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
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Cuisine</Label>
                  <Input
                    value={formData.cuisine}
                    onChange={(e) =>
                      setFormData({ ...formData, cuisine: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Delivery Time</Label>
                  <Input
                    value={formData.deliveryTime}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
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
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <Input
            placeholder="Search restaurants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant._id}>
            <CardHeader>
              <div className="flex justify-between gap-3">
                <h3 className="font-bold text-xl">{restaurant.name}</h3>

                <Badge className={statusStyles[restaurant.status] || statusStyles.approved}>
                  {restaurant.status || "approved"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">
                  {restaurant.cuisine || "No cuisine"}
                </Badge>

                <Badge className="bg-yellow-500">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  {restaurant.rating || 0}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                {restaurant.description || "No description provided"}
              </p>

              <p className="text-sm text-gray-500">
                Delivery: {restaurant.deliveryTime || "Not set"}
              </p>

              <p className="text-sm text-gray-500">
                Owner: {restaurant.ownerName || "Admin created"}
              </p>

              <p className="text-sm text-gray-500">
                Email: {restaurant.ownerEmail || "Not provided"}
              </p>

              <p className="text-sm text-gray-500">
                Phone: {restaurant.phone || "Not provided"}
              </p>

              <p className="text-sm text-gray-500">
                Address: {restaurant.address || "Not provided"}
              </p>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2">
              {restaurant.status !== "approved" && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange(restaurant._id, "approved")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              )}

              {restaurant.status !== "rejected" && (
                <Button
                  variant="outline"
                  className="text-red-500"
                  onClick={() => handleStatusChange(restaurant._id, "rejected")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              )}

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleEdit(restaurant)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                className="flex-1 text-red-500"
                onClick={() => handleDelete(restaurant._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
