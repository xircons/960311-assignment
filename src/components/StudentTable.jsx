import { useState } from 'react';
import {
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from '../features/students/studentsApi.js';
import StudentRow from './StudentRow.jsx';
import EditModal from './EditModal.jsx';

function formatQueryError(error) {
  if (error == null) {
    return 'REQUEST FAILED';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && 'status' in error) {
    const data = error.data;
    if (typeof data === 'string' && data) {
      return data;
    }
    if (data != null && typeof data === 'object' && 'message' in data) {
      return String(data.message);
    }
    return `HTTP ERROR ${error.status}`;
  }
  return String(error);
}

function StudentTable() {
  const {
    data: students = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetStudentsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [updateStudent] = useUpdateStudentMutation();
  const [editing, setEditing] = useState(null);

  const handleEditSave = async (payload) => {
    try {
      await updateStudent(payload).unwrap();
      setEditing(null);
    } catch {
    }
  };

  const showTable = !isLoading && !isError;

  const showSyncing = isFetching && !isLoading;

  return (
    <section className="panel panel-main">
      <h2 className="panel-header">STUDENTS</h2>
      {showSyncing ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            margin: 0,
            padding: '10px 16px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#ffffff',
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333333',
            borderRadius: 0,
          }}
        >
          [ SYNCING... ]
        </div>
      ) : null}
      <div className="table-scroll">
        {isLoading ? (
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

        {isError ? (
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
              {formatQueryError(error).toUpperCase()}
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => refetch()}
            >
              RETRY
            </button>
          </div>
        ) : null}

        {showTable ? (
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
                  <StudentRow
                    key={student.id}
                    student={student}
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
