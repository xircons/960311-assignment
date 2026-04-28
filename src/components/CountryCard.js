import { createElement } from 'react'

function CountryCard({ country }) {
  const capital = country.capital?.[0] || 'N/A'
  const languages = country.languages
    ? Object.values(country.languages).slice(0, 2).join(', ')
    : 'N/A'

  return createElement(
    'article',
    { className: 'country-card' },
    createElement('img', {
      className: 'country-flag',
      src: country.flags.svg,
      alt: `Flag of ${country.name.common}`,
    }),
    createElement(
      'div',
      { className: 'country-card-content' },
      createElement('h2', null, country.name.common),
      createElement(
        'p',
        null,
        createElement('strong', null, 'Capital:'),
        ` ${capital}`
      ),
      createElement(
        'p',
        null,
        createElement('strong', null, 'Population:'),
        ` ${country.population.toLocaleString()}`
      ),
      createElement(
        'p',
        null,
        createElement('strong', null, 'Languages:'),
        ` ${languages || 'N/A'}`
      )
    )
  )
}

export default CountryCard
