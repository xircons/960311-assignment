import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStudent } from '../features/students/studentsSlice.js';

const emptyForm = { name: '', studentId: '', major: '', gpa: '' };

function AddStudentForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

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

    dispatch(
      addStudent({
        id: Date.now(),
        name,
        studentId,
        major,
        gpa: gpaNum,
      }),
    );

    setFormData(emptyForm);
    setError('');
  };

  return (
    <section className="panel">
      <h2 className="panel-header">ADD STUDENT</h2>
      <form onSubmit={handleSubmit} className="form-table" noValidate>
        <div className="form-row">
          <label htmlFor="name" className="form-label">
            NAME
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label htmlFor="studentId" className="form-label">
            ID
          </label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            value={formData.studentId}
            onChange={handleChange}
            className="form-input"
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label htmlFor="major" className="form-label">
            MAJOR
          </label>
          <input
            id="major"
            name="major"
            type="text"
            value={formData.major}
            onChange={handleChange}
            className="form-input"
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <label htmlFor="gpa" className="form-label">
            GPA
          </label>
          <input
            id="gpa"
            name="gpa"
            type="text"
            value={formData.gpa}
            onChange={handleChange}
            className="form-input"
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
        {error ? <div className="form-error">{error}</div> : null}
        <button type="submit" className="btn-primary">
          + ADD STUDENT
        </button>
      </form>
    </section>
  );
}

export default AddStudentForm;
