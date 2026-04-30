import { createContext, useContext, useReducer, useEffect, useRef } from "react";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health",
  "Other"
];

const STORAGE_KEY = "lab5-expense-state";

const initialState = {
  expenses: [],
  filter: "All",
  budget: 0
};

function expenseReducer(state, action) {
  switch (action.type) {
    case "LOAD": {
      const loadedExpenses = Array.isArray(action.payload?.expenses)
        ? action.payload.expenses
        : [];
      const loadedBudget = Number(action.payload?.budget) || 0;
      return {
        ...state,
        expenses: loadedExpenses,
        budget: loadedBudget
      };
    }
    case "ADD":
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      };
    case "DELETE":
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload)
      };
    case "FILTER":
      return {
        ...state,
        filter: action.payload
      };
    case "EDIT":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id
            ? {
                ...expense,
                ...action.payload.updates,
                amount: Number(action.payload.updates.amount)
              }
            : expense
        )
      };
    case "SET_BUDGET":
      return {
        ...state,
        budget: Math.max(0, Number(action.payload) || 0)
      };
    default:
      return state;
  }
}

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  // Tracks whether the persist effect has already run once.
  // Starts true so the very first execution (initial empty state) is skipped,
  // preventing it from overwriting localStorage before the LOAD re-render.
  const skipFirstPersist = useRef(true);

  // Effect 1: load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      }
    } catch {
      // initialState already applied — nothing to do
    }
  }, []);

  // Effect 2: persist whenever expenses or budget change
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false;
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        expenses: state.expenses,
        budget: state.budget
      })
    );
  }, [state.expenses, state.budget]);

  const addExpense = ({ name, amount, category, date }) => {
    dispatch({
      type: "ADD",
      payload: {
        id: crypto.randomUUID(),
        name: name.trim(),
        amount: Number(amount),
        category,
        date
      }
    });
  };

  const deleteExpense = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const editExpense = (id, updates) => {
    dispatch({ type: "EDIT", payload: { id, updates } });
  };

  const setFilter = (filter) => {
    dispatch({ type: "FILTER", payload: filter });
  };

  const setBudget = (budget) => {
    dispatch({ type: "SET_BUDGET", payload: budget });
  };

  return (
    <ExpenseContext.Provider
      value={{
        state,
        categories: CATEGORIES,
        addExpense,
        deleteExpense,
        editExpense,
        setFilter,
        setBudget
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }

  return context;
}
