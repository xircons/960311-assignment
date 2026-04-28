import { useMemo, useState } from 'react'
import CountryCard from './components/CountryCard.jsx'
import SearchBar from './components/SearchBar'
import useFetch from './hooks/useFetch'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const { data, loading, error } = useFetch(
    'https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,languages'
  )
  const countries = data ?? []

  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

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
          selectedRegion === 'All' || country.region === selectedRegion

        return matchesSearch && matchesRegion
      })
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
  }, [countries, searchTerm, selectedRegion])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Country Explorer</h1>
        <p>Browse countries by name and region.</p>
      </header>

      <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />

      <div className="filters">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={selectedRegion === region ? 'active' : ''}
          >
            {region}
          </button>
        ))}
      </div>

      {loading && <p className="status-message">Loading countries...</p>}
      {error && <p className="status-message error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <p className="stats-text">
            Showing {filtered.length} of {countries.length} countries
          </p>

          <div className="country-grid">
            {filtered.map((country) => (
              <CountryCard key={country.name.common} country={country} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
