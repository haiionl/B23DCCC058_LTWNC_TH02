export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export type RoutineAction =
  | { type: 'create'; payload: { id?: string; name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addExercise'; payload: { routineId: string; exerciseId: string } }
  | { type: 'removeExercise'; payload: { routineId: string; exerciseId: string } };

export const routineReducer = (
  state: Routine[],
  action: RoutineAction
): Routine[] => {
  switch (action.type) {
    case 'create': {
      const newRoutine: Routine = {
        id: action.payload.id || `routine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: action.payload.name.trim(),
        exerciseIds: [],
      };
      return [...state, newRoutine];
    }

    case 'rename': {
      return state.map((routine) =>
        routine.id === action.payload.id
          ? { ...routine, name: action.payload.name.trim() }
          : routine
      );
    }

    case 'remove': {
      const exists = state.some((r) => r.id === action.payload.id);
      if (!exists) {
        return state;
      }
      return state.filter((routine) => routine.id !== action.payload.id);
    }

    case 'addExercise': {
      return state.map((routine) => {
        if (routine.id !== action.payload.routineId) {
          return routine;
        }
        if (routine.exerciseIds.includes(action.payload.exerciseId)) {
          return routine;
        }
        return {
          ...routine,
          exerciseIds: [...routine.exerciseIds, action.payload.exerciseId],
        };
      });
    }

    case 'removeExercise': {
      return state.map((routine) => {
        if (routine.id !== action.payload.routineId) {
          return routine;
        }
        return {
          ...routine,
          exerciseIds: routine.exerciseIds.filter(
            (id) => id !== action.payload.exerciseId
          ),
        };
      });
    }

    default:
      return state;
  }
};
