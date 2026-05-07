export const selectAllStudents = (state) => state.students.list;

export const selectStudentCount = (state) => selectAllStudents(state).length;

export const selectAverageGpa = (state) => {
  const students = selectAllStudents(state);
  if (students.length === 0) {
    return '0.00';
  }
  const sum = students.reduce((acc, s) => acc + s.gpa, 0);
  return (sum / students.length).toFixed(2);
};

export const selectHighAchievers = (state) =>
  selectAllStudents(state).filter((s) => s.gpa >= 3.5);
