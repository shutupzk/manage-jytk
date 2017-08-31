import gql from 'graphql-tag'

const EXAMINATION_TYPE_SUCCESS = 'EXAMINATION_TYPE_SUCCESS'
const EXAMINATION_TYPE_FAIL = 'EXAMINATION_TYPE_FAIL'
const EXAMINATION_TYPE_SELECT = 'EXAMINATION_TYPE_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function examinationtypes (state = initState, action = {}) {
  switch (action.type) {
    case EXAMINATION_TYPE_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case EXAMINATION_TYPE_FAIL:
      return Object.assign({}, state, { error: action.error })
    case EXAMINATION_TYPE_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_EXAMINATIONTYPES = gql`
  query {
    examinationTypes {
      id
      name
    }
  }
`

export const queryExaminationTypes = client => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_EXAMINATIONTYPES, variables: {}, fetchPolicy: 'network-only' })
    const { examinationTypes } = data.data
    let json = {}
    for (let doc of examinationTypes) {
      json[doc.id] = Object.assign({}, doc)
    }
    dispatch({
      type: EXAMINATION_TYPE_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: EXAMINATION_TYPE_FAIL,
      error: e.message
    })
  }
}

export const selectExaminationType = ({ examinationTypeId }) => dispatch => {
  dispatch({
    type: EXAMINATION_TYPE_SELECT,
    selectId: examinationTypeId
  })
}
