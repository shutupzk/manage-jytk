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
  query($skip: Int, $limit: Int, $type: String!, $examinationDifficultyId: ObjID, $yearExerciseListId: ObjID, $subjectId: ObjID, $chapterId: ObjID, $sectionId: ObjID) {
    exercises(
      skip: $skip
      limit: $limit
      type: $type
      examinationDifficultyId: $examinationDifficultyId
      yearExerciseListId: $yearExerciseListId
      subjectId: $subjectId
      chapterId: $chapterId
      sectionId: $sectionId
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
        yearExerciseType{
          id
          name
        }
      }
      examinationDifficulty {
        id
        name
      }
    }
  }
`

export const queryExercises = (client, { skip, limit, hot, type, examinationDifficultyId, yearExerciseListId, subjectId, chapterId, sectionId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_EXERCISES, variables: { skip, limit, hot, type, examinationDifficultyId, yearExerciseListId, subjectId, chapterId, sectionId }, fetchPolicy: 'network-only' })
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

export const selectExercise = ({ exerciseId }) => dispatch => {
  dispatch({
    type: SUBJECT_EXERCISES_SELECT,
    selectId: exerciseId
  })
}

function formatExercise (exercises) {
  let json = {}
  for (let doc of exercises) {
    let type = doc.type
    let yearExerciseListId, yearExerciseTypeId, yearExerciseTypeName, year, examinationDifficultyId, examinationDifficultyName, subjectId, subjectName, sectionId, chapterId, sectionName, chapterName
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
      type
    })
  }
  return json
}
