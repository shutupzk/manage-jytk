import { user, signup, signin, signout, queryUser, updatePassword, savePhone, createVerifyCode, checkVerifyCode } from './user'
import { prompt, showPrompt, hidePrompt } from './prompt'
import { subjects, querySubjects, selectSubject, selectSubjectType } from './subjects'
import { chapters, queryChapters, selectChapter } from './chapters'
import { sections, querySections, selectSection } from './sections'
import {
  exercises,
  querySectionExercises,
  selectExercise,
  querySubjectExercises,
  createUserAnswer,
  queryErrorExercises,
  queryOfficialExercises,
  createExerciseCollect,
  queryCollectExercises,
  queryExercises,
  queryChapterExercises
} from './exercises'
import { officialexaminations, queryOfficialexaminations, selectOfficialexamination } from './officialexaminations'
import { courses, queryCourses, selectCourse, createCourseCollect, queryCollectCourses } from './courses'
import { examinationtypes, queryExaminationTypes, selectExaminationType } from './examinationtypes'
import { examinationdifficultys, queryExaminationDifficultys, selectExaminationDifficulty } from './examinationdifficultys'
import { examinations, queryExaminations, createExamination, selectExamination, submitExamination } from './examinations'

// export reducers by it's keys
export { user, prompt, subjects, chapters, sections, exercises, officialexaminations, courses, examinationtypes, examinationdifficultys, examinations }

// export actions
export {
  signup,
  signin,
  signout,
  queryUser,
  updatePassword,
  savePhone,
  createVerifyCode,
  checkVerifyCode,
  querySubjects,
  queryChapters,
  selectSubject,
  selectChapter,
  querySections,
  selectSection,
  querySectionExercises,
  querySubjectExercises,
  selectExercise,
  selectSubjectType,
  createUserAnswer,
  queryErrorExercises,
  queryOfficialexaminations,
  selectOfficialexamination,
  queryOfficialExercises,
  queryCourses,
  selectCourse,
  createExerciseCollect,
  queryCollectExercises,
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
  queryChapterExercises
}
