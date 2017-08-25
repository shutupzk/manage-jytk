// import localforage from 'localforage'
// import gql from 'graphql-tag'

const PROMPT_SHOW = 'prompt/show'
const PROMPT_HIDE = 'prompt/hide'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function prompt (state = initState, action = {}) {
  switch (action.type) {
    case PROMPT_SHOW:
      return Object.assign(
        {},
        state,
        { data: {text: action.text, timer: (action.timer || 2000)}},
        { loading: false, error: null }
			)
    case PROMPT_HIDE:
      return Object.assign(
        {},
        state,
        { data: {text: '', timer: null}},
        { loading: false, error: null }
			)
    default:
      return state
  }
}

export const showPrompt = ({text, timer}) => dispatch => {
  dispatch({
    type: PROMPT_SHOW,
    text,
    timer
  })
}
export const hidePrompt = () => dispatch => {
  dispatch({
    type: PROMPT_HIDE
  })
}
