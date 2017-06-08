import React, { Component } from 'react'

class NavigationMapsScreen extends Component {
  componentDidMount () {
    // var mp = new BMap.Map('map')
    // mp.centerAndZoom(new BMap.Point(121.491, 31.233), 11)
  }
  render () {
    return (
      <div>
        <div style={{display: 'flex', backgroundColor: '#ffffff', padding: 10, textAlign: 'center'}}>
          <div style={{flex: 3}} />
          <div style={{flex: 2}} >公交</div>
          <div style={{flex: 2}} >驾车</div>
          <div style={{flex: 2}} >步行</div>
          <div style={{flex: 3}} />
        </div>
        <div id='map' />
        {/* <div ref='map' /> */}
      </div>
    )
  }
}

export default NavigationMapsScreen
