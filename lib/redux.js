'use strict'
const $$observable = require('symbol-observable')

module.exports = {
  createStore: function(reducer, initialState, enhancer) {
    if(typeof reducer !== 'function')
      throw new Error('The reducer is not a funciton')

    if(typeof enhancer !== 'undefined' && typeof enhancer !== 'function')
      throw new Error('Enhancer must be undefined or a function')

    if(enhancer === undefined && typeof initialState === 'function') {
      enhancer     = initialState
      initialState = undefined
    }

    let action        = {type: "whatever"}
    let state         = initialState
    let subscribers   = []
    let isReducing    = false

    const subscribe = subscriber => {
      if(typeof subscriber !== 'function')
        throw new Error('Expected the subscriber to be a function.')
      if(isReducing)
        throw new Error('You may not call store.subscribe() from within a reducer')
      const index = subscribers.length
      subscribers.push(subscriber)
      return () => {
        if(isReducing)
          throw new Error('You may not unsubscribe from a store within a reducer')
        subscribers = [...subscribers]
        delete subscribers[index]
      }
    }

    const dispatch = action => {
      if(isReducing)
        throw new Error('You may not dispatch from within a reducer')
      if(typeof action !== 'object' || action === null || action.constructor !== Object)
        throw new Error('Action must be a plain object')
      if(action.type === undefined)
        throw new Error('Actions may not have an undefined "type" property')
      isReducing = true
      try {
        state = reducer(state, action)
      }
      catch(e) {
        isReducing = false
        throw e
      }
      isReducing = false
      subscribers.forEach(subscriber => subscriber && subscriber(state))
    }

    const getState = () => {
      if(isReducing)
        throw new Error('You may not call store.getState() from within a reducer')
      return state
    }

    const replaceReducer = nextReducer => {
      if(typeof nextReducer !== 'function')
        throw new Error('Expected the nextReducer to be a function.')
      reducer = nextReducer
    }

    let store = {
      subscribe,
      dispatch,
      getState,
      replaceReducer,
      $$observable: () => ({ subscribe }),
    }
    if(enhancer) {
      return store = enhancer((reducer, initialState) => {
        state = reducer(initialState, action)
        return store
      })(reducer, initialState)
    }
    else {
      state = reducer(initialState, action)
      return store
    }
  },

  combineReducers: reducers => (state, action) => {
    const nextState = Object.assign({}, reducers)
    for(let key in reducers)
      nextState[key] = reducers[key](state && state[key], action)
    return nextState
  },
}
