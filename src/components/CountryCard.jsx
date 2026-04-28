function CountryCard({
  country,
  isFavorite,
  onToggleFavorite,
  onSelectCountry,
}) {
  const capital = country.capital?.[0] || 'N/A'
  const languages = country.languages
    ? Object.values(country.languages).slice(0, 2).join(', ')
    : 'N/A'

  return (
    <article className="country-card">
      <button
        type="button"
        className={`favorite-toggle${isFavorite ? ' active' : ''}`}
        onClick={() => onToggleFavorite(country.name.common)}
        aria-label={
          isFavorite
            ? `Remove ${country.name.common} from favorites`
            : `Add ${country.name.common} to favorites`
        }
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <button
        type="button"
        className="country-view"
        onClick={() => onSelectCountry(country)}
      >
        <img
          className="country-flag"
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
        />

        <div className="country-card-content">
          <h2>{country.name.common}</h2>
          <p>
            <strong>Capital:</strong> {capital}
          </p>
          <p>
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>
          <p>
            <strong>Languages:</strong> {languages || 'N/A'}
          </p>
          <span className="view-label">VIEW</span>
        </div>
      </button>
    </article>
  )
}

export default CountryCard
