import React from 'react'

import Wrapper from './Wrapper'

function CardWhite (props) {
  return (
    <Wrapper className={props.classChild}>
      {props.children}
    </Wrapper>
  )
}

CardWhite.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
    React.PropTypes.string
  ])

}

export default CardWhite
