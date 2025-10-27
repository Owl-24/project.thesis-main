import React from "react";
import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

interface TouristSpotCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  category: string;
  openingHours?: string;
  rating?: string; 
}

const TouristSpotCard = ({
  id,
  name,
  image,
  description,
  location,
  category,
  openingHours = "Open 24 hours",
  rating = "4.5", // ⭐ default as string
}: TouristSpotCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-[350px] h-[400px] overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">
      {/* 🖼️ Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-black/70 text-white"
        >
          {category}
        </Badge>

        <button className="group absolute top-3 left-3 bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500">
          <i className="fa-solid fa-bookmark text-red-500 transition-all duration-300 group-hover:text-white"></i>
        </button>
      </div>

      {/* 🧭 Header */}
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xl font-bold truncate">{name}</CardTitle>

        {/* ⭐ Star Rating */}
        {rating && (
          <p className="text-gray-800 text-sm mt-1">{rating}</p>

        )}

        {/* 🕒 Opening Hours */}
        {openingHours && (
          <p className="text-gray-500 text-xs mt-1">{openingHours}</p>
        )}

        {/* 📍 Location */}
        <p className="text-gray-400 text-xs mt-1">{location}</p>
      </CardHeader>

      {/* 📄 Content */}
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>

      {/* 🦶 Footer */}
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/tourist-spots/${id}`, {
              state: {
                id,
                name,
                image,
                description,
                location,
                category,
                openingHours,
                rating,
              },
            })
          }
        >
          View Details
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  const destination = encodeURIComponent(`${name} ${location}`);
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
                  window.open(mapsUrl, "_blank");
                },
                (error) => {
                  console.error("Geolocation error:", error);
                  const fallbackUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(
                    name + " " + location
                  )}`;
                  window.open(fallbackUrl, "_blank");
                }
              );
            } else {
              alert("Geolocation is not supported by your browser.");
            }
          }}
        >
          <MapPin className="w-4 h-4 mr-1" /> Directions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TouristSpotCard;
