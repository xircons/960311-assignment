function StudentTable({ students, onDeleteStudent }) {
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
              <th className="col-act">ACT</th>
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
                  <td className="col-act">
                    <button
                      type="button"
                      className="btn-x"
                      aria-label={`Delete ${student.name}`}
                      onClick={() => onDeleteStudent(student.id)}
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
    </section>
  );
}

export default StudentTable;
