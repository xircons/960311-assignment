import "./App.css"
import products from "./data/products"
import ProductCard from "./components/ProductCard"

function App() {
  const availableCount = products.filter((p) => p.inStock).length

  return (
    <main className="app">
      <header className="app-header">
        <h1>Techkub</h1>
        <p>
          {products.length} products | {availableCount} available
        </p>
      </header>

      <div className="gallery-grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </main>
  )
}

export default App
