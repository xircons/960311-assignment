import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteStudentAsync,
  fetchStudents,
  updateStudentAsync,
} from '../features/students/studentsThunks.js';
import {
  selectStudentById,
  selectStudentIds,
} from '../features/students/studentsSlice.js';
import {
  selectStudentsError,
  selectStudentsStatus,
} from '../features/students/selectors.js';
import EditModal from './EditModal.jsx';

function StudentRow({ id, index, onEdit }) {
  const student = useSelector((state) =>
    selectStudentById(state, id),
  );

  const dispatch = useDispatch();

  if (!student) {
    return null;
  }

  const gpaNum = Number(student.gpa);
  const gpaDisplay = Number.isFinite(gpaNum)
    ? gpaNum.toFixed(2)
    : String(student.gpa ?? '');

  return (
    <tr
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
          onClick={() => onEdit(student)}
        >
          EDIT
        </button>
        <button
          type="button"
          className="btn-x"
          aria-label={`Delete ${student.name}`}
          onClick={() => dispatch(deleteStudentAsync(student.id))}
        >
          X
        </button>
      </td>
    </tr>
  );
}

const MemoStudentRow = memo(StudentRow);

function StudentTable() {
  const dispatch = useDispatch();
  const studentIds = useSelector(selectStudentIds);
  const status = useSelector(selectStudentsStatus);
  const error = useSelector(selectStudentsError);
  const [editing, setEditing] = useState(null);

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
              {studentIds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    NO STUDENTS - ADD ONE FROM THE SIDEBAR.
                  </td>
                </tr>
              ) : (
                studentIds.map((studentId, index) => (
                  <MemoStudentRow
                    key={studentId}
                    id={studentId}
                    index={index}
                    onEdit={setEditing}
                  />
                ))
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
