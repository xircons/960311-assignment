import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, it, expect } from 'vitest';
import StudentTable from '../StudentTable.jsx';
import { studentsApi } from '../../features/students/studentsApi.js';
import { MOCKAPI_STUDENTS_BASE } from '../../mocks/handlers.js';
import { server } from '../../mocks/server.js';
import { renderWithProviders } from '../../utils/test-utils.jsx';

const listSnapshot = [
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

describe('StudentTable', () => {
  it('initially shows stark loading copy from the dashboard theme', () => {
    renderWithProviders(<StudentTable />);

    expect(screen.getByText('[ LOADING DATA... ]')).toBeInTheDocument();
  });

  it('renders mocked student rows from MSW after the list query resolves', async () => {
    renderWithProviders(<StudentTable />);

    await waitForElementToBeRemoved(() => screen.queryByText('[ LOADING DATA... ]'));

    expect(screen.getByRole('columnheader', { name: 'NAME' })).toBeInTheDocument();
    expect(screen.getByText('GHOST ROW')).toBeInTheDocument();
    expect(screen.getByText('RASTER KANE')).toBeInTheDocument();
  });

  it('shows [ SYNCING... ] while a refetch is in flight (cached data visible)', async () => {
    const { store } = renderWithProviders(<StudentTable />);

    await waitForElementToBeRemoved(() => screen.queryByText('[ LOADING DATA... ]'));
    await screen.findByText('GHOST ROW');

    server.use(
      http.get(`${MOCKAPI_STUDENTS_BASE}/students`, async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
        return HttpResponse.json(listSnapshot);
      }),
    );

    store.dispatch(studentsApi.util.invalidateTags([{ type: 'LIST', id: 'LIST' }]));

    expect(await screen.findByText('[ SYNCING... ]')).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText('[ SYNCING... ]'), {
      timeout: 4000,
    });
    expect(screen.getByText('GHOST ROW')).toBeInTheDocument();
  });

  it('optimistically updates the table before the PUT handler resolves', async () => {
    const user = userEvent.setup();
    let releasePut = () => {};

    const putGate = new Promise((resolve) => {
      releasePut = resolve;
    });

    server.use(
      http.put(`${MOCKAPI_STUDENTS_BASE}/students/:id`, async ({ params, request }) => {
        await putGate;
        const body = await request.json();
        return HttpResponse.json({
          id: String(params.id),
          name: body.name ?? '',
          studentId: body.studentId ?? '',
          major: body.major ?? '',
          gpa: Number(body.gpa) || 0,
        });
      }),
    );

    renderWithProviders(<StudentTable />);

    await waitForElementToBeRemoved(() => screen.queryByText('[ LOADING DATA... ]'));
    await screen.findByText('GHOST ROW');

    await user.click(screen.getByRole('button', { name: /Edit Ghost Row/i }));

    const dialog = screen.getByRole('dialog', { name: /edit student/i });
    const nameField = within(dialog).getByRole('textbox', { name: /^NAME$/i });
    await user.clear(nameField);
    await user.type(nameField, 'Reloaded');

    await user.click(within(dialog).getByRole('button', { name: 'SAVE' }));

    expect(await screen.findByText('RELOADED')).toBeInTheDocument();

    releasePut();

    await waitFor(() => {
      expect(screen.getByText('RELOADED')).toBeInTheDocument();
    });
  });
});
