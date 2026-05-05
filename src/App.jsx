import { useState } from 'react';
import AddStudentForm from './components/AddStudentForm.jsx';
import GpaSummary from './components/GpaSummary.jsx';
import StudentTable from './components/StudentTable.jsx';

const INITIAL_STUDENTS = [
  { id: 1, name: 'Wuttikan Suksan', studentId: 'STU-1001', major: 'DII', gpa: 4.00 },
  { id: 2, name: 'Naree Thongdee', studentId: 'STU-1002', major: 'DII', gpa: 3.42 },
  { id: 3, name: 'Krit Suwan', studentId: 'STU-1003', major: 'DII', gpa: 3.91 },
  { id: 4, name: 'Malee Jaikaew', studentId: 'STU-1004', major: 'DII', gpa: 2.95 },
  { id: 5, name: 'Pong Srisuk', studentId: 'STU-1005', major: 'DII', gpa: 3.28 },
];

function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const handleAddStudent = (student) => {
    setStudents((prev) => [...prev, student]);
  };

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <GpaSummary students={students} />
        <AddStudentForm onAddStudent={handleAddStudent} />
      </aside>
      <main className="content">
        <StudentTable students={students} onDeleteStudent={handleDeleteStudent} />
      </main>
    </div>
  );
}

export default App;
