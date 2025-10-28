import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import Footer from "../layout/Footer"; // ✅ adjust if needed

const TourismActivitiesDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activity = location.state;

  if (!activity) {
    return (
      <div className="p-8 text-center text-gray-600">
        No activity details found.
      </div>
    );
  }

  const {
    id,
    name,
    image,
    description,
    municipality,
    category = "Activity",
  } = activity;

  // 💬 Reviews (local only)
  const [reviews, setReviews] = useState<
    { name: string; rating: string; comment: string }[]
  >([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: "",
    comment: "",
  });

  // Load reviews
  useEffect(() => {
    const saved = localStorage.getItem(`activity_reviews_${id || name}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      setReviews([
        { name: "Alex", rating: "⭐ 5/5", comment: "Super fun experience!" },
        { name: "Maria", rating: "⭐ 4/5", comment: "Had a great time with friends!" },
      ]);
    }
  }, [id, name]);

  // Save to localStorage whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`activity_reviews_${id || name}`, JSON.stringify(reviews));
    }
  }, [reviews, id, name]);

  // ⭐ Average Rating
  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (acc, r) => acc + parseInt(r.rating.match(/\d(?=\/5)/)?.[0] || "0"),
          0
        ) / reviews.length
      ).toFixed(1)
    : "No ratings yet";

  // 📩 Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert("Please fill out all fields before submitting!");
      return;
    }

    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`activity_reviews_${id || name}`, JSON.stringify(updated));

    setNewReview({ name: "", rating: "", comment: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="px-6 pt-6">
        <Button
          variant="ghost"
          className="flex items-center text-gray-700 hover:text-black"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">{name}</h1>
        <p className="text-lg text-gray-600 mb-6">{category}</p>

        {/* Big Image */}
        <div className="w-full h-[480px] rounded-2xl overflow-hidden shadow-lg mb-6">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Description */}
        <div className="text-lg text-gray-700 leading-relaxed space-y-4 mb-8">
          <p>{description || "No description available for this activity."}</p>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
            <span>{municipality}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-10">
          <Button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  name + " " + municipality
                )}`,
                "_blank"
              )
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Get Directions
          </Button>
        </div>

        {/* 💬 Reviews Section */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            User Reviews
          </h2>

          {/* ⭐ Average Rating */}
          <p className="text-lg font-semibold text-gray-800 mb-6">
            Average Rating:{" "}
            <span className="text-yellow-500">
              {averageRating === "No ratings yet"
                ? averageRating
                : `⭐ ${averageRating} / 5`}
            </span>
            {reviews.length > 0 && (
              <span className="text-gray-600 ml-2">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            )}
          </p>

          {/* ✏️ Add Review Form */}
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
              <option value="">Rate this activity</option>
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

          {/* Existing Reviews */}
          <div className="space-y-4 mb-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-white"
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TourismActivitiesDetailsPage;
