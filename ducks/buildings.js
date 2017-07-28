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
		const data = await client.query({ query: QUERY_BUILDINGS, fetchPolicy: 'network-only'})
    if (data.error) {
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: BUILDING_QUERY_BUILDING_SUCCESS,
      building: data.data.buildings
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
    return e.message
  }
}

// building detail
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
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: BUILDING_QUERY_BUILDING_SUCCESS,
      building: data.data.building
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: BUILDING_QUERY_BUILDING_FAIL,
      error: e.message
    })
    return e.message
  }
}


// update building
const UPDATE_BUILDING = gql`
	mutation($id: ObjID!, $hospitalId: ObjID!, $name: String!, $description: String, $position: String, $code: String){
		updateBuilding(id: $id, input: {hospitalId: $hospitalId, name: $name, description: $description, position: $position, code: $code}) {
			id
		}
	}
`

export const updateBuilding = (client, {id, hospitalId, name, description, position, code}) => async dispatch => {
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
    console.log('---updateBuilding', id, hospitalId, name, description, position, code)
    let data = await client.mutate({
      mutation: UPDATE_BUILDING,
      variables: { id, hospitalId, name, description, position, code}
		})
		if (data.error) {
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_BUILDING_SUCCESS,
      building: data.data.updateBuilding
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
const CREATE_BUILDING = gql`
	mutation($hospitalId: ObjID!, $name: String!, $description: String, $position: String, $code: String){
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
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
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


// update floor
const UPDATE_FLOOR = gql`
	mutation($id: ObjID!,  $buildingId: ObjID!, $floorNum: String!, $description: String){
		updateFloor(id: $id, input: {buildingId: $buildingId, floorNum: $floorNum, description: $description}) {
			id
		}
	}
`
export const updateFloor = (client, {id, buildingId, floorNum, description}) => async dispatch => {
  // console.log('---updatebuilding', id, deptName, hot)
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		console.log('----updateFloor-value---', id, buildingId, floorNum, description)
    let data = await client.mutate({
      mutation: UPDATE_FLOOR,
      variables: { id, buildingId, floorNum, description}
		})
		if (data.error) {
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_FLOORS_SUCCESS,
      floor: data.data.updateFloor
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

// create floor
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
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
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


// create room
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
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
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

// update room
const UPDATE_ROOM = gql`
	mutation($id: ObjID!, $floorId: ObjID!, $name: String){
		updateRoom(id: $id, input: {floorId: $floorId, name: $name}) {
			id
		}
	}
`
export const updateRoom = (client, {id, floorId, name}) => async dispatch => {
  // console.log('---updatebuilding', id, deptName, hot)
  dispatch({
    type: BUILDING_QUERY_BUILDINGS
  })
  try {
		console.log('---updateRoom--value', id, floorId, name)
    let data = await client.mutate({
      mutation: UPDATE_ROOM,
      variables: { id, floorId, name}
		})
		if (data.error) {
      dispatch({
        type: BUILDING_QUERY_BUILDING_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_ROOMS_SUCCESS,
      room: data.data.updateRoom
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
