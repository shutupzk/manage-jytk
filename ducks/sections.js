import gql from 'graphql-tag'

const SUBJECT_SECTION_SUCCESS = 'SUBJECT_SECTION_SUCCESS'
const SUBJECT_SECTION_FAIL = 'SUBJECT_SECTION_FAIL'
const SUBJECT_SECTION_SELECT = 'SUBJECT_SECTION_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function sections (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_SECTION_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case SUBJECT_SECTION_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_SECTION_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_SECTIONS = gql`
  query($chapterId: ObjID!) {
    chapter(id: $chapterId) {
      id
      sections(limit: 0) {
        id
        name
      }
    }
  }
`

export const querySections = (client, { chapterId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SECTIONS, variables: { chapterId }, fetchPolicy: 'network-only' })
    const { sections } = data.data.chapter
    let json = {}
    for (let doc of sections) {
      json[doc.id] = Object.assign({}, doc, { chapterId })
    }
    dispatch({
      type: SUBJECT_SECTION_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_SECTION_FAIL,
      error: e.message
    })
  }
}

export const selectSection = ({ sectionId }) => dispatch => {
  dispatch({
    type: SUBJECT_SECTION_SELECT,
    selectId: sectionId
  })
}
