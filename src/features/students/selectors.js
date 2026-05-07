export const selectAllStudents = (state) => state.students.list;

export const selectStudentCount = (state) => selectAllStudents(state).length;

export const selectAverageGpa = (state) => {
  const students = selectAllStudents(state);
  if (students.length === 0) {
    return '0.00';
  }
  const sum = students.reduce((acc, s) => {
    const g = Number(s.gpa);
    return acc + (Number.isFinite(g) ? g : 0);
  }, 0);
  return (sum / students.length).toFixed(2);
};

export const selectHighAchievers = (state) =>
  selectAllStudents(state).filter((s) => {
    const g = Number(s.gpa);
    return Number.isFinite(g) && g >= 3.5;
  });

export const selectStudentsStatus = (state) => state.students.status;

export const selectStudentsError = (state) => state.students.error;
