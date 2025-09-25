import React, { createContext, useContext, useReducer } from 'react'

const SimulationContext = createContext()

const initialState = {
  isSimulating: false,
  simulationData: null,
  towers: [],
  realTimeData: [],
  userCount: 135
}

const simulationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SIMULATING':
      return { ...state, isSimulating: action.payload }
    case 'SET_SIMULATION_DATA':
      return { ...state, simulationData: action.payload }
    case 'SET_TOWERS':
      return { ...state, towers: action.payload }
    case 'SET_REALTIME_DATA':
      return { ...state, realTimeData: action.payload }
    case 'SET_USER_COUNT':
      return { ...state, userCount: action.payload }
    default:
      return state
  }
}

export const SimulationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState)

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  )
}

export const useSimulation = () => {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
