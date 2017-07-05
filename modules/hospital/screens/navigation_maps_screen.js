import React, { Component } from 'react'
// import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmap'
// import BMap from 'http://api.map.baidu.com/api?v=2.0&ak=W33OWk9gH40hXlGmUAek73qV&callback=initialize'

class NavigationMapsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      goWay: 'bus'
    }
  }
  componentWillMount () {
    var script = document.createElement('script')
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=1XjLLEhZhQNUzd93EjU5nOGQ&callback=initialize'
    document.body.appendChild(script)
  }

  componentDidMount () {
    var script = document.createElement('script')
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=1XjLLEhZhQNUzd93EjU5nOGQ&callback=initialize'
    document.body.appendChild(script)
    var map = new BMap.Map('map')
    // const point = new BMap.Point(116.404, 39.915) // 北京
    const point = new BMap.Point(113.294623, 23.1302) // 广东省人民医院
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom()
    var transit = new BMap.TransitRoute(map, {
      renderOptions: {
        map: map,
        panel: 'l-result',
        autoViewport: true,
        enableDragging: true  // 起终点可进行拖拽
      }
    })
    transit.search('广东省人民政府', '广东省人民医院')

    var marker = new BMap.Marker(point) // 创建marker对象
    marker.enableDragging() // marker可拖拽
    map.addOverlay(marker) // 在地图中添加marker

    // 将地址解析结果显示在地图上,并调整地图视野
    // var myGeo = new BMap.Geocoder()
    // myGeo.getPoint('广东省人民医院', function (point) {
    //   console.log(point)
    //   // {lng: 113.294623, lat: 23.1302}
    //   if (point) {
    //     map.centerAndZoom(point, 16)
    //     map.addOverlay(new BMap.Marker(point))
    //   } else {
    //     console.log('您选择地址没有解析到结果!')
    //   }
    // }, '广州市')
  }
  componentDidUpdate () {
    var map = new BMap.Map('map')
    const point = new BMap.Point(113.294623, 23.1302) // 广东省人民医院
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom()
    if (this.state.goWay === 'bus') {
      var transit = new BMap.TransitRoute(map, {
        renderOptions: {
          map: map,
          panel: 'l-result',
          autoViewport: true,
          enableDragging: true  // 起终点可进行拖拽
        }
      })
      transit.search('广东省人民政府', '广东省人民医院')
    }
    if (this.state.goWay === 'drive') {
      var driving = new BMap.DrivingRoute(map, {renderOptions: {
        map: map,
        panel: 'c-result',
        enableDragging: true,  // 起终点可进行拖拽
        autoViewport: true
      }})
      driving.search('广东省人民政府', '广东省人民医院')
    }
    if (this.state.goWay === 'walking') {
      var walking = new BMap.WalkingRoute(map, {renderOptions: {
        map: map,
        panel: 'r-result',
        enableDragging: true,  // 起终点可进行拖拽
        autoViewport: true
      }})
      walking.search('广东省人民政府', '广东省人民医院')
    }
  }
  render () {
    return (
      <div>
        <div style={{display: 'flex', backgroundColor: '#ffffff', padding: 10, textAlign: 'center'}}>
          <div style={{flex: 3}} />
          <div style={{flex: 2}} onClick={() => {
            console.log('bus')
            this.setState({goWay: 'bus'})
          }} >公交</div>
          <div style={{flex: 2}} onClick={() => {
            console.log('drive')
            this.setState({goWay: 'drive'})
          }} >驾车</div>
          <div style={{flex: 2}} onClick={() => {
            console.log('walking')
            this.setState({goWay: 'walking'})
            { /*document.getElementById('c-result').style.display = 'none'
            document.getElementById('c-result').style.display = 'none'
            document.getElementById('r-result').style.display = 'block' */ }
          }}>步行</div>
          <div style={{flex: 3}} />
        </div>
        <div id='map' style={{marginTop: 2, backgroundColor: '#fff', width: '100%', height: 420}} />
        {
          this.state.goWay === 'bus'
          ? <div id='l-result'>公交路线</div>
          : <div>
            {
              this.state.goWay === 'drive'
              ? <div id='c-result'>驾车路线</div>
              : <div id='r-result' >步行路线</div>
            }
          </div>
        }
        {/* <div ref='map' /> */}
      </div>
    )
  }
}

export default NavigationMapsScreen
