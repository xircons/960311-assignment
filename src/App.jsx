import { useMemo, useState } from 'react'
import CountryCard from './components/CountryCard.jsx'
import CountryModal from './components/CountryModal.jsx'
import SearchBar from './components/SearchBar'
import SkeletonCard from './components/SkeletonCard.jsx'
import useFetch from './hooks/useFetch'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [sortOption, setSortOption] = useState('name')
  const [favorites, setFavorites] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const { data, loading, error } = useFetch(
    'https://restcountries.com/v3.1/all?fields=name,capital,population,region,subregion,flags,languages,tld,currencies,borders'
  )
  const countries = data ?? []

  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  const skeletonCards = Array.from({ length: 8 }, (_, index) => index)

  const toggleFavorite = (countryName) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(countryName)
        ? currentFavorites.filter((name) => name !== countryName)
        : [...currentFavorites, countryName]
    )
  }

  const regionCounts = useMemo(() => {
    return countries.reduce((counts, country) => {
      const region = country.region || 'Other'
      counts[region] = (counts[region] || 0) + 1
      return counts
    }, {})
  }, [countries])

  const filtered = useMemo(() => {
    if (!countries.length) {
      return []
    }

    return [...countries]
      .filter((country) => {
        const matchesSearch = country.name.common
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesRegion =
          selectedRegion === 'All'
            ? true
            : selectedRegion === 'Favorites'
              ? favorites.includes(country.name.common)
              : country.region === selectedRegion

        return matchesSearch && matchesRegion
      })
      .sort((a, b) => {
        if (sortOption === 'population') {
          return b.population - a.population
        }

        return a.name.common.localeCompare(b.name.common)
      })
  }, [countries, favorites, searchTerm, selectedRegion, sortOption])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Country Explorer</h1>
        <p>wuttikan kubpom</p>
      </header>

      <div className="toolbar">
        <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />

        <select
          className="sort-select"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
          aria-label="Sort countries"
        >
          <option value="name">Name (A-Z)</option>
          <option value="population">Population (High to Low)</option>
        </select>
      </div>

      <div className="filters">
        <button
          type="button"
          onClick={() => setSelectedRegion('Favorites')}
          className={selectedRegion === 'Favorites' ? 'active' : ''}
        >
          FAVORITES
          <span className="region-badge">({favorites.length})</span>
        </button>

        {regions.map((region) => (
          <button
            type="button"
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={selectedRegion === region ? 'active' : ''}
          >
            {region}
            <span className="region-badge">
              ({region === 'All' ? countries.length : regionCounts[region] || 0})
            </span>
          </button>
        ))}
      </div>

      {error && <p className="status-message error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <p className="stats-text">
            Showing {filtered.length} of {countries.length} countries
          </p>

          <div className="country-grid">
            {filtered.map((country) => (
              <CountryCard
                key={country.name.common}
                country={country}
                isFavorite={favorites.includes(country.name.common)}
                onToggleFavorite={toggleFavorite}
                onSelectCountry={setSelectedCountry}
              />
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="country-grid" aria-label="Loading countries">
          {skeletonCards.map((card) => (
            <SkeletonCard key={card} />
          ))}
        </div>
      )}

      {selectedCountry && (
        <CountryModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  )
}

export default App
