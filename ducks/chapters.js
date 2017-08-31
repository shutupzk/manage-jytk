import gql from 'graphql-tag'

const SUBJECT_CHAPTER_SUCCESS = 'SUBJECT_CHAPTER_SUCCESS'
const SUBJECT_CHAPTER_FAIL = 'SUBJECT_CHAPTER_FAIL'
const SUBJECT_CHAPTER_SELECT = 'SUBJECT_CHAPTER_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function chapters (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_CHAPTER_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case SUBJECT_CHAPTER_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_CHAPTER_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_CHAPTERS = gql`
  query($subjectId: ObjID!) {
    subject(id: $subjectId) {
      id
      chapters(limit: 0) {
        id
        name
      }
    }
  }
`

export const queryChapters = (client, { subjectId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_CHAPTERS, variables: { subjectId }, fetchPolicy: 'network-only' })
    const { chapters } = data.data.subject
    let json = {}
    for (let doc of chapters) {
      json[doc.id] = Object.assign({}, doc, { subjectId })
    }
    dispatch({
      type: SUBJECT_CHAPTER_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_CHAPTER_FAIL,
      error: e.message
    })
  }
}

export const selectChapter = ({ chapterId }) => dispatch => {
  dispatch({
    type: SUBJECT_CHAPTER_SELECT,
    selectId: chapterId
  })
}
