function CountryCard({ country }) {
  const capital = country.capital?.[0] || 'N/A'
  const languages = country.languages
    ? Object.values(country.languages).slice(0, 2).join(', ')
    : 'N/A'

  return (
    <article className="country-card">
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
      </div>
    </article>
  )
}

export default CountryCard
