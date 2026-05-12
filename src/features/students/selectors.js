import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents } from './studentsSlice.js';

export const selectAverageGpa = createSelector(
  [selectAllStudents],
  (students) => {
    if (students.length === 0) {
      return '0.00';
    }
    const sum = students.reduce((acc, s) => {
      const g = Number(s.gpa);
      return acc + (Number.isFinite(g) ? g : 0);
    }, 0);
    return (sum / students.length).toFixed(2);
  },
);

export const selectHighAchievers = createSelector(
  [selectAllStudents],
  (students) =>
    students.filter((s) => {
      const g = Number(s.gpa);
      return Number.isFinite(g) && g >= 3.5;
    }),
);

export const selectGpaDistribution = createSelector(
  [selectAllStudents],
  (students) => {
    let high = 0;
    let medium = 0;
    let low = 0;
    for (const s of students) {
      const g = Number(s.gpa);
      const val = Number.isFinite(g) ? g : 0;
      if (val >= 3.5) {
        high += 1;
      } else if (val >= 2.5) {
        medium += 1;
      } else {
        low += 1;
      }
    }
    return { high, medium, low };
  },
);

export const selectStudentsStatus = (state) => state.students.status;

export const selectStudentsError = (state) => state.students.error;
