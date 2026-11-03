import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import {
  routineReducer,
  type Routine,
  type RoutineAction,
} from './routineReducer';
import { withLogger } from './withLogger';

const STORAGE_KEY = 'workout-routines';

export const RoutineStateContext = createContext<Routine[] | null>(null);
export const RoutineDispatchContext =
  createContext<React.Dispatch<RoutineAction> | null>(null);

const getInitialState = (): Routine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load routines from localStorage:', err);
  }
  return [];
};

export const RoutineProvider: React.FC<{
  children: ReactNode;
  initialRoutines?: Routine[];
}> = ({ children, initialRoutines }) => {
  const [state, dispatch] = useReducer(
    withLogger(routineReducer),
    initialRoutines ?? getInitialState()
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save routines to localStorage:', err);
    }
  }, [state]);

  return (
    <RoutineStateContext.Provider value={state}>
      <RoutineDispatchContext.Provider value={dispatch}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineStateContext.Provider>
  );
};

export const useRoutines = (): Routine[] => {
  const context = useContext(RoutineStateContext);
  if (!context) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
};

export const useRoutineDispatch = (): React.Dispatch<RoutineAction> => {
  const context = useContext(RoutineDispatchContext);
  if (!context) {
    throw new Error('useRoutineDispatch must be used within a RoutineProvider');
  }
  return context;
};
