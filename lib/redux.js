'use strict'

module.exports = {
  createStore: function(reducer, initialState) {
    if(typeof reducer !== 'function')
      throw new Error('The reducer is not a funciton')

    let action      = {type: "whatever"}
    let state       = reducer(initialState, action)
    let subscribers = []

    const subscribe = subscriber => {
      const index = subscribers.length
      subscribers.push(subscriber)
      return () => {
        subscribers = [...subscribers]
        delete subscribers[index]
      }
    }
    const dispatch = action => {
      state = reducer(state, action)
      subscribers.forEach(subscriber => subscriber && subscriber(state))
    }
    const getState       = () => state
    const replaceReducer = nextReducer => reducer = nextReducer

    return { subscribe, dispatch, getState, replaceReducer }
  },

  combineReducers: function(reducers) {
    const reducer = 'idk'
    return reducer
  },
}
