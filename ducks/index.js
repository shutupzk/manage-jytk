import { users, queryUsers } from './users'
import { prompt, showPrompt, hidePrompt } from './prompt'
import { subjects, querySubjects, selectSubject, selectSubjectType } from './subjects'
import { chapters, queryChapters, selectChapter } from './chapters'
import { sections, querySections, selectSection } from './sections'
import { exercises, queryExercises, selectExercise } from './exercises'
import { officialexaminations, queryOfficialexaminations, selectOfficialexamination } from './officialexaminations'
import { courses, queryCourses, selectCourse, createCourseCollect, queryCollectCourses } from './courses'
import { examinationtypes, queryExaminationTypes, selectExaminationType } from './examinationtypes'
import { examinationdifficultys, queryExaminationDifficultys, selectExaminationDifficulty } from './examinationdifficultys'
import { examinations, queryExaminations, createExamination, selectExamination, submitExamination } from './examinations'
import { yearexerciselists, queryYearExerciseLists, selectYearExerciseList } from './yearexerciselists'
import { answers, queryAnswers } from './answers'
import { analysiss, queryAnalysiss } from './analysiss'
import { yearexercisetypes, queryYearExerciseTypes, selectYearExerciseType } from './yearexercisetypes'

// export reducers by it's keys
export { users, prompt, subjects, chapters, sections, exercises, officialexaminations, courses, examinationtypes, examinationdifficultys, examinations, yearexerciselists, answers, analysiss, yearexercisetypes }

// export actions
export {
  queryUsers,
  querySubjects,
  queryChapters,
  selectSubject,
  selectChapter,
  querySections,
  selectSection,
  selectExercise,
  selectSubjectType,
  queryOfficialexaminations,
  selectOfficialexamination,
  queryCourses,
  selectCourse,
  createCourseCollect,
  queryCollectCourses,
  queryExaminationTypes,
  selectExaminationType,
  queryExaminationDifficultys,
  selectExaminationDifficulty,
  queryExaminations,
  createExamination,
  selectExamination,
  submitExamination,
  showPrompt,
  hidePrompt,
  queryExercises,
  queryYearExerciseLists,
  selectYearExerciseList,
  queryAnswers,
  queryAnalysiss,
  queryYearExerciseTypes,
  selectYearExerciseType
}
