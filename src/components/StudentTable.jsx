import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStudent, updateStudent } from '../features/students/studentsSlice.js';
import { selectAllStudents } from '../features/students/selectors.js';
import EditModal from './EditModal.jsx';

function StudentTable() {
  const dispatch = useDispatch();
  const students = useSelector(selectAllStudents);
  const [editing, setEditing] = useState(null);

  return (
    <section className="panel panel-main">
      <h2 className="panel-header">STUDENTS</h2>
      <div className="table-scroll">
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NAME</th>
              <th>ID</th>
              <th>MAJOR</th>
              <th>GPA</th>
              <th
                className="col-act"
                style={{ minWidth: '120px', width: 'auto' }}
              >
                ACT
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">
                  NO STUDENTS - ADD ONE FROM THE SIDEBAR.
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr
                  key={student.id}
                  className={student.gpa >= 3.5 ? 'high-gpa' : ''}
                >
                  <td>{index + 1}</td>
                  <td>{student.name.toUpperCase()}</td>
                  <td>{student.studentId.toUpperCase()}</td>
                  <td>{student.major.toUpperCase()}</td>
                  <td>{student.gpa.toFixed(2)}</td>
                  <td
                    className="col-act"
                    style={{ minWidth: '120px', width: 'auto' }}
                  >
                    <button
                      type="button"
                      className="btn-x"
                      style={{ marginRight: '14px' }}
                      aria-label={`Edit ${student.name}`}
                      onClick={() => setEditing(student)}
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      className="btn-x"
                      aria-label={`Delete ${student.name}`}
                      onClick={() => dispatch(deleteStudent(student.id))}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editing ? (
        <EditModal
          student={editing}
          onSave={(payload) => {
            dispatch(updateStudent(payload));
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      ) : null}
    </section>
  );
}

export default StudentTable;
