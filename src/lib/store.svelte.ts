import { computeNodeStates } from './state';

class SkillTreeStore {
	completed = $state<Set<string>>(new Set());
	nodeStates = $derived(computeNodeStates(this.completed));
	loadError = $state<string | null>(null);

	async initialize(): Promise<void> {
		try {
			const res = await fetch('/api/progress');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = (await res.json()) as { completed: string[] };
			this.completed = new Set(data.completed);
		} catch {
			this.loadError = 'Could not load progress. Check your connection and reload.';
		}
	}

	private async updateCompleted(mutate: (s: Set<string>) => void): Promise<void> {
		const previous = this.completed;
		const next = new Set(this.completed);
		mutate(next);
		this.completed = next;
		try {
			const res = await fetch('/api/progress', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: Array.from(next) })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch (e) {
			this.completed = previous;
			throw e;
		}
	}

	async completeNode(nodeId: string): Promise<void> {
		await this.updateCompleted((s) => s.add(nodeId));
	}

	async uncompleteNode(nodeId: string): Promise<void> {
		await this.updateCompleted((s) => s.delete(nodeId));
	}

	async replaceProgress(incoming: Set<string>): Promise<void> {
		const previous = this.completed;
		this.completed = new Set(incoming);
		try {
			const res = await fetch('/api/progress', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: Array.from(incoming) })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch (e) {
			this.completed = previous;
			throw e;
		}
	}
}

export const skillTreeStore = new SkillTreeStore();
