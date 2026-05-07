import { useEffect, useState } from 'react';

const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  zIndex: 1000,
};

const modalShellStyle = {
  width: '100%',
  maxWidth: '420px',
  background: '#1a1a1a',
  border: '1px solid #ffffff',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
};

const modalTitleStyle = {
  margin: 0,
  padding: '12px 16px',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#888888',
  borderBottom: '1px solid #333333',
};

const btnSaveStyle = {
  width: '100%',
  marginTop: '12px',
  padding: '14px 16px',
  background: '#ffffff',
  color: '#000000',
  border: '1px solid #ffffff',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '12px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnCancelStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '14px 16px',
  background: 'transparent',
  color: '#ffffff',
  border: '1px solid #ffffff',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '12px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

function EditModal({ student, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: student.name,
    studentId: student.studentId,
    major: student.major,
    gpa: String(student.gpa),
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: student.name,
      studentId: student.studentId,
      major: student.major,
      gpa: String(student.gpa),
    });
    setError('');
  }, [student]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const studentId = formData.studentId.trim();
    const major = formData.major.trim();
    const gpaNum = parseFloat(formData.gpa);

    if (!name || !studentId) {
      setError('INVALID INPUT - NAME AND ID ARE REQUIRED');
      return;
    }

    if (Number.isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
      setError('INVALID INPUT - GPA MUST BE A NUMBER BETWEEN 0.00 AND 4.00');
      return;
    }

    setError('');
    onSave({
      id: student.id,
      name,
      studentId,
      major,
      gpa: gpaNum,
    });
  };

  return (
    <div
      className="modal-backdrop"
      style={modalBackdropStyle}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="modal-content"
        style={modalShellStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-student-heading"
      >
        <h2 id="edit-student-heading" style={modalTitleStyle}>
          EDIT STUDENT
        </h2>
        <form
          className="form-table"
          onSubmit={handleSubmit}
          style={{ padding: '0', borderBottom: 'none' }}
          noValidate
        >
          <div className="form-row">
            <label htmlFor="edit-name" className="form-label">
              NAME
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
          </div>
          <div className="form-row">
            <label htmlFor="edit-studentId" className="form-label">
              ID
            </label>
            <input
              id="edit-studentId"
              name="studentId"
              type="text"
              value={formData.studentId}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
          </div>
          <div className="form-row">
            <label htmlFor="edit-major" className="form-label">
              MAJOR
            </label>
            <input
              id="edit-major"
              name="major"
              type="text"
              value={formData.major}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
          </div>
          <div className="form-row">
            <label htmlFor="edit-gpa" className="form-label">
              GPA
            </label>
            <input
              id="edit-gpa"
              name="gpa"
              type="text"
              value={formData.gpa}
              onChange={handleChange}
              className="form-input"
              inputMode="decimal"
              autoComplete="off"
            />
          </div>
          {error ? (
            <div className="form-error" style={{ margin: '12px 16px' }}>
              {error}
            </div>
          ) : null}
          <div style={{ padding: '0 16px 16px' }}>
            <button type="submit" style={btnSaveStyle}>
              SAVE
            </button>
            <button
              type="button"
              style={btnCancelStyle}
              onClick={onCancel}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
