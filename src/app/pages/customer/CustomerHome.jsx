import { useEffect, useState } from "react";
import { Search, Plus, ShoppingCart } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const { addToCart, cart, currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    API
      .get("/api/restaurants")
      .then((res) => {
        setRestaurants(res.data);
      });
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) {
      return;
    }

    API
      .get(`/api/menu/${selectedRestaurant._id}`)
      .then((res) => {
        setMenuItems(res.data);
      });
  }, [selectedRestaurant]);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item) => {
    if (!selectedRestaurant) {
      return;
    }

    if (!(currentUser?._id || currentUser?.id)) {
      toast.error("Please log in to add items to cart", {
        description: "You can browse freely, but ordering needs an account."
      });
      navigate("/login");
      return;
    }

    addToCart({
      ...item,
      id: item._id,
      restaurantId: selectedRestaurant._id,
      restaurantName: selectedRestaurant.name,
    });

    toast.success(`${item.name} added to cart!`);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#fff1f2_0%,#ffffff_48%,#fff7ed_100%)] border border-white/70 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex justify-between items-center gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-3">Browse Restaurants</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Discover Delicious Food</h1>
          <p className="text-slate-600 mt-2">
            Order from the best restaurants near you
          </p>
        </div>

        <Button
          className="relative rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
          onClick={() => navigate("/customer/cart")}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search restaurants..."
            className="pl-10 rounded-full bg-white/90 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant._id}
            className={`cursor-pointer overflow-hidden border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${
              selectedRestaurant?._id === restaurant._id
                ? "ring-2 ring-rose-500"
                : ""
            }`}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <img
              src={restaurant.image || "https://placehold.co/600x400?text=Restaurant"}
<<<<<<< HEAD
              className="h-48 w-full object-cover"
=======
            className="h-48 w-full object-cover"
>>>>>>> 4cf86f5ca086441cb68307469e1c28b498815031
            />

            <CardHeader>
              <h3 className="font-bold text-xl">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedRestaurant && (
        <div className="mt-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">{selectedRestaurant.name} Menu</h2>
          <p className="text-slate-600 mb-6">
            {selectedRestaurant.description || "Browse and add your favorite dishes"}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item._id} className="overflow-hidden border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <img
                  src={item.image || "https://placehold.co/600x400?text=Food"}
                  className="h-48 w-full object-cover"
                />

                <CardHeader>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
<<<<<<< HEAD
                  <p className="font-bold text-rose-500 mt-2">₹{item.price}</p>
=======
                  <p className="font-bold text-rose-500 mt-2">${item.price}</p>
>>>>>>> 4cf86f5ca086441cb68307469e1c28b498815031
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={() => handleAddToCart(item)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
