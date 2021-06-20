import { useState } from 'react'
import React from 'react'

const SearchBar = ({searchQuery, setSearchQuery}) => {

  const onSubmit = (e) => {
    e.preventDefault()

    }

  return (
      <React.Fragment>
    <form action="/" method="get">
        <label htmlFor="header-search">
            <span className="visually-hidden">Search blog posts</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Search blog posts"
            name="s"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} 
        />
        <button type="submit">Search</button>
    </form>

    
      </React.Fragment>
  )
}

export default SearchBar
