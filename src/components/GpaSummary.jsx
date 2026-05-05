function GpaSummary({ students }) {
  const total = students.length;
  const gpas = students.map((s) => s.gpa);

  const avg =
    total > 0 ? (gpas.reduce((a, b) => a + b, 0) / total).toFixed(2) : '--';
  const highest = total > 0 ? Math.max(...gpas).toFixed(2) : '--';
  const lowest = total > 0 ? Math.min(...gpas).toFixed(2) : '--';

  return (
    <section className="panel">
      <h2 className="panel-header">SUMMARY</h2>
      <div className="stat-rows">
        <div className="stat-row">
          <span className="stat-label">TOTAL STUDENTS</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">AVERAGE GPA</span>
          <span className="stat-value">{avg}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">HIGHEST GPA</span>
          <span className="stat-value">{highest}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">LOWEST GPA</span>
          <span className="stat-value">{lowest}</span>
        </div>
      </div>
    </section>
  );
}

export default GpaSummary;
