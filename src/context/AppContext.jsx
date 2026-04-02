import { createContext, useContext, useReducer, useEffect } from "react";
import { initialTransactions } from "../data/mockData";

const AppContext = createContext(null);

const loadFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};

const initialState = {
  transactions: loadFromStorage("fin_transactions", initialTransactions),
  role: loadFromStorage("fin_role", "viewer"),
  activeTab: "dashboard",
  darkMode: true,
  filters: { type: "all", category: "all", search: "", sortBy: "date", sortDir: "desc" },
  nextId: loadFromStorage("fin_nextId", initialTransactions.length + 1),
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: { type: "all", category: "all", search: "", sortBy: "date", sortDir: "desc" } };
    case "ADD_TRANSACTION": {
      const newT = { ...action.payload, id: state.nextId };
      return { ...state, transactions: [newT, ...state.transactions], nextId: state.nextId + 1 };
    }
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("fin_transactions", JSON.stringify(state.transactions));
    localStorage.setItem("fin_role", JSON.stringify(state.role));
    localStorage.setItem("fin_nextId", JSON.stringify(state.nextId));
  }, [state.transactions, state.role, state.nextId]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
