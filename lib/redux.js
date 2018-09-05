'use strict'

module.exports = {
  createStore: function(reducer) {
    if(typeof reducer !== 'function')
      throw new Error('The reducer is not a funciton')
    const store = {
      subscribe: 'idk',
      dispatch: 'idk',
      getState: 'idk',
      replaceReducer: 'idk',
    }

    return store
  },

  combineReducers: function(reducers) {
    const reducer = 'idk'
    return reducer
  },
}
