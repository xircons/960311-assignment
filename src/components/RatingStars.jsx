function RatingStars({ rating, reviews }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className="rating">
      <span>
        {"★".repeat(fullStars)}
        {hasHalf ? "☆" : ""}
        {" ".repeat(emptyStars)}
      </span>
      <span className="review-count">({reviews} reviews)</span>
    </div>
  )
}

export default RatingStars
