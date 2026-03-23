import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Navigation, MapPin, Truck, Timer, Map as MapIcon } from 'lucide-react';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons
const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4287/4287725.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const customerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1275/1275214.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/709/709790.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component to handle auto-zooming to fit all markers
function ChangeView({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const group = new L.featureGroup(markers.map(m => L.marker(m.pos)));
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }, [markers, map]);
  return null;
}

export function MapTracker({ status, orderId }) {
  // Fixed simulated locations (Coordinates for a typical city area)
  const restaurantPos = [19.0760, 72.8777]; // Example: Mumbai
  const customerPos = [19.1136, 72.8697];   // Example: A few km away

  const [deliveryPos, setDeliveryPos] = useState(restaurantPos);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(25);
  const [distance, setDistance] = useState(4.2);

  const isMoving = status === "out_for_delivery";
  const isDelivered = status === "delivered";

  useEffect(() => {
    let interval;
    
    if (isMoving) {
      // Start movement simulation
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 2; // Move 2% every interval
          
          // Calculate intermediate position
          const lat = restaurantPos[0] + (customerPos[0] - restaurantPos[0]) * (next / 100);
          const lng = restaurantPos[1] + (customerPos[1] - restaurantPos[1]) * (next / 100);
          setDeliveryPos([lat, lng]);
          
          // Update ETA and distance
          setEta(Math.max(0, Math.round(25 * (1 - next / 100))));
          const remainingDistance = Math.max(0, (4.2 * (1 - next / 100)).toFixed(1));
          setDistance(remainingDistance);
          
          return next;
        });
      }, 2000); // Update every 2 seconds for smoother feel
    } else if (isDelivered) {
      setDeliveryPos(customerPos);
      setProgress(100);
      setEta(0);
      setDistance(0);
    } else {
      // Preparing or Pending
      setDeliveryPos(restaurantPos);
      setProgress(0);
      setEta(25);
      setDistance(4.2);
    }

    return () => clearInterval(interval);
  }, [status]);

  const markers = [
    { pos: restaurantPos, name: "Restaurant", icon: restaurantIcon },
    { pos: customerPos, name: "You", icon: customerIcon },
    { pos: deliveryPos, name: "Delivery Partner", icon: deliveryIcon },
  ];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-white/70 bg-white/90 shadow-xl">
        <CardContent className="p-0 relative">
          <div className="h-[400px] w-full z-0">
            <MapContainer 
              center={restaurantPos} 
              zoom={13} 
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeView markers={markers} />
              
              <Marker position={restaurantPos} icon={restaurantIcon}>
                <Popup>Restaurant Location</Popup>
              </Marker>
              
              <Marker position={customerPos} icon={customerIcon}>
                <Popup>Your Location</Popup>
              </Marker>

              {status !== "pending" && status !== "preparing" && (
                <Marker position={deliveryPos} icon={deliveryIcon}>
                  <Popup>Delivery Partner is here</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Floating Info Overlay */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <Badge className="bg-white/95 text-slate-900 shadow-lg border-none py-2 px-4 flex items-center gap-2">
              <Timer className="w-4 h-4 text-orange-500" />
              <span>{isDelivered ? "Delivered" : `${eta} mins away`}</span>
            </Badge>
            <Badge className="bg-white/95 text-slate-900 shadow-lg border-none py-2 px-4 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span>{isDelivered ? "0 km" : `${distance} km left`}</span>
            </Badge>
          </div>

          {/* Status Message Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-[1000]">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMoving ? 'bg-orange-100 animate-pulse' : 'bg-slate-100'}`}>
                {isDelivered ? <MapPin className="text-green-500" /> : <Truck className={isMoving ? 'text-orange-500' : 'text-slate-400'} />}
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {isDelivered 
                    ? "Enjoy your meal!" 
                    : distance < 0.5 && isMoving 
                    ? "Delivery arriving soon" 
                    : isMoving 
                    ? "Delivery Partner is on the way" 
                    : "Preparing your order"}
                </p>
                <p className="text-sm text-slate-500">
                  {isDelivered 
                    ? "Order successfully delivered" 
                    : distance < 0.5 && isMoving 
                    ? "Your food is almost at your doorstep" 
                    : isMoving 
                    ? "Your food will arrive soon" 
                    : "The restaurant is cooking your food"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
