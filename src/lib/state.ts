import { nodes } from './data';
import type { NodeState } from './types';

const nodeMap = new Map(nodes.map((node) => [node.id, node]));

export function computeNodeStates(completed: Set<string>): Map<string, NodeState> {
	const states = new Map<string, NodeState>();

	for (const node of nodes) {
		if (completed.has(node.id)) {
			states.set(node.id, 'completed');
		} else {
			const allPrerequisitesMet = node.data.prerequisites.every((id) => completed.has(id));
			states.set(node.id, allPrerequisitesMet ? 'available' : 'locked');
		}
	}

	return states;
}

export function getAffectedDescendants(nodeId: string, completed: Set<string>): string[] {
	const affected: string[] = [];

	for (const node of nodes) {
		if (node.data.prerequisites.includes(nodeId) && completed.has(node.id)) {
			affected.push(node.id);
			affected.push(...getAffectedDescendants(node.id, completed));
		}
	}

	return [...new Set(affected)];
}

export { nodeMap };
