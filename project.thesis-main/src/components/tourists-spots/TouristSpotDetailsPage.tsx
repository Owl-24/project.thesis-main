import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TouristSpotDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<{ name: string; rating: string; comment: string }[]>([]);
  const [newReview, setNewReview] = useState({ name: "", rating: "", comment: "" });

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">No tourist spot data available.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const { id, name, image, description, location, category, openingHours } = state;

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews([
        { name: "Jane", rating: "⭐ 5/5", comment: "Beautiful place! Must visit again!" },
        { name: "Mark", rating: "⭐ 4/5", comment: "Very peaceful and relaxing area." },
      ]);
    }
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id]);

  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, r) => acc + parseInt(r.rating.match(/\d(?=\/5)/)?.[0] || "0"), 0) /
        reviews.length
      ).toFixed(1)
    : "No ratings yet";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert("Please fill out all fields before submitting!");
      return;
    }

    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setNewReview({ name: "", rating: "", comment: "" });
  };

  useEffect(() => {
    document.title = name
      ? `${name} - Tourist Spot Details`
      : "Tourist Spot Details";
  }, [name]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        {/* Header Section */}
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-6">{category}</p>

        {/* Image */}
        <div className="rounded-lg overflow-hidden mb-6">
          <img
            src={image}
            alt={name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Details */}
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>
        <p className="text-gray-600 mb-6">{openingHours}</p>

        <Button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(
                name + " " + location
              )}`,
              "_blank"
            )
          }
        >
          Get Directions
        </Button>
      </div>

      {/* 💬 Reviews Section */}
      <div className="container mx-auto px-4 mt-10 mb-10">
        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">User Reviews</h2>

          {/* ⭐ Average Rating */}
          <p className="text-lg font-semibold text-gray-800 mb-6">
            Average Rating:{" "}
            <span className="text-yellow-500">
              {averageRating === "No ratings yet" ? averageRating : `⭐ ${averageRating} / 5`}
            </span>
          </p>

          {/* ✏️ Add Review Box FIRST */}
          <form className="space-y-3 mb-8" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border rounded px-3 py-2"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
            />

            <select
              className="w-full border rounded px-3 py-2"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
            >
              <option value="">Rate this place</option>
              <option>⭐ 5/5 - Excellent</option>
              <option>⭐ 4/5 - Very Good</option>
              <option>⭐ 3/5 - Average</option>
              <option>⭐ 2/5 - Poor</option>
              <option>⭐ 1/5 - Terrible</option>
            </select>

            <textarea
              placeholder="Your review..."
              className="w-full border rounded px-3 py-2 h-24"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>

          {/* 🧾 Existing Reviews BELOW */}
          <div className="space-y-4 mb-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-yellow-500">{r.rating}</p>
                  <p className="text-gray-700 mt-1">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TouristSpotDetailsPage;
