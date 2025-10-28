import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DestinationDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<{ name: string; rating: string; comment: string }[]>([]);
  const [newReview, setNewReview] = useState({ name: "", rating: "", comment: "" });

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">No destination data available.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const { id, name, image, description, location, category, openingHours } = state;

  // Load reviews
  useEffect(() => {
    const savedReviews = localStorage.getItem(`destination_reviews_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews([
        { name: "Sofia", rating: "⭐ 5/5", comment: "Amazing place, I had so much fun!" },
        { name: "Liam", rating: "⭐ 4/5", comment: "Very scenic and peaceful." },
      ]);
    }
  }, [id]);

  // Save to localStorage
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`destination_reviews_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id]);

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert("Please fill out all fields before submitting!");
      return;
    }

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`destination_reviews_${id}`, JSON.stringify(updatedReviews));

    setNewReview({ name: "", rating: "", comment: "" });
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;

    const numericRatings = reviews
      .map((r) => {
        const num = r.rating.match(/([0-5])/);
        return num ? parseInt(num[0]) : 0;
      })
      .filter((n) => n > 0);

    if (numericRatings.length === 0) return 0;

    const avg = numericRatings.reduce((a, b) => a + b, 0) / numericRatings.length;
    return avg.toFixed(1);
  };

  const averageRating = calculateAverageRating();

  useEffect(() => {
    document.title = name
      ? `${name} - Destination Details`
      : "Destination Details";
  }, [name]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-6">{category || "Destination"}</p>

        {/* Image */}
        <div className="rounded-lg overflow-hidden mb-6">
          <img
            src={image}
            alt={name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4">{description}</p>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>

        {/* Opening Hours */}
        {openingHours && (
          <p className="text-gray-600 mb-6">⏰ {openingHours}</p>
        )}

        {/* Directions Button */}
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

        {/* 💬 Reviews Section */}
        <div className="mt-10 mb-10 border-t pt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            User Reviews
          </h2>

          {/* Add Review Form */}
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

          {/* ⭐ Average Rating */}
          <p className="text-yellow-500 font-semibold mb-6">
            ⭐ Average Rating: {averageRating} / 5{" "}
            <span className="text-gray-600">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </p>

          {/* Existing Reviews */}
          <div className="space-y-4">
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
      </main>

      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
