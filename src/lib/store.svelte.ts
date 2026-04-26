import { computeNodeStates } from './state';
import { loadProgress, saveProgress } from './db';

class SkillTreeStore {
	completed = $state<Set<string>>(new Set());
	nodeStates = $derived(computeNodeStates(this.completed));

	async initialize(): Promise<void> {
		this.completed = await loadProgress();
	}

	private async updateCompleted(mutate: (s: Set<string>) => void): Promise<void> {
		const next = new Set(this.completed);
		mutate(next);
		this.completed = next;
		await saveProgress(next);
	}

	async completeNode(nodeId: string): Promise<void> {
		await this.updateCompleted((s) => s.add(nodeId));
	}

	async uncompleteNode(nodeId: string): Promise<void> {
		await this.updateCompleted((s) => s.delete(nodeId));
	}

	async replaceProgress(incoming: Set<string>): Promise<void> {
		this.completed = new Set(incoming);
		await saveProgress(this.completed);
	}
}

export const skillTreeStore = new SkillTreeStore();
