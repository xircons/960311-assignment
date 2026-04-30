import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddExpenseForm() {
  const { addExpense, categories } = useExpenses();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    addExpense({ name, amount: Number(amount), category, date });
    setName("");
    setAmount("");
    setCategory(categories[0]);
    setDate(getTodayString());
    setError("");
  };

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <span className="panel-heading__text">Add Expense</span>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-field">
          <label htmlFor="expense-name">Name</label>
          <input
            id="expense-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Grab ride"
          />
        </div>

        <div className="form-field">
          <label htmlFor="expense-amount">Amount</label>
          <input
            id="expense-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="form-field">
          <label htmlFor="expense-category">Category</label>
          <div className="select-wrapper">
            <select
              id="expense-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="select-icon">
              <ChevronDown size={14} />
            </span>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="expense-date">Date</label>
          <div className="select-wrapper">
            <input
              id="expense-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <span className="input-icon">
              <Calendar size={14} />
            </span>
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="form-submit-row">
          <button type="submit" className="btn-primary">
            + Add Expense
          </button>
        </div>
      </form>
    </section>
  );
}
