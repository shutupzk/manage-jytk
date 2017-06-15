import React, { Component } from 'react'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this.state = { term: '' }
  }

  render () {
    return (
      <div className='search-bar'>
        <input className='textInput'
          placeholder='搜索科室或医生'
          style={{width: '100%'}}
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)} />
      </div>
    )
  }

  onInputChange (term) {
    this.setState({term})
    this.props.searchDep(term)
  }
}

export default SearchBar
