import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, it, expect } from 'vitest';
import AddStudentForm from '../AddStudentForm.jsx';
import StudentTable from '../StudentTable.jsx';
import { MOCKAPI_STUDENTS_BASE } from '../../mocks/handlers.js';
import { server } from '../../mocks/server.js';
import { renderWithProviders } from '../../utils/test-utils.jsx';

function DashboardStub() {
  return (
    <>
      <StudentTable />
      <AddStudentForm />
    </>
  );
}

describe('AddStudentForm', () => {
  it('fills required fields, submits, and clears the form on success', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddStudentForm />);

    const heading = screen.getByRole('heading', { name: 'ADD STUDENT' });
    const panel = heading.closest('section');
    expect(panel).toBeTruthy();
    const panelScope = within(panel);

    await user.type(panelScope.getByRole('textbox', { name: /^NAME$/i }), 'Nova Grid');
    await user.type(panelScope.getByRole('textbox', { name: /^ID$/i }), 'DII-9000');
    await user.type(panelScope.getByRole('textbox', { name: /^MAJOR$/i }), 'Signal Theory');
    await user.type(panelScope.getByRole('textbox', { name: /^GPA$/i }), '3.5');

    await user.click(panelScope.getByRole('button', { name: '+ ADD STUDENT' }));

    await waitFor(() => {
      expect(panelScope.getByRole('textbox', { name: /^NAME$/i })).toHaveValue('');
    });
    expect(panelScope.getByRole('textbox', { name: /^ID$/i })).toHaveValue('');
    expect(panelScope.getByRole('textbox', { name: /^MAJOR$/i })).toHaveValue('');
    expect(panelScope.getByRole('textbox', { name: /^GPA$/i })).toHaveValue('');
  });

  it('disables + ADD STUDENT while the mutation is pending', async () => {
    const user = userEvent.setup();
    let unblockPost = () => {};

    const postGate = new Promise((resolve) => {
      unblockPost = resolve;
    });

    server.use(
      http.post(`${MOCKAPI_STUDENTS_BASE}/students`, async ({ request }) => {
        await postGate;
        const body = await request.json();
        return HttpResponse.json(
          {
            id: '777',
            name: body.name ?? '',
            studentId: body.studentId ?? '',
            major: body.major ?? '',
            gpa: Number(body.gpa) || 0,
          },
          { status: 201 },
        );
      }),
    );

    renderWithProviders(<AddStudentForm />);

    const heading = screen.getByRole('heading', { name: 'ADD STUDENT' });
    const panel = heading.closest('section');
    const panelScope = within(panel);
    const submit = panelScope.getByRole('button', { name: '+ ADD STUDENT' });

    await user.type(panelScope.getByRole('textbox', { name: /^NAME$/i }), 'Hold Lane');
    await user.type(panelScope.getByRole('textbox', { name: /^ID$/i }), 'DII-HOLD');
    await user.type(panelScope.getByRole('textbox', { name: /^MAJOR$/i }), 'Latency');
    await user.type(panelScope.getByRole('textbox', { name: /^GPA$/i }), '3.0');

    await user.click(submit);

    await waitFor(() => {
      expect(submit).toBeDisabled();
    });

    unblockPost();

    await waitFor(() => {
      expect(submit).not.toBeDisabled();
    });
  });

  it('pushes an optimistic list row (StudentTable) before POST completes', async () => {
    const user = userEvent.setup();
    let unblockPost = () => {};

    const postGate = new Promise((resolve) => {
      unblockPost = resolve;
    });

    server.use(
      http.post(`${MOCKAPI_STUDENTS_BASE}/students`, async ({ request }) => {
        await postGate;
        const body = await request.json();
        return HttpResponse.json(
          {
            id: '888',
            name: body.name ?? '',
            studentId: body.studentId ?? '',
            major: body.major ?? '',
            gpa: Number(body.gpa) || 0,
          },
          { status: 201 },
        );
      }),
    );

    renderWithProviders(<DashboardStub />);

    await waitForElementToBeRemoved(() => screen.queryByText('[ LOADING DATA... ]'));
    await screen.findByText('GHOST ROW');

    const addHeading = screen.getByRole('heading', { name: 'ADD STUDENT' });
    const addPanel = addHeading.closest('section');
    const addScope = within(addPanel);

    await user.type(addScope.getByRole('textbox', { name: /^NAME$/i }), 'Shadow Lane');
    await user.type(addScope.getByRole('textbox', { name: /^ID$/i }), 'DII-SHADOW');
    await user.type(addScope.getByRole('textbox', { name: /^MAJOR$/i }), 'Edge Compute');
    await user.type(addScope.getByRole('textbox', { name: /^GPA$/i }), '3.7');

    await user.click(addScope.getByRole('button', { name: '+ ADD STUDENT' }));

    expect(await screen.findByText('SHADOW LANE')).toBeInTheDocument();

    unblockPost();

    await waitFor(() => {
      expect(screen.getByText('SHADOW LANE')).toBeInTheDocument();
    });
  });
});
