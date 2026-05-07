import { useSelector } from 'react-redux';
import {
  selectAverageGpa,
  selectHighAchievers,
  selectStudentCount,
} from '../features/students/selectors.js';

function GpaSummary() {
  const count = useSelector(selectStudentCount);
  const avgGpa = useSelector(selectAverageGpa);
  const highAchieversCount = useSelector((state) =>
    selectHighAchievers(state).length,
  );

  return (
    <section className="panel">
      <h2 className="panel-header">SUMMARY</h2>
      <div className="stat-rows">
        <div className="stat-row">
          <span className="stat-label">TOTAL STUDENTS</span>
          <span className="stat-value">{count}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">AVERAGE GPA</span>
          <span className="stat-value">{avgGpa}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">HIGH ACHIEVERS</span>
          <span className="stat-value">{highAchieversCount}</span>
        </div>
      </div>
    </section>
  );
}

export default GpaSummary;
