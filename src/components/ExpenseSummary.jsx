import { useMemo, useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";

function formatAmount(value) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  }).format(Number(value || 0));
}

export default function ExpenseSummary() {
  const { state, categories, setBudget } = useExpenses();
  const { expenses, budget } = state;

  const [budgetInput, setBudgetInput] = useState(budget === 0 ? "" : String(budget));

  useEffect(() => {
    if (budget === 0 && budgetInput === "") return;
    if (Number(budgetInput) !== budget) {
      setBudgetInput(budget === 0 ? "" : String(budget));
    }
  // sync only when budget changes from outside (e.g. localStorage load)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget]);

  const commitBudget = () => {
    const parsed = parseFloat(budgetInput);
    setBudget(isNaN(parsed) || parsed < 0 ? 0 : parsed);
  };

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [expenses]
  );

  const byCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      total: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    }));
  }, [categories, expenses]);

  const maxCategoryTotal = Math.max(...byCategory.map((item) => item.total), 0);
  const budgetUsedPercent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const isOverBudget = budget > 0 && total > budget;

  return (
    <section className="panel summary-panel">
      <div className="panel-heading">
        <span className="panel-heading__text">Summary</span>
      </div>

      <div className="stat-cards">
        <div className="stat-card stat-card--total">
          <span className="stat-card__label">Total Spent</span>
          <span className="stat-card__value">{formatAmount(total)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Transactions</span>
          <span className="stat-card__value">{expenses.length}</span>
        </div>
      </div>

      <div className="budget-block">
        <div className="panel-heading">
          <span className="panel-heading__text">Monthly Budget</span>
        </div>

        <div className="budget-input-row">
          <input
            id="budget-input"
            type="number"
            min="0"
            step="0.01"
            value={budgetInput}
            placeholder="Set budget..."
            onChange={(event) => setBudgetInput(event.target.value)}
            onBlur={commitBudget}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitBudget();
                event.currentTarget.blur();
              }
            }}
          />
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Budget Used</span>
          <span className="stat-card__value">{budgetUsedPercent.toFixed(1)}%</span>
        </div>

        <div className="budget-progress-wrap">
          <div className="budget-progress-track">
            <div
              className={`budget-progress-fill${isOverBudget ? " budget-progress-fill--over" : ""}`}
              style={{ width: `${budgetUsedPercent}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Remaining</span>
          <span className="stat-card__value">
            {formatAmount(Math.max(0, Number(budget) - total))}
          </span>
        </div>
      </div>

      <div className="chart-block">
        <div className="panel-heading">
          <span className="panel-heading__text">By Category</span>
        </div>

        {byCategory.map((item) => {
          const width =
            maxCategoryTotal > 0 ? (item.total / maxCategoryTotal) * 100 : 0;

          return (
            <div className="bar-row" key={item.category}>
              <div className="bar-label">
                <span className="bar-label__name">{item.category}</span>
                <span className="bar-label__value">{formatAmount(item.total)}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
