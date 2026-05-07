import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL =
  'https://69da9b2226585bd92dd400ca.mockapi.io/api/v1/students';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        const text = await res.text();
        return rejectWithValue(text || `HTTP ERROR ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        return rejectWithValue('INVALID RESPONSE: EXPECTED STUDENT LIST');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message ?? 'NETWORK ERROR');
    }
  },
);

export const addStudentAsync = createAsyncThunk(
  'students/addStudentAsync',
  async (student, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: student.name,
          studentId: student.studentId,
          major: student.major,
          gpa: student.gpa,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        return rejectWithValue(text || `HTTP ERROR ${res.status}`);
      }
      return res.json();
    } catch (err) {
      return rejectWithValue(err.message ?? 'NETWORK ERROR');
    }
  },
);

export const updateStudentAsync = createAsyncThunk(
  'students/updateStudentAsync',
  async (student, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: student.name,
          studentId: student.studentId,
          major: student.major,
          gpa: student.gpa,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        return rejectWithValue(text || `HTTP ERROR ${res.status}`);
      }
      return res.json();
    } catch (err) {
      return rejectWithValue(err.message ?? 'NETWORK ERROR');
    }
  },
);

export const deleteStudentAsync = createAsyncThunk(
  'students/deleteStudentAsync',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        return rejectWithValue(text || `HTTP ERROR ${res.status}`);
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message ?? 'NETWORK ERROR');
    }
  },
);
