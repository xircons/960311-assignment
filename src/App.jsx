import AddStudentForm from './components/AddStudentForm.jsx';
import GpaSummary from './components/GpaSummary.jsx';
import StudentTable from './components/StudentTable.jsx';

function App() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <GpaSummary students={[]} />
        <AddStudentForm onAddStudent={() => {}} />
      </aside>
      <main className="content">
        <StudentTable students={[]} onDeleteStudent={() => {}} />
      </main>
    </div>
  );
}

export default App;
