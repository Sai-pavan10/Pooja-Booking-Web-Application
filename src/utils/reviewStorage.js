// src/utils/reviewStorage.js

const STORAGE_KEY = "dharma_reviews";

// Generate unique ID
export function generateId() {
  return `rev_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 11)}`;
}

// Get all reviews
export function getReviews() {
  try {
    const storedReviews = localStorage.getItem(STORAGE_KEY);

    if (!storedReviews) {
      return [];
    }

    return JSON.parse(storedReviews);
  } catch (error) {
    console.error("Error loading reviews:", error);
    return [];
  }
}

// Save review
export function saveReview(reviewData) {
  const reviews = getReviews();

  const review = {
    id: generateId(),
    name: reviewData.name?.trim() || "",
    city: reviewData.city?.trim() || "",
    service: reviewData.service?.trim() || "",
    rating: Number(reviewData.rating) || 5,
    review: reviewData.review?.trim() || "",
    date: new Date().toISOString(),
    avatarInitial:
      reviewData.name?.trim()?.charAt(0)?.toUpperCase() || "U",
  };

  reviews.unshift(review);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

  return review;
}

// Delete review
export function deleteReview(id) {
  const updatedReviews = getReviews().filter(
    (review) => review.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedReviews)
  );
}

// Average rating
export function getAverageRating(reviews = []) {
  if (!reviews.length) return 0;

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return Number((total / reviews.length).toFixed(1));
}

// Format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Filter reviews
export function filterReviews(reviews = [], rating = "all") {
  if (rating === "all") {
    return reviews;
  }

  return reviews.filter(
    (review) => review.rating === Number(rating)
  );
}

// Sort reviews
export function sortReviews(reviews = [], sortBy = "latest") {
  const sortedReviews = [...reviews];

  switch (sortBy) {
    case "latest":
      return sortedReviews.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

    case "oldest":
      return sortedReviews.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

    case "highest":
      return sortedReviews.sort(
        (a, b) => b.rating - a.rating
      );

    case "lowest":
      return sortedReviews.sort(
        (a, b) => a.rating - b.rating
      );

    default:
      return sortedReviews;
  }
}