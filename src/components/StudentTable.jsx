import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteStudentAsync,
  fetchStudents,
  updateStudentAsync,
} from '../features/students/studentsThunks.js';
import {
  selectAllStudents,
  selectStudentsError,
  selectStudentsStatus,
} from '../features/students/selectors.js';
import EditModal from './EditModal.jsx';

function StudentTable() {
  const dispatch = useDispatch();
  const students = useSelector(selectAllStudents);
  const status = useSelector(selectStudentsStatus);
  const error = useSelector(selectStudentsError);
  const [editing, setEditing] = useState(null);

  const handleDelete = (id) => {
    dispatch(deleteStudentAsync(id));
  };

  const handleEditSave = async (payload) => {
    try {
      await dispatch(updateStudentAsync(payload)).unwrap();
      setEditing(null);
    } catch {
      // Modal stays open; global error state shows in banner if status becomes failed
    }
  };

  return (
    <section className="panel panel-main">
      <h2 className="panel-header">STUDENTS</h2>
      <div className="table-scroll">
        {status === 'loading' ? (
          <div
            className="table-status-message"
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: '#888888',
              borderBottom: '1px solid #333333',
            }}
          >
            [ LOADING DATA... ]
          </div>
        ) : null}

        {status === 'failed' ? (
          <div
            className="table-error-panel"
            style={{
              padding: '16px',
              borderBottom: '1px solid #333333',
            }}
          >
            <div
              className="form-error"
              style={{ margin: '0 0 12px 0' }}
              role="alert"
            >
              {error ?? 'REQUEST FAILED'}
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => dispatch(fetchStudents())}
            >
              RETRY
            </button>
          </div>
        ) : null}

        {status === 'succeeded' ? (
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
                students.map((student, index) => {
                  const gpaNum = Number(student.gpa);
                  const gpaDisplay = Number.isFinite(gpaNum)
                    ? gpaNum.toFixed(2)
                    : String(student.gpa ?? '');
                  return (
                    <tr
                      key={student.id}
                      className={
                        Number.isFinite(gpaNum) && gpaNum >= 3.5 ? 'high-gpa' : ''
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{(student.name ?? '').toUpperCase()}</td>
                      <td>{(student.studentId ?? '').toUpperCase()}</td>
                      <td>{(student.major ?? '').toUpperCase()}</td>
                      <td>{gpaDisplay}</td>
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
                          onClick={() => handleDelete(student.id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : null}
      </div>
      {editing ? (
        <EditModal
          student={editing}
          onSave={handleEditSave}
          onCancel={() => setEditing(null)}
        />
      ) : null}
    </section>
  );
}

export default StudentTable;
