import userStore from '../state/userStore';
import { UserType } from '../types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useState
} from 'react';

interface State {
  loading: boolean;
  user: UserType | null;
  isAuthenticated: boolean;
  authAttempted: boolean;
}

enum ActionTypes {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  SET_LOADING = 'SET_LOADING',
  AUTH_ATTEMPTED = 'AUTH_ATTEMPTED',
  SET_AUTHENTICATED = 'SET_AUTHENTICATED'
}

interface Action {
  type: ActionTypes;
  payload?: any;
}

interface AuthContextProps {
  state: State;
  reloadAuth(): any;
}

const initialState: State = {
  loading: true,
  user: null,
  isAuthenticated: false,
  authAttempted: false
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: true };
    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        authAttempted: true
      };
    case ActionTypes.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        authAttempted: true
      };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.AUTH_ATTEMPTED:
      return { ...state, authAttempted: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: any }) => {
  const { fetchUser, user: currentUser, logoutUser } = userStore();
  const [hasRefetched, setHasRefetched] = useState<boolean>(false);
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { isAuthenticated } = state;

  const reloadAuth = useCallback(() => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
  }, [dispatch]);

  useEffect(() => {
    if (!hasRefetched && isAuthenticated) {
      fetchUser().then((status) => setHasRefetched(status));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, hasRefetched]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.uid === currentUser?.firebaseId) {
          dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: currentUser });
        } else {
          try {
            const fetchedUser = await fetchUser();
            if (fetchedUser) {
              dispatch({
                type: ActionTypes.AUTH_SUCCESS,
                payload: fetchedUser
              });
            } else {
              dispatch({ type: ActionTypes.AUTH_FAILURE });
            }
          } catch {
            dispatch({ type: ActionTypes.AUTH_FAILURE });
          } finally {
            dispatch({ type: ActionTypes.SET_LOADING, payload: false });
          }
        }
      } else {
        logoutUser();
        dispatch({ type: ActionTypes.AUTH_FAILURE });
      }
      dispatch({ type: ActionTypes.AUTH_ATTEMPTED });
    });

    return () => unsubscribe();
  }, [fetchUser, currentUser]);

  return (
    <AuthContext.Provider value={{ state, reloadAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
