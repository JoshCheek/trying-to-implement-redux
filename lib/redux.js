'use strict'

module.exports = {
  createStore: function(reducer, initialState) {
    if(typeof reducer !== 'function')
      throw new Error('The reducer is not a funciton')

    let action        = {type: "whatever"}
    let state         = reducer(initialState, action)
    let subscribers   = []
    let isReducing    = false

    const subscribe = subscriber => {
      if(isReducing)
        throw new Error('You may not call store.subscribe() from within a reducer')
      const index = subscribers.length
      subscribers.push(subscriber)
      return () => {
        subscribers = [...subscribers]
        delete subscribers[index]
      }
    }

    const dispatch = action => {
      if(isReducing)
        throw new Error('You may not dispatch from within a reducer')
      if(typeof action !== 'object' || action === null || action.constructor !== Object)
        throw new Error('Action must be a plain object')
      isReducing = true
      state = reducer(state, action)
      isReducing = false
      subscribers.forEach(subscriber => subscriber && subscriber(state))
    }

    const getState = () => {
      if(isReducing)
        throw new Error('You may not call store.getState() from within a reducer')
      return state
    }

    const replaceReducer = nextReducer => reducer = nextReducer

    return { subscribe, dispatch, getState, replaceReducer }
  },

  combineReducers: reducers => (state, action) => {
    const nextState = Object.assign({}, reducers)
    for(let key in reducers)
      nextState[key] = reducers[key](state && state[key], action)
    return nextState
  },
}
