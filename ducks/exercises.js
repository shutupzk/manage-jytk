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

const QUERY_EXERCISES = gql`
  query($skip: Int, $limit: Int, $type: String!, $examinationDifficultyId: ObjID, $yearExerciseListId: ObjID, $subjectId: ObjID, $chapterId: ObjID, $sectionId: ObjID, $yearExamTypeId: ObjID) {
    exercises(
      skip: $skip
      limit: $limit
      type: $type
      examinationDifficultyId: $examinationDifficultyId
      yearExerciseListId: $yearExerciseListId
      subjectId: $subjectId
      chapterId: $chapterId
      sectionId: $sectionId
      yearExamTypeId: $yearExamTypeId
    ) {
      id
      content
      hot
      num
      type
      subject {
        id
        name
      }
      exerciseImages {
        id
        text
        image
      }
      section {
        id
        name
        chapter {
          id
          name
        }
      }
      yearExerciseList {
        id
        year
        yearExerciseType {
          id
          name
        }
      }
      examinationDifficulty {
        id
        name
      }
      yearExamType {
        id
        name
      }
    }
  }
`

export const queryExercises = (client, { skip, limit, hot, type, examinationDifficultyId, yearExerciseListId, subjectId, chapterId, sectionId, yearExamTypeId }) => async dispatch => {
  console.log('yearExamTypeId====', yearExamTypeId)
  try {
    const data = await client.query({
      query: QUERY_EXERCISES,
      variables: { skip, limit, hot, type, examinationDifficultyId, yearExerciseListId, subjectId, chapterId, sectionId, yearExamTypeId },
      fetchPolicy: 'network-only'
    })
    const { exercises } = data.data
    let json = formatExercise(exercises)
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_EXERCISES_FAIL,
      error: e.message
    })
  }
}

const UPDATE_EXERCISE = gql`
  mutation($exerciseId: ObjID!, $content: String!) {
    updateExercise(id: $exerciseId, input: { content: $content }) {
      id
      content
      hot
      num
      type
      subject {
        id
        name
      }
      exerciseImages {
        id
        text
        image
      }
      section {
        id
        name
        chapter {
          id
          name
        }
      }
      yearExerciseList {
        id
        year
        yearExerciseType {
          id
          name
        }
      }
      examinationDifficulty {
        id
        name
      }
      yearExamType {
        id
        name
      }
    }
  }
`

export const updateExercise = (client, { exerciseId, content }) => async dispatch => {
  try {
    let data = await client.mutate({ mutation: UPDATE_EXERCISE, variables: { exerciseId, content } })
    const { updateExercise } = data.data
    let json = formatExercise([updateExercise])
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}

const CREATE_EXERCISE_IMAGES = gql`
  mutation($inputs: [createExerciseImageinput!]!) {
    createExerciseImages(inputs: $inputs) {
      id
    }
  }
`

export const createExerciseImages = (client, { inputs }) => async dispatch => {
  try {
    let data = await client.mutate({ mutation: CREATE_EXERCISE_IMAGES, variables: { inputs } })
    const { createExerciseImages } = data.data
    let json = formatExercise([createExerciseImages])
    dispatch({
      type: SUBJECT_EXERCISES_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}

export const selectExercise = ({ exerciseId }) => dispatch => {
  dispatch({
    type: SUBJECT_EXERCISES_SELECT,
    selectId: exerciseId
  })
}

function formatExercise (exercises) {
  console.log('exercises ======== ', exercises)
  let json = {}
  for (let doc of exercises) {
    let type = doc.type
    let yearExerciseListId,
      yearExerciseTypeId,
      yearExerciseTypeName,
      year,
      examinationDifficultyId,
      examinationDifficultyName,
      subjectId,
      subjectName,
      sectionId,
      chapterId,
      sectionName,
      chapterName,
      yearExamTypeId,
      yearExamTypeName
    if (doc.subject) {
      subjectId = doc.subject.id
      subjectName = doc.subject.name
    }
    if (doc.yearExerciseList) {
      yearExerciseListId = doc.yearExerciseList.id
      yearExerciseTypeId = doc.yearExerciseList.yearExerciseType.id
      yearExerciseTypeName = doc.yearExerciseList.yearExerciseType.name
      year = doc.yearExerciseList.year
    }
    if (doc.examinationDifficulty) {
      examinationDifficultyId = doc.examinationDifficulty.id
      examinationDifficultyName = doc.examinationDifficulty.name
    }
    if (doc.section) {
      sectionId = doc.section.id
      sectionName = doc.section.name
      chapterId = doc.section.chapter.id
      chapterName = doc.section.chapter.name
    }

    if (doc.yearExamType) {
      yearExamTypeId = doc.yearExamType.id
      yearExamTypeName = doc.yearExamType.name
    }
    json[doc.id] = Object.assign({}, doc, {
      yearExerciseListId,
      yearExerciseTypeId,
      yearExerciseTypeName,
      year,
      examinationDifficultyId,
      examinationDifficultyName,
      subjectId,
      chapterId,
      sectionId,
      sectionName,
      chapterName,
      subjectName,
      yearExamTypeId,
      yearExamTypeName,
      type
    })
  }
  return json
}
