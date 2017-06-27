import React, { Component } from 'react'
// import mobiscroll from 'mobiscroll-react'
// import mobiscroll from '/static/mobiscroll-2.6.2/js/mobiscroll.custom-2.6.2.min'
// mobiscroll.settings = {
//   theme: 'ios',
//   display: 'bottom'
// }

class RangeDemo extends Component {
  constructor (props) {
    super(props)

    this.state = { term: '' }
  }

  componentDidMount () {
    // mobiscroll.Range('#scroller')
  }

  render () {
    return (
      <div>日历
         {/*<Mobiscroll preset='select' options={ops} elType='input' />*/}
        <input id='scroller' />
        {/*<mobiscroll />
        <mobiscroll.Form className='md-range-event' >
          <label>
            Starts
            <mobiscroll.Range
              className='md-time'
              type='text'
              placeholder='Event start'
              min={new Date()}
              controls={['date']}
              endInput='.md-time-end'
              dateFormat='M dd D yy'
            />
          </label>
          <label>
            Ends
            <input className='md-time md-time-end' type='text' placeholder='Event end' />
          </label>
        </mobiscroll.Form>*/}
      </div>
    )
  }

  onInputChange (term) {
    this.setState({term})
    this.props.searchDep(term)
  }
}

export default RangeDemo
