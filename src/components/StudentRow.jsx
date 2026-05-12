import { memo } from 'react';
import { useDeleteStudentMutation } from '../features/students/studentsApi.js';

function StudentRow({ student, index, onEdit }) {
  const [deleteStudent] = useDeleteStudentMutation();

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
          onClick={() => deleteStudent(student.id)}
        >
          X
        </button>
      </td>
    </tr>
  );
}

export default memo(StudentRow);
