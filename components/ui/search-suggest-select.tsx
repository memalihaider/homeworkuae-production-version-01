'use client'

import { useEffect, useMemo, useState } from 'react'

type SearchSuggestOption = {
  value: string
  label: string
  keywords?: string[]
}

type SearchSuggestSelectProps = {
  value: string
  onChange: (value: string) => void
  options: SearchSuggestOption[]
  placeholder?: string
  className?: string
  inputClassName?: string
  noResultsText?: string
  disabled?: boolean
}

export default function SearchSuggestSelect({
  value,
  onChange,
  options,
  placeholder = 'Search and select...',
  className = '',
  inputClassName = '',
  noResultsText = 'No results found',
  disabled = false,
}: SearchSuggestSelectProps) {
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  const [query, setQuery] = useState(selectedOption?.label || '')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setQuery(selectedOption?.label || '')
  }, [selectedOption?.label])

  const filteredOptions = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options

    return options.filter((option) => {
      const haystack = [option.label, option.value, ...(option.keywords || [])]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [options, query])

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    const nextOption = options.find((option) => option.value === nextValue)
    setQuery(nextOption?.label || '')
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
          if (!event.target.value.trim()) {
            onChange('')
          }
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setIsOpen(false)
            const exactMatch = options.find(
              (option) => option.label.toLowerCase() === query.trim().toLowerCase(),
            )

            if (exactMatch) {
              onChange(exactMatch.value)
              setQuery(exactMatch.label)
              return
            }

            if (!query.trim()) {
              onChange('')
              return
            }

            // Revert to selected option if typed text is not a valid choice.
            setQuery(selectedOption?.label || '')
          }, 120)
        }}
        placeholder={placeholder}
        className={inputClassName}
      />

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  handleSelect(option.value)
                }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-slate-500">{noResultsText}</p>
          )}
        </div>
      )}
    </div>
  )
}
