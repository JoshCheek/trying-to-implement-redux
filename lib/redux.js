'use strict'

module.exports = {
  createStore: function(reducer, initialState) {
    if(typeof reducer !== 'function')
      throw new Error('The reducer is not a funciton')

    let action = {type: "whatever"}
    let state  = reducer(initialState, action)

    const subscribe = () => {}
    const dispatch = action => state = reducer(state, action)
    const getState = () => state
    const replaceReducer = () => {}

    return { subscribe, dispatch, getState, replaceReducer }
  },

  combineReducers: function(reducers) {
    const reducer = 'idk'
    return reducer
  },
}
