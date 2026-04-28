function CountryModal({ country, onClose }) {
  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0]?.common || 'N/A'
    : 'N/A'
  const topLevelDomain = country.tld?.join(', ') || 'N/A'
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(', ')
    : 'N/A'
  const borders = country.borders?.join(', ') || 'N/A'

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>{country.name.common}</h2>
            <p>{country.region || 'N/A'}</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
          [X]
          </button>
        </div>

        <img
          className="country-flag"
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
        />

        <div className="modal-details">
          <p>
            <strong>Native Name:</strong> {nativeName}
          </p>
          <p>
            <strong>Subregion:</strong> {country.subregion || 'N/A'}
          </p>
          <p>
            <strong>Top Level Domain:</strong> {topLevelDomain}
          </p>
          <p>
            <strong>Currencies:</strong> {currencies}
          </p>
          <p>
            <strong>Borders:</strong> {borders}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CountryModal
