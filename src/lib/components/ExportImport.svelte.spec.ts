import { page, userEvent } from 'vitest/browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ExportImport from './ExportImport.svelte';
import { skillTreeStore } from '$lib/store.svelte';

const validPayload = {
	version: 1,
	exportedAt: '2026-01-01T00:00:00.000Z',
	completedNodes: ['p_ballad', 'p_triolet']
};

function makeJsonFile(content: unknown, name = 'progress.json'): File {
	return new File([JSON.stringify(content)], name, { type: 'application/json' });
}

beforeEach(() => {
	skillTreeStore.completed = new Set();
});

describe('ExportImport', () => {
	it('renders the export and import buttons', async () => {
		render(ExportImport);
		await expect.element(page.getByRole('button', { name: /Export progress/ })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: /Import progress/ })).toBeInTheDocument();
	});

	it('shows no confirmation overlay on initial render', async () => {
		render(ExportImport);
		await expect
			.element(page.getByRole('dialog', { name: /Confirm import/ }))
			.not.toBeInTheDocument();
	});

	it('shows no error notice on initial render', async () => {
		render(ExportImport);
		await expect.element(page.getByRole('alert')).not.toBeInTheDocument();
	});

	it('shows the confirmation overlay after a valid file is selected', async () => {
		render(ExportImport);
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile(validPayload));
		await expect
			.element(page.getByRole('dialog', { name: /Confirm import/ }))
			.toBeInTheDocument();
	});

	it('shows the correct node count in the confirmation overlay', async () => {
		render(ExportImport);
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile(validPayload));
		await expect
			.element(page.getByRole('dialog', { name: /Confirm import/ }))
			.toHaveTextContent('2 nodes will be marked complete');
	});

	it('dismisses the confirmation overlay when Cancel is clicked', async () => {
		render(ExportImport);
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile(validPayload));
		await userEvent.click(page.getByRole('button', { name: /Cancel/ }));
		await expect
			.element(page.getByRole('dialog', { name: /Confirm import/ }))
			.not.toBeInTheDocument();
	});

	it('replaces progress and closes overlay when Replace progress is clicked', async () => {
		render(ExportImport);
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile(validPayload));
		await userEvent.click(page.getByRole('button', { name: /Replace progress/ }));
		await expect
			.element(page.getByRole('dialog', { name: /Confirm import/ }))
			.not.toBeInTheDocument();
		expect(skillTreeStore.completed.has('p_ballad')).toBe(true);
		expect(skillTreeStore.completed.has('p_triolet')).toBe(true);
	});

	it('shows an error notice when an invalid file is selected', async () => {
		render(ExportImport);
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile('not valid json at all'));
		await expect.element(page.getByRole('alert')).toBeInTheDocument();
	});

	it('dismisses the error notice when the dismiss button is clicked', async () => {
		render(ExportImport);
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile('not valid json at all'));
		await userEvent.click(page.getByRole('button', { name: /Dismiss/ }));
		await expect.element(page.getByRole('alert')).not.toBeInTheDocument();
	});

	it('warns about unknown node IDs in the confirmation overlay', async () => {
		render(ExportImport);
		const payload = { ...validPayload, completedNodes: ['p_ballad', 'not_a_real_node'] };
		const fileInput = page.getByTestId('file-input');
		await userEvent.upload(fileInput, makeJsonFile(payload));
		await expect
			.element(page.getByRole('dialog', { name: /Confirm import/ }))
			.toHaveTextContent('1 unrecognised node ID');
	});
});
