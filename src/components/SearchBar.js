import { createElement, useRef } from 'react'

function SearchBar({ searchTerm, onSearch }) {
  const inputRef = useRef(null)

  const handleClear = () => {
    onSearch('')
    inputRef.current?.focus()
  }

  return createElement(
    'div',
    { className: 'search-bar' },
    createElement('input', {
      ref: inputRef,
      type: 'text',
      value: searchTerm,
      onChange: (event) => onSearch(event.target.value),
      placeholder: 'Search countries by name...',
      'aria-label': 'Search countries by name',
    }),
    createElement(
      'button',
      {
        type: 'button',
        onClick: handleClear,
      },
      'Clear'
    )
  )
}

export default SearchBar
