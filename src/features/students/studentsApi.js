import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL =
  'https://69da9b2226585bd92dd400ca.mockapi.io/api/v1/';

function normalizeStudent(raw) {
  const gpa = Number(raw.gpa);
  return {
    ...raw,
    id: String(raw.id),
    name: raw.name ?? '',
    studentId: raw.studentId ?? '',
    major: raw.major ?? '',
    gpa: Number.isFinite(gpa) ? gpa : 0,
  };
}

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Student', 'LIST'],
  endpoints: (build) => ({
    getStudents: build.query({
      query: () => 'students',
      transformResponse: (response) => {
        if (!Array.isArray(response)) {
          return [];
        }
        return response
          .map(normalizeStudent)
          .sort((a, b) =>
            String(a.name ?? '').localeCompare(String(b.name ?? ''), undefined, {
              sensitivity: 'base',
            }),
          );
      },
      providesTags: (result) => [
        { type: 'LIST', id: 'LIST' },
        ...(result ?? []).map((s) => ({ type: 'Student', id: s.id })),
      ],
    }),
    getStudentById: build.query({
      query: (id) => `students/${id}`,
      transformResponse: (raw) => normalizeStudent(raw),
      providesTags: (_result, _error, id) => [
        { type: 'Student', id: String(id) },
      ],
    }),
    addStudent: build.mutation({
      query: (student) => ({
        url: 'students',
        method: 'POST',
        body: {
          name: student.name,
          studentId: student.studentId,
          major: student.major,
          gpa: student.gpa,
        },
      }),
      transformResponse: (raw) => normalizeStudent(raw),
      invalidatesTags: [{ type: 'LIST', id: 'LIST' }],
    }),
    updateStudent: build.mutation({
      query: (student) => ({
        url: `students/${student.id}`,
        method: 'PUT',
        body: {
          name: student.name,
          studentId: student.studentId,
          major: student.major,
          gpa: student.gpa,
        },
      }),
      transformResponse: (raw) => normalizeStudent(raw),
      async onQueryStarted(student, { dispatch, queryFulfilled }) {
        const idStr = String(student.id);
        const gpa = Number(student.gpa);
        const optimistic = {
          ...student,
          id: idStr,
          name: student.name ?? '',
          studentId: student.studentId ?? '',
          major: student.major ?? '',
          gpa: Number.isFinite(gpa) ? gpa : 0,
        };

        const patchList = dispatch(
          studentsApi.util.updateQueryData('getStudents', undefined, (draft) => {
            const idx = draft.findIndex((s) => String(s.id) === idStr);
            if (idx !== -1) {
              Object.assign(draft[idx], optimistic);
            }
          }),
        );

        const patchDetail = dispatch(
          studentsApi.util.updateQueryData('getStudentById', idStr, (draft) => {
            Object.assign(draft, optimistic);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchDetail.undo();
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Student', id: String(arg.id) },
        { type: 'LIST', id: 'LIST' },
      ],
    }),
    deleteStudent: build.mutation({
      query: (id) => ({
        url: `students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Student', id: String(id) },
        { type: 'LIST', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
