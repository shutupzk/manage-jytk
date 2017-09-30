import gql from 'graphql-tag'

const SUBJECT_ANALYSISS_SUCCESS = 'SUBJECT_ANALYSISS_SUCCESS'
const EXAMINATION_ANALYSISS_SUCCESS = 'EXAMINATION_ANALYSISS_SUCCESS'
const SUBJECT_ANALYSISS_FAIL = 'SUBJECT_ANALYSISS_FAIL'
const SUBJECT_ANALYSISS_SELECT = 'SUBJECT_ANALYSISS_SECTION_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function membercharges (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_ANALYSISS_SUCCESS:
    case EXAMINATION_ANALYSISS_SUCCESS:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data),
        error: null
      })
    case SUBJECT_ANALYSISS_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_ANALYSISS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_MEMBERCHARGES = gql`
  {
    memberCharges {
      id
      code
      member {
        id
        name
      }
      price
      months
    }
  }
`

export const queryMemberCharges = client => async dispatch => {
  try {
    const data = await client.query({
      query: QUERY_MEMBERCHARGES,
      variables: {},
      fetchPolicy: 'network-only'
    })
    const { memberCharges } = data.data
    let json = {}
    for (let doc of memberCharges) {
      json[doc.id] = doc
    }
    dispatch({
      type: SUBJECT_ANALYSISS_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_ANALYSISS_FAIL,
      error: e.message
    })
  }
}

const GIVE_USER_MEMBER = gql`
  mutation($userId: ObjID!, $memberChargeId: ObjID!) {
    giveUserMember(input: { userId: $userId, memberChargeId: $memberChargeId }) {
      id
    }
  }
`

export const giveUserMember = (client, { userId, memberChargeId }) => async dispatch => {
  try {
    await client.mutate({ mutation: GIVE_USER_MEMBER, variables: { userId, memberChargeId } })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}

const GIVE_USER_SCORE = gql`
  mutation($userId: ObjID!, $score: Int!) {
    createScoreRecord(input: { score: $score, userId: $userId }) {
      id
    }
  }
`

export const giveUserScore = (client, { userId, score }) => async dispatch => {
  try {
    await client.mutate({ mutation: GIVE_USER_SCORE, variables: { userId, score } })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}

export const selectMemberCharge = ({ memberChargeId }) => dispatch => {
  dispatch({
    type: SUBJECT_ANALYSISS_SELECT,
    selectId: memberChargeId
  })
}
