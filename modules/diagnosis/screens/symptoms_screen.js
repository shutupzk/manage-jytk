import React, { Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'

import { Loading, theme, ErrCard } from 'components'

class SymptomsScreen extends Component {
  render () {
    if (this.props.loading) {
      return (
        <Loading />
      )
    }
    if (this.props.error) {
      return (
        <ErrCard />
      )
    }
    const symptoms = [
      {
        id: '1',
        name: '双眼皮跳'
      },
      {
        id: '2',
        name: '双侧眼脸下垂'
      },
      {
        id: '3',
        name: '针眼'
      },
      {
        id: '4',
        name: '近视'
      },
      {
        id: '5',
        name: '散光'
      },
      {
        id: '6',
        name: '眼睛分泌物多'
      }
    ]
    console.log(symptoms)
    return (
      <div className='bottomView'>
        {
          symptoms.map((symptom) => {
            return (
              <div key={symptom.id}
                onClick={() => {
                  Router.push('/diagnosis/diagnosis_result')
                }}>
                <a className='flex tb-flex'>
                  <p className='flex tb-flex'>
                    {symptom.name}
                  </p>
                  <i className='back-left' />
                </a>
              </div>
            )
          })
        }
        <style jsx>{`
          .bottomView {
            border-top: 1px solid ${theme.bordercolor};
            background: #fff;
            margin-top: ${theme.tbmargin};
          }
          .bottomView a{
            border-bottom: 1px solid ${theme.bordercolor};
            padding: 0 .15rem;
            justify-content: space-between;
          }
          .bottomView p{
            color: ${theme.mainfontcolor};
            line-height: 44px;
          }
          .bottomView i{
            transform: rotate(135deg);
          }
        `}</style>
      </div>
    )
  }
}

export default connect()(SymptomsScreen)
