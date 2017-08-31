import gql from 'graphql-tag'

const SUBJECT_EXERCISES_SUCCESS = 'SUBJECT_EXERCISES_SUCCESS'
const EXAMINATION_EXERCISES_SUCCESS = 'EXAMINATION_EXERCISES_SUCCESS'
const SUBJECT_EXERCISES_FAIL = 'SUBJECT_EXERCISES_FAIL'
const SUBJECT_EXERCISES_SELECT = 'SUBJECT_EXERCISES_SECTION_SELECT'

const initState = {
  data: {},
  error: null,
  skip: 0,
  selectId: null
}

export function exercises (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_EXERCISES_SUCCESS:
    case EXAMINATION_EXERCISES_SUCCESS:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data),
        skip: action.skip,
        error: null
      })
    case SUBJECT_EXERCISES_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_EXERCISES_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const COLLECT_EXERCISES = gql`
  mutation($userId: ObjID!, $exerciseId: ObjID!) {
    createExerciseCollect(input: { userId: $userId, exerciseId: $exerciseId }) {
      id
    }
  }
`

export const createExerciseCollect = async (client, { exerciseId, userId }) => {
  try {
    await client.mutate({ mutation: COLLECT_EXERCISES, variables: { exerciseId, userId } })
    return null
  } catch (e) {
    console.log(e.message)
    let error = e.message.replace('GraphQL error: ', '')
    if (error === '请勿重复收藏') {
      return null
    }
    return error
  }
}

const CREATE_USER_ANSWER = gql`
  mutation($answerId: ObjID!, $userId: ObjID!, $isAnswer: Boolean!, $subjectId: ObjID!) {
    createUserAnswer(input: { answerId: $answerId, userId: $userId, isAnswer: $isAnswer, subjectId: $subjectId }) {
      id
    }
  }
`

export const createUserAnswer = async (client, { answerId, userId, isAnswer, subjectId }) => {
  try {
    await client.mutate({ mutation: CREATE_USER_ANSWER, variables: { answerId, userId, isAnswer, subjectId } })
  } catch (e) {
    console.log(e)
  }
}

const QUERY_SECTION_EXERCISES = gql`
  query($sectionId: ObjID!, $skip: Int, $limit: Int) {
    section(id: $sectionId) {
      id
      exercises(skip: $skip, limit: $limit) {
        id
        content
        hot
        subject {
          id
          name
        }
        section{
          id
          name
          chapter{
            id
            name
          }
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
      }
    }
  }
`

export const querySectionExercises = (client, { sectionId, skip, limit }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SECTION_EXERCISES, variables: { sectionId, skip, limit }, fetchPolicy: 'network-only' })
    const { exercises } = data.data.section
    let json = formatExercise(exercises)
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const QUERY_CHAPTER_EXERCISES = gql`
  query($chapterId: ObjID!, $skip: Int, $limit: Int) {
    chapter(id: $chapterId) {
      id
      sections(limit: 0) {
        id
        exercises(skip: $skip, limit: $limit) {
          id
          content
          hot
          subject {
            id
            name
          }
          section{
            id
            name
            chapter{
              id
              name
            }
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
        }
      }
    }
  }
`

export const queryChapterExercises = (client, { chapterId, skip, limit }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_CHAPTER_EXERCISES, variables: { chapterId, skip, limit }, fetchPolicy: 'network-only' })
    let exercises = []
    const { sections } = data.data.chapter
    for (let section of sections) {
      exercises = [...exercises, ...section.exercises]
    }
    let json = formatExercise(exercises)
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const QUERY_SUBJECT_SECTIONS = gql`
  query($subjectId: ObjID!, $skip: Int, $limit: Int, $hot: Boolean) {
    subject(id: $subjectId) {
      id
      exercises(skip: $skip, limit: $limit, hot: $hot) {
        id
        content
        hot
        subject {
          id
          name
        }
        section{
          id
          name
          chapter{
            id
            name
          }
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
      }
    }
  }
`

