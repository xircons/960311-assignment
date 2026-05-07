import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AddStudentForm from './components/AddStudentForm.jsx';
import GpaSummary from './components/GpaSummary.jsx';
import StudentTable from './components/StudentTable.jsx';
import { fetchStudents } from './features/students/studentsThunks.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <GpaSummary />
        <AddStudentForm />
      </aside>
      <main className="content">
        <StudentTable />
      </main>
    </div>
  );
}

export default App;
