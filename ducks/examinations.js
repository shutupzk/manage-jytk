import gql from 'graphql-tag'

const EXAMINATION_EXAMINATION_SUCCESS = 'EXAMINATION_EXAMINATION_SUCCESS'
const EXAMINATION_EXAMINATION_FAIL = 'EXAMINATION_EXAMINATION_FAIL'
const EXAMINATION_EXAMINATION_SELECT = 'EXAMINATION_EXAMINATION_SELECT'
const EXAMINATION_EXAMINATION_ADD_SUCCESS = 'EXAMINATION_EXAMINATION_ADD_SUCCESS'
const EXAMINATION_EXERCISES_SUCCESS = 'EXAMINATION_EXERCISES_SUCCESS'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function examinations (state = initState, action = {}) {
  switch (action.type) {
    case EXAMINATION_EXAMINATION_SUCCESS:
    case EXAMINATION_EXAMINATION_ADD_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case EXAMINATION_EXAMINATION_FAIL:
      return Object.assign({}, state, { error: action.error })
    case EXAMINATION_EXAMINATION_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_EXAMINATIONS = gql`
  query {
    examinations {
      id
      startTime
      endTime
      examinationDifficulty {
        id
        code
        name
      }
      examinationModel {
        id
        name
      }
      examinationType {
        id
        code
        name
      }
    }
  }
`

export const queryExaminations = client => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_EXAMINATIONS, variables: {}, fetchPolicy: 'network-only' })
    const { examinations } = data.data
    let json = {}
    for (let doc of examinations) {
      json[doc.id] = Object.assign({}, doc)
    }
    dispatch({
      type: EXAMINATION_EXAMINATION_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: EXAMINATION_EXAMINATION_FAIL,
      error: e.message
    })
  }
}

const CREAT_EXAMINATION = gql`
  mutation($userId: ObjID!, $examinationTypeId: ObjID!, $examinationModelId: ObjID, $examinationDifficultyId: ObjID!) {
    createExamination(input: { userId: $userId, examinationTypeId: $examinationTypeId, examinationModelId: $examinationModelId, examinationDifficultyId: $examinationDifficultyId }) {
      id
      startTime
      endTime
      examinationDifficulty {
        id
        code
        name
      }
      examinationModel {
        id
        name
      }
      examinationType {
        id
        code
        name
      }
      examinationHasExercises(limit: 0) {
        id
        exercise {
          id
          content
          hot
          subject {
            id
          }
          answers {
            id
            content
            isAnswer
          }
          analysiss {
            id
            content
            images
            user {
              id
              name
            }
            createdAt
          }
          notes(userId: $userId) {
            id
            content
            images
            user {
              name
            }
            createdAt
          }
        }
      }
    }
  }
`
export const createExamination = (client, { userId, examinationTypeId, examinationModelId, examinationDifficultyId }) => async dispatch => {
  try {
    let data = await client.mutate({ mutation: CREAT_EXAMINATION, variables: { userId, examinationTypeId, examinationModelId, examinationDifficultyId } })
    const { createExamination } = data.data
    const { id, startTime, endTime, examinationDifficulty, examinationModel, examinationType, examinationHasExercises } = createExamination
    const examination = { id, startTime, endTime, examinationDifficulty, examinationModel, examinationType }
    let ejson = {}
    ejson[examination.id] = examination
    dispatch({
      type: EXAMINATION_EXAMINATION_ADD_SUCCESS,
      data: ejson
    })
    const examinationId = examination.id
    let json = {}
    for (let examinationHasExercise of examinationHasExercises) {
      let examinationHasExerciseId = examinationHasExercise.id
      let doc = examinationHasExercise.exercise
      let subjectId = doc.subject.id
      json[doc.id] = Object.assign({}, doc, { subjectId, examinationId, examinationHasExerciseId })
    }
    dispatch({
      type: EXAMINATION_EXAMINATION_SELECT,
      selectId: examinationId
    })
    dispatch({
      type: EXAMINATION_EXERCISES_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    console.log(e.message)
    let error = e.message.replace('GraphQL error: ', '')
    return error
  }
}

const SUBMIT_EXAMINATION = gql`
  mutation($examinationId: ObjID!, $userAnswers: [examUserAnswerinput!]) {
    submitExamination(id: $examinationId, userAnswers: $userAnswers) {
      id
      startTime
      endTime
      examinationDifficulty {
        id
        code
        name
      }
      examinationModel {
        id
        name
      }
      examinationType {
        id
        code
        name
      }
    }
  }
`

export const submitExamination = (client, { examinationId, userAnswers }) => async dispatch => {
  try {
    let data = await client.mutate({ mutation: SUBMIT_EXAMINATION, variables: { examinationId, userAnswers } })
    console.log('data ======== ', data)
    let json = {}
    let doc = data.data.submitExamination
    json[doc.id] = Object.assign({}, doc)
    dispatch({
      type: EXAMINATION_EXAMINATION_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    console.log(e.message)
    let error = e.message.replace('GraphQL error: ', '')
    return error
  }
}

export const selectExamination = ({ examinationId }) => dispatch => {
  dispatch({
    type: EXAMINATION_EXAMINATION_SELECT,
    selectId: examinationId
  })
}
