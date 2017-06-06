import React, {Component } from 'react'
import { connect } from 'react-redux'
// import Link from 'next/link'
import QuestionList from '../components/question_list'
import { queryQuestions } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class QuestionsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {
    console.log(this.props.questions)
    if (isEmptyObject(this.props.questions)) {
      this.props.queryQuestions(this.props.client)
    }
  }

  render () {
    if (this.props.loading) {
      return (
        <div>
          loading...
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          error...
        </div>
      )
    }
    const questions = this.props.questions
    return (
      <div style={{marginTop: 10}}>
        { questions && questions.length > 0 ? questions.map((question, i) => {
          return <QuestionList question={question} num={i + 1} />
        }) : 'no data'
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    questions: state.questions.data,
    loading: state.questions.loading,
    error: state.questions.error
  }
}

export default connect(mapStateToProps, { queryQuestions })(QuestionsScreen)