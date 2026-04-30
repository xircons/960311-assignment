import { useMemo, useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

function csvEscape(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  }).format(Number(value || 0));
}

export default function ExpenseList() {
  const { state, categories, setFilter, deleteExpense, editExpense } = useExpenses();
  const { expenses, filter } = state;

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    amount: "",
    category: categories[0],
    date: ""
  });

  const sortedExpenses = useMemo(() => {
    const filtered =
      filter === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === filter);
    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filter]);

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditValues({
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
  };

  const cancelEditing = () => setEditingId(null);

  const saveEditing = (id) => {
    if (!editValues.name.trim() || Number(editValues.amount) <= 0) return;
    editExpense(id, {
      name: editValues.name.trim(),
      amount: Number(editValues.amount),
      category: editValues.category,
      date: editValues.date
    });
    setEditingId(null);
  };

  const exportToCsv = () => {
    const headers = ["Name", "Amount (THB)", "Category", "Date"];
    const rows = expenses.map((expense) => [
      csvEscape(expense.name),
      csvEscape(Number(expense.amount).toFixed(2)),
      csvEscape(expense.category),
      csvEscape(expense.date)
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel list-panel">
      <div className="panel-heading">
        <span className="panel-heading__text">
          Expenses
          {sortedExpenses.length > 0 && (
            <span style={{ opacity: 0.45, marginLeft: 8, fontWeight: 400 }}>
              ({sortedExpenses.length})
            </span>
          )}
        </span>
      </div>

      <div className="filter-tabs">
        {["All", ...categories].map((option) => (
          <button
            key={option}
            type="button"
            className={filter === option ? "active-tab" : ""}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="expense-list">
        {sortedExpenses.length === 0 ? (
          <div className="empty-state">No expenses found</div>
        ) : (
          <>
            <div className="expense-table-head">
              <span>Name</span>
              <span>Amount</span>
              <span>Category</span>
              <span>Date</span>
            </div>

            {sortedExpenses.map((expense) => (
              <article key={expense.id} className="expense-item">
                {editingId === expense.id ? (
                  <div className="edit-form-inline">
                    <input
                      type="text"
                      value={editValues.name}
                      onChange={(event) =>
                        setEditValues((c) => ({ ...c, name: event.target.value }))
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editValues.amount}
                      onChange={(event) =>
                        setEditValues((c) => ({ ...c, amount: event.target.value }))
                      }
                    />
                    <div className="select-wrapper">
                      <select
                        value={editValues.category}
                        onChange={(event) =>
                          setEditValues((c) => ({ ...c, category: event.target.value }))
                        }
                      >
                        {categories.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className="select-icon">
                        <ChevronDown size={13} />
                      </span>
                    </div>
                    <div className="select-wrapper">
                      <input
                        type="date"
                        value={editValues.date}
                        onChange={(event) =>
                          setEditValues((c) => ({ ...c, date: event.target.value }))
                        }
                      />
                      <span className="input-icon">
                        <Calendar size={13} />
                      </span>
                    </div>
                    <div className="expense-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => saveEditing(expense.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="expense-meta">
                      <p>{expense.name}</p>
                      <p className="amount-cell">{formatCurrency(expense.amount)}</p>
                      <p>
                        <span className="category-tag">{expense.category}</span>
                      </p>
                      <p className="expense-date">{expense.date}</p>
                    </div>
                    <div className="expense-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => startEditing(expense)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete ×
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </>
        )}
      </div>

      <button type="button" className="csv-button" onClick={exportToCsv}>
        ↓ Export to CSV
      </button>
    </section>
  );
}
