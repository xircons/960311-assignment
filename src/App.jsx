import { ExpenseProvider } from "./context/ExpenseContext";
import ExpenseSummary from "./components/ExpenseSummary";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";

export default function App() {
  return (
    <ExpenseProvider>
      <div className="main-layout">
        <aside className="summary-column">
          <ExpenseSummary />
        </aside>
        <main className="content-column">
          <AddExpenseForm />
          <ExpenseList />
        </main>
      </div>
    </ExpenseProvider>
  );
}
