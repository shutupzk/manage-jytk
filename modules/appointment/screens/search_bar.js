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
          placeholder='全拼，首字母，汉字查询'
          style={{width: '100%'}}
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)} />
      </div>
    )
  }

  onInputChange (term) {
    this.setState({term})
    this.props.searchDep(this.props.departments, term)
  }
}

export default SearchBar
