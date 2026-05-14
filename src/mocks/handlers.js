import { http, HttpResponse } from 'msw';

/** Same origin as `studentsApi.js` fetchBaseQuery base (no trailing slash). */
export const MOCKAPI_STUDENTS_BASE =
  'https://69da9b2226585bd92dd400ca.mockapi.io/api/v1';

const seedStudents = [
  {
    id: '404',
    name: 'Ghost Row',
    studentId: 'DII-0000',
    major: 'Null Sector',
    gpa: 3.95,
  },
  {
    id: '505',
    name: 'Raster Kane',
    studentId: 'DII-1337',
    major: 'Dark Ledger',
    gpa: 3.2,
  },
];

let students = structuredClone(seedStudents);
let nextId = 9001;

export function resetStudentsDb() {
  students = structuredClone(seedStudents);
  nextId = 9001;
}

function sortByName(arr) {
  return [...arr].sort((a, b) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), undefined, {
      sensitivity: 'base',
    }),
  );
}

export const handlers = [
  http.get(`${MOCKAPI_STUDENTS_BASE}/students`, () => {
    return HttpResponse.json(sortByName(students));
  }),

  http.post(`${MOCKAPI_STUDENTS_BASE}/students`, async ({ request }) => {
    const body = await request.json();
    const created = {
      id: String(nextId++),
      name: body.name ?? '',
      studentId: body.studentId ?? '',
      major: body.major ?? '',
      gpa: Number(body.gpa) || 0,
    };
    students.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${MOCKAPI_STUDENTS_BASE}/students/:id`, async ({ params, request }) => {
    const body = await request.json();
    const id = String(params.id);
    const updated = {
      id,
      name: body.name ?? '',
      studentId: body.studentId ?? '',
      major: body.major ?? '',
      gpa: Number(body.gpa) || 0,
    };
    const idx = students.findIndex((s) => String(s.id) === id);
    if (idx === -1) {
      students.push(updated);
    } else {
      students[idx] = updated;
    }
    return HttpResponse.json(updated);
  }),
];
