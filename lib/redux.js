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
      if(typeof action !== 'object' || action === null || action.constructor !== Object)
        throw new Error('Action must be a plain object')
      state = reducer(state, action)
      subscribers.forEach(subscriber => subscriber && subscriber(state))
    }
    const getState       = () => state
    const replaceReducer = nextReducer => reducer = nextReducer

    return { subscribe, dispatch, getState, replaceReducer }
  },

  combineReducers: function(reducers) {
    const initial = Symbol('initial')
    return (state=initial, action) => {
      if(state === initial) {
        state = {}
        for(let key in reducers)
          state[key] = undefined
      }
      const nextState = Object.assign({}, state)
      for(let key in reducers)
        nextState[key] = reducers[key](state[key], action)
      return nextState
    }
  },
}
