import React, { Component } from 'react'

export default class EvaluationItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      score: props.item.score
    }
  }
  render () {
    const item = this.props.item
    return (
      <div style={{backgroundColor: '#ffffff', padding: 10}}>
        <div>{item.num} {item.title}</div>
        <div style={{display: 'flex', padding: 20}}>
          <div style={{width: '3%', marginLeft: 1}}>
            <div style={{height: 6, backgroundColor: `${this.state.score >= 1 ? '#3CA0FF' : '#eeeeee'}`, marginBottom: 10, borderTopLeftRadius: 3, borderBottomLeftRadius: 3}}>
              {
                this.state.score === 1 ? <div style={{float: 'right', width: 16, height: 16, backgroundColor: '#3CA0FF', borderRadius: 8, margin: -5}} /> : ''
              }
            </div>
            <div style={{textAlign: 'right', marginRight: -5}} onClick={() => {
              this.setState({score: 1})
              this.props.getScore(1)
            }}>差</div>
          </div>
          <div style={{flex: '2', marginLeft: 1}}>
            <div style={{height: 6, backgroundColor: `${this.state.score >= 2 ? '#3CA0FF' : '#eeeeee'}`, marginBottom: 10}}>
              {
                this.state.score === 2 ? <div style={{float: 'right', width: 16, height: 16, backgroundColor: '#3CA0FF', borderRadius: 8, margin: -5}} /> : ''
              }
            </div>
            <div style={{textAlign: 'right', marginRight: -12}} onClick={() => {
              this.setState({score: 2})
              this.props.getScore(2)
            }}>较差</div>
          </div>
          <div style={{flex: '2', marginLeft: 1}} onClick={() => {
            this.setState({score: 3})
            this.props.getScore(3)
          }}>
            <div style={{height: 6, backgroundColor: `${this.state.score >= 3 ? '#3CA0FF' : '#eeeeee'}`, marginBottom: 10}}>
              {
                this.state.score === 3 ? <div style={{float: 'right', width: 16, height: 16, backgroundColor: '#3CA0FF', borderRadius: 8, margin: -5}} /> : ''
              }
            </div>
            <div style={{textAlign: 'right', marginRight: -12}}>一般</div>
          </div>
          <div style={{flex: '2', marginLeft: 1}} onClick={() => {
            this.setState({score: 4})
            this.props.getScore(4)
          }}>
            <div style={{height: 6, backgroundColor: `${this.state.score >= 4 ? '#3CA0FF' : '#eeeeee'}`, marginBottom: 10}} >
              {
                this.state.score === 4 ? <div style={{float: 'right', width: 16, height: 16, backgroundColor: '#3CA0FF', borderRadius: 8, margin: -5}} /> : ''
              }
            </div>
            <div style={{textAlign: 'right', marginRight: -12}}>较好</div>
          </div>
          <div style={{flex: '2', marginLeft: 1}} onClick={() => {
            this.setState({score: 5})
            this.props.getScore(5)
          }}>
            <div style={{height: 6, backgroundColor: `${this.state.score >= 5 ? '#3CA0FF' : '#eeeeee'}`, marginBottom: 10, borderTopRightRadius: 3, borderBottomRightRadius: 3}} >
              {
                this.state.score === 5 ? <div style={{float: 'right', width: 16, height: 16, backgroundColor: '#3CA0FF', borderRadius: 8, margin: -5}} /> : ''
              }
            </div>
            <div style={{textAlign: 'right', marginRight: -8}}>优秀</div>
          </div>
        </div>
      </div>
    )
  }
}
{/*<div style={{flex: '2', borderTop: 'solid 5px #3CA0FF', padding: 10, marginLeft: 1}} />*/}