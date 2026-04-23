import RatingStars from "./RatingStars"

function ProductCard({ name, price, rating, reviews, inStock, category, image }) {
  const handleAddToCart = () => {
    if (inStock) {
      alert(`Added "${name}" to cart! Price: $${price.toFixed(2)}`)
    }
  }

  return (
    <article className={`product-card ${!inStock ? "unavailable" : ""}`}>
      <div className={`badge ${inStock ? "badge-green" : "badge-red"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </div>

      <img src={image} alt={name} className="product-img" />
      <p className="category">{category}</p>
      <h3>{name}</h3>
      <RatingStars rating={rating} reviews={reviews} />

      <div className="card-footer">
        <strong>${price.toFixed(2)}</strong>
        <button className="add-btn" onClick={handleAddToCart} disabled={!inStock}>
          {inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
