'use strict'

module.exports = {
  createStore: function(reducer, initialState) {
    if(typeof reducer !== 'function')
      throw new Error('The reducer is not a funciton')

    let state = initialState

    const subscribe = () => {}
    const dispatch = () => {}
    const getState = () => state
    const replaceReducer = () => {}

    return { subscribe, dispatch, getState, replaceReducer }
  },

  combineReducers: function(reducers) {
    const reducer = 'idk'
    return reducer
  },
}
