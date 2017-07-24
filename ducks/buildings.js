import localforage from 'localforage'
import gql from 'graphql-tag'

const BUILDING_QUERY_BUILDINGS = 'building/querybuilding'
const BUILDING_QUERY_BUILDING_SUCCESS = 'building/querybuilding/success'
const BUILDING_QUERY_BUILDING_FAIL = 'building/querybuilding/fail'

const UPDATE_BUILDING_SUCCESS = 'building/updatebuilding/success'
const CREATE_BUILDING_SUCCESS = 'building/createbuilding/success'

const UPDATE_FLOORS_SUCCESS = 'building/updatefloor/success'
const CREATE_FLOORS_SUCCESS = 'building/createfloor/success'

const UPDATE_ROOMS_SUCCESS = 'building/updateroom/success'
const CREATE_ROOMS_SUCCESS = 'building/createroom/success'

const initState = {
  data: {},
  loading: false,
	error: null,
	building: {},
	floor: {},
	room: {}
}

// reducer
export function buildings (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case BUILDING_QUERY_BUILDINGS:
      return Object.assign({}, state, { loading: true, error: null })
    case BUILDING_QUERY_BUILDING_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case BUILDING_QUERY_BUILDING_SUCCESS:
		case UPDATE_BUILDING_SUCCESS:
		case CREATE_BUILDING_SUCCESS:
      return Object.assign(
        {},
        state,
        { building: action.building },
        { loading: false, error: null }
			)
		case UPDATE_FLOORS_SUCCESS:
		case CREATE_FLOORS_SUCCESS:
      return Object.assign(
        {},
        state,
        {floor: action.floor },
        { loading: false, error: null }
      )
		case UPDATE_ROOMS_SUCCESS:
		case CREATE_ROOMS_SUCCESS:
      return Object.assign(
        {},
        state,
        {room: action.room },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// building list
const QUERY_BUILDINGS = gql`
  query {
		buildings {
			id
			name
			position
			description
			hospital {
				id
				hospitalName
			}
			floors {
				id
				floorNum
				rooms{
					name
					code
					description
				}
			}
		}
	}
`

export const queryBuildings = (client) => async dispatch => {
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		const data = await client.query({ query: QUERY_BUILDINGS})
    if (data.error) {
      return dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: BUILDING_QUERY_BUILDING_SUCCESS,
      building: data.data.buildings
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
  }
}
// building list
const QUERY_BUILDING_DETAIL = gql`
  query($id: ObjID!) {
		building(id: $id) {
			id
			name
			position
			description
			hospital {
				id
				hospitalName
			}
			floors {
				id
				floorNum
				rooms{
					name
					code
					description
				}
			}
		}
	}
`

export const queryBuildingDetail = (client, {id}) => async dispatch => {
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		const data = await client.query({ query: QUERY_BUILDING_DETAIL, variables: { id }, fetchPolicy: 'network-only'})
    if (data.error) {
      return dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: BUILDING_QUERY_BUILDING_SUCCESS,
      building: data.data.building
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
  }
}


// update building
const UPDATE_DEPARTMENT = gql`
	mutation($id: ObjID!, $deptName: String, $hot: Boolean, $description: String, $isAppointment: Boolean){
		updatebuilding(id: $id, input: {deptName: $deptName, hot: $hot, description: $description, isAppointment: $isAppointment}) {
			id
			deptName
			deptSn
			hot
			childs {
				id
				deptSn
				deptName
			}
			parent {
				id
			}
		}
	}
`

export const updatebuilding = (client, {id, deptName, deptSn, hot, description, isAppointment}) => async dispatch => {
  // console.log('---updatebuilding', id, deptName, hot)
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DEPARTMENT,
      variables: { id, deptName, hot, description, isAppointment}
		})
		if (data.error) {
      return dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: UPDATE_BUILDING_SUCCESS,
      building: data.data.updatebuilding
		})
		return null
  } catch (e) {
    dispatch({
      trype: CHECK_VERIFY_CODE_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create building
const CREATE_BUILDING = gql`
	mutation( $hospitalId: ObjID!, $name: String!, $description: String, $position: String, $code: String){
		createBuilding(input: {hospitalId: $hospitalId, name: $name, description: $description, position: $position, code: $code}) {
			id
		}
	}
`

export const createbuilding = (client, {hospitalId, name, description, position, code}) => async dispatch => {
  // console.log('---updatebuilding', id, deptName, hot)
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		console.log('-----value', hospitalId, name, description, position, code)
    let data = await client.mutate({
      mutation: CREATE_BUILDING,
      variables: { hospitalId, name, description, position, code}
		})
		if (data.error) {
      return dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: CREATE_BUILDING_SUCCESS,
      building: data.data.createBuilding
		})
		return null
  } catch (e) {
    dispatch({
      trype: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
    return e.message
  }
}


// create building
const CREATE_FLOORS = gql`
	mutation( $buildingId: ObjID!, $floorNum: String!, $description: String){
		createFloor(input: {buildingId: $buildingId, floorNum: $floorNum, description: $description}) {
			id
		}
	}
`

export const createFloor = (client, {buildingId, floorNum, description}) => async dispatch => {
  // console.log('---updatebuilding', id, deptName, hot)
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		console.log('----createFloor-value---', buildingId, floorNum, description)
    let data = await client.mutate({
      mutation: CREATE_FLOORS,
      variables: { buildingId, floorNum, description}
		})
		if (data.error) {
      return dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: CREATE_FLOORS_SUCCESS,
      floor: data.data.createFloor
		})
		return null
  } catch (e) {
    dispatch({
      trype: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
    return e.message
  }
}


// create building
const CREATE_ROOM = gql`
	mutation( $floorId: ObjID!, $name: String){
		createRoom(input: {floorId: $floorId, name: $name}) {
			id
		}
	}
`

export const createRoom = (client, {floorId, name}) => async dispatch => {
  // console.log('---updatebuilding', id, deptName, hot)
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		console.log('-----value', floorId, name)
    let data = await client.mutate({
      mutation: CREATE_ROOM,
      variables: { floorId, name}
		})
		if (data.error) {
      return dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: CREATE_ROOMS_SUCCESS,
      room: data.data.createRoom
		})
		return null
  } catch (e) {
    dispatch({
      trype: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
    return e.message
  }
}
