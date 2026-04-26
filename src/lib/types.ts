import type { Node, Edge } from '@xyflow/svelte';

export type Branch =
	| 'poetry'
	| 'original-fiction'
	| 'fanfiction'
	| 'process'
	| 'professional-practice';

export type NodeState = 'locked' | 'available' | 'completed';

export interface SkillNodeData extends Record<string, unknown> {
	label: string;
	branch: Branch;
	subBranch: string;
	terminal: boolean;
	unlockRequirement: string;
	prerequisites: string[];
}

export type SkillNode = Node<SkillNodeData, 'skill'>;
export type SkillEdge = Edge;

export interface BranchMeta {
	id: Branch;
	label: string;
	color: string;
}

export const BRANCHES: BranchMeta[] = [
	{ id: 'poetry', label: 'Poetry', color: '#8B5CF6' },
	{ id: 'original-fiction', label: 'Original Fiction', color: '#F59E0B' },
	{ id: 'fanfiction', label: 'Fanfiction', color: '#EC4899' },
	{ id: 'process', label: 'Process', color: '#10B981' },
	{ id: 'professional-practice', label: 'Professional Practice', color: '#38BDF8' }
];

export const FALLBACK_COLOR = '#6b7280';
export const BRANCH_COLOR_MAP = new Map<Branch, string>(BRANCHES.map((b) => [b.id, b.color]));