export const querySubjectExercises = (client, { subjectId, skip, limit, hot }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SUBJECT_SECTIONS, variables: { subjectId, skip, limit, hot }, fetchPolicy: 'network-only' })
    const { exercises } = data.data.subject
    let json = formatExercise(exercises)
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const QUERY_ERROR_SECTIONS = gql`
  query($userId: ObjID!, $subjectId: ObjID, $isAnswer: Boolean!, $skip: Int, $limit: Int) {
    user(id: $userId) {
      id
      userAnswers(isAnswer: $isAnswer, subjectId: $subjectId, skip: $skip, limit: $limit) {
        id
        answer {
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
  }
`

export const queryErrorExercises = (client, { userId, subjectId, isAnswer, skip, limit }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_ERROR_SECTIONS, variables: { userId, subjectId, isAnswer, skip, limit }, fetchPolicy: 'network-only' })
    const { userAnswers } = data.data.user
    let json = {}
    for (let userAnswer of userAnswers) {
      let doc = userAnswer.answer.exercise
      json[doc.id] = Object.assign({}, doc, { subjectId, isAnswer })
    }
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const QUERY_OFICIAL_SECTIONS = gql`
  query($officialExaminationId: ObjID!, $userId: ObjID, $skip: Int, $limit: Int) {
    officialExamination(id: $officialExaminationId) {
      id
      exercises(skip: $skip, limit: $limit) {
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
`

export const queryOfficialExercises = (client, { officialExaminationId, userId, skip, limit }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_OFICIAL_SECTIONS, variables: { officialExaminationId, userId, skip, limit }, fetchPolicy: 'network-only' })
    const { exercises } = data.data.officialExamination
    let json = {}
    for (let doc of exercises) {
      let subjectId = doc.subject.id
      json[doc.id] = Object.assign({}, doc, { officialExaminationId, subjectId })
    }
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const QUERY_COLLECT_SECTIONS = gql`
  query($userId: ObjID!, $skip: Int, $limit: Int) {
    user(id: $userId) {
      id
      exerciseCollects(skip: $skip, limit: $limit) {
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
        }
      }
    }
  }
`

export const queryCollectExercises = (client, { userId, skip, limit }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_COLLECT_SECTIONS, variables: { userId, skip, limit }, fetchPolicy: 'network-only' })
    const { exerciseCollects } = data.data.user
    let json = {}
    for (let exerciseCollect of exerciseCollects) {
      let doc = exerciseCollect.exercise
      let subjectId = doc.subject.id
      json[doc.id] = Object.assign({}, doc, { subjectId, collect: true })
    }
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const QUERY_SECTIONS = gql`
  query($skip: Int, $limit: Int) {
    exercises(skip: $skip, limit: $limit) {
      id
      content
      hot
      subject {
        id
        name
      }
      section{
        id
        name
        chapter{
          id
          name
        }
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
    }
  }
`

export const queryExercises = (client, { skip, limit }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SECTIONS, variables: { skip, limit }, fetchPolicy: 'network-only' })
    const { exercises } = data.data
    let json = formatExercise(exercises)
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json,
      skip
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

export const selectExercise = ({ exerciseId }) => dispatch => {
  dispatch({
    type: SUBJECT_EXERCISES_SELECT,
    selectId: exerciseId
  })
}

function formatExercise (exercises) {
  let json = {}
  for (let doc of exercises) {
    let subjectId = doc.subject.id
    let subjectName = doc.subject.name
    let sectionId, chapterId, sectionName, chapterName
    if (doc.section) {
      sectionId = doc.section.id
      sectionName = doc.section.name
      chapterId = doc.section.chapter.id
      chapterName = doc.section.chapter.name
    }
    json[doc.id] = Object.assign({}, doc, { subjectId, chapterId, sectionId, sectionName, chapterName, subjectName })
  }
  return json
}
