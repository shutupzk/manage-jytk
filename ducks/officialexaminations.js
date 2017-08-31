import gql from 'graphql-tag'

const EXAMINATION_OFFICIAL_SUCCESS = 'EXAMINATION_OFFICIAL_SUCCESS'
const EXAMINATION_OFFICIAL_FAIL = 'EXAMINATION_OFFICIAL_FAIL'
const EXAMINATION_OFFICIAL_SELECT = 'EXAMINATION_OFFICIAL_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null,
  selectType: null
}

export function officialexaminations (state = initState, action = {}) {
  switch (action.type) {
    case EXAMINATION_OFFICIAL_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case EXAMINATION_OFFICIAL_FAIL:
      return Object.assign({}, state, { error: action.error })
    case EXAMINATION_OFFICIAL_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_EXAMINATION_OFFICIALS = gql`
  query {
    officialExaminations(limit: 0) {
      id
      date
      title
    }
  }
`

export const queryOfficialexaminations = client => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_EXAMINATION_OFFICIALS, variables: {}, fetchPolicy: 'network-only' })
    const { officialExaminations } = data.data
    let json = {}
    for (let doc of officialExaminations) {
      json[doc.id] = doc
    }
    dispatch({
      type: EXAMINATION_OFFICIAL_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: EXAMINATION_OFFICIAL_FAIL,
      error: e.message
    })
  }
}

export const selectOfficialexamination = ({ officialExaminationId }) => dispatch => {
  dispatch({
    type: EXAMINATION_OFFICIAL_SELECT,
    selectId: officialExaminationId
  })
}
