import React, { Component } from 'react'
import {theme} from 'components'

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
          style={{width: '100%', padding: 0, margin: 0, border: 'none', fontSize: 15, color: theme.mainfontcolor,
            paddingLeft: 10}}
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
