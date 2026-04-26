import type { Branch, SkillEdge, SkillNode } from './types';

function createNode(
	id: string,
	label: string,
	branch: Branch,
	subBranch: string,
	terminal: boolean,
	unlockRequirement: string,
	prerequisites: string[],
	x: number,
	y: number
): SkillNode {
	return {
		id,
		type: 'skill',
		position: { x, y },
		data: { label, branch, subBranch, terminal, unlockRequirement, prerequisites }
	};
}

function createEdge(source: string, target: string): SkillEdge {
	return { id: `${source}-${target}`, source, target };
}

export const nodes: SkillNode[] = [
	// -------------------------------------------------------------------------
	// POETRY — root
	// -------------------------------------------------------------------------
	createNode('p_ballad', 'Write a Ballad', 'poetry', 'Root', false, 'Complete one ballad', [], 0, 0),

	// Fixed Forms — row 1 goes right, row 2 snakes back left
	createNode('p_triolet', 'Triolet', 'poetry', 'Fixed Forms', false, 'Write one triolet', ['p_ballad'], 220, 0),
	createNode('p_rondel', 'Rondel', 'poetry', 'Fixed Forms', false, 'Write one rondel', ['p_triolet'], 440, 0),
	createNode('p_shakes', 'Shakespearean Sonnet', 'poetry', 'Fixed Forms', false, 'Write one', ['p_rondel'], 660, 0),
	createNode('p_petrar', 'Petrarchan Sonnet', 'poetry', 'Fixed Forms', false, 'Write one', ['p_shakes'], 880, 0),
	createNode('p_terza', 'Terza Rima', 'poetry', 'Fixed Forms', false, 'Write one', ['p_petrar'], 1100, 0),
	createNode('p_ode', 'Ode', 'poetry', 'Fixed Forms', false, 'Write one ode', ['p_terza'], 1320, 0),
	createNode('p_sapphic', 'Sapphic Stanza', 'poetry', 'Fixed Forms', false, 'Write one', ['p_ode'], 1540, 0),
	createNode('p_pantoum', 'Pantoum', 'poetry', 'Fixed Forms', false, 'Write one', ['p_sapphic'], 1540, 170),
	createNode('p_glosa', 'Glosa', 'poetry', 'Fixed Forms', false, 'Write one glosa', ['p_pantoum'], 1320, 170),
	createNode('p_ghazal', 'Ghazal', 'poetry', 'Fixed Forms', false, 'Write one ghazal', ['p_glosa'], 1100, 170),
	createNode('p_vil', 'Villanelle', 'poetry', 'Fixed Forms', false, 'Write one', ['p_ghazal'], 880, 170),
	createNode('p_trit', 'Tritina', 'poetry', 'Fixed Forms', false, 'Write one', ['p_vil'], 660, 170),
	createNode('p_ses', 'Sestina', 'poetry', 'Fixed Forms', false, 'Write one', ['p_trit'], 440, 170),
	createNode('p_crown', 'Crown of Sonnets', 'poetry', 'Fixed Forms', true, 'Requires all prior forms', ['p_ses'], 220, 170),

	// Performance Poetry — chain goes down
	createNode('p_spoken', 'Write a Spoken Word Poem', 'poetry', 'Performance Poetry', false, 'Complete one', ['p_ballad'], 0, 290),
	createNode('p_slam_w', 'Write a Slam Poem', 'poetry', 'Performance Poetry', false, 'Complete one', ['p_spoken'], 0, 460),
	createNode('p_record', 'Record Yourself', 'poetry', 'Performance Poetry', false, 'Private recording only', ['p_slam_w'], 0, 630),
	createNode('p_post_perf', 'Post a Performance', 'poetry', 'Performance Poetry', false, 'Share online', ['p_record'], 0, 800),
	createNode('p_opmic', 'Open Mic Night', 'poetry', 'Performance Poetry', false, 'Perform live', ['p_post_perf'], 0, 970),
	createNode('p_slam_comp', 'Slam Competition', 'poetry', 'Performance Poetry', true, 'Enter and perform', ['p_opmic'], 0, 1140),

	// Traditions & Modes — fan left and down from root
	createNode('p_free', 'Free Verse', 'poetry', 'Traditions & Modes', false, 'Write one poem', ['p_ballad'], -220, 290),
	createNode('p_confess', 'Confessional Poetry', 'poetry', 'Traditions & Modes', false, 'Write one poem', ['p_free'], -450, 170),
	createNode('p_romantic', 'Romantic Poetry', 'poetry', 'Traditions & Modes', false, 'Write one poem', ['p_free'], -450, 340),
	createNode('p_victorian', 'Victorian-Inspired', 'poetry', 'Traditions & Modes', false, 'Write one poem', ['p_free'], -450, 510),
	createNode('p_love', 'Love Poetry', 'poetry', 'Traditions & Modes', false, 'Write one poem', ['p_free'], -450, 680),
	createNode('p_share_conf', 'Share a Confessional Poem', 'poetry', 'Traditions & Modes', true, 'Give it to another person', ['p_confess'], -680, 170),
	createNode('p_give_love', 'Give Someone a Love Poem', 'poetry', 'Traditions & Modes', true, 'Give it to them', ['p_love'], -680, 680),

	// -------------------------------------------------------------------------
	// ORIGINAL FICTION — root
	// -------------------------------------------------------------------------
	createNode('o_root', 'Complete a Story (5k words)', 'original-fiction', 'Root', false, 'Finish one complete story', [], 2400, 400),

	// Word Count
	createNode('o_sub2k', 'Story Under 2k', 'original-fiction', 'Word Count', false, 'Complete one story under 2,000 words', ['o_root'], 2200, 250),
	createNode('o_sub10k', 'Story Under 10k', 'original-fiction', 'Word Count', false, 'Complete one story under 10,000 words', ['o_root'], 2600, 250),
	createNode('o_50k_w', 'Write 50k Words', 'original-fiction', 'Word Count', false, 'Write 50,000 words in the same story', ['o_sub10k'], 2600, 100),
	createNode('o_50k_f', 'Finish a 50k+ Story', 'original-fiction', 'Word Count', true, 'Complete the full draft', ['o_50k_w'], 2600, -50),

	// Revision — chain goes right
	createNode('o_reread', 'Re-read a Full First Draft', 'original-fiction', 'Revision', false, 'Read without editing', ['o_root'], 2620, 400),
	createNode('o_revplan', 'Write a Revision Plan', 'original-fiction', 'Revision', false, "Identify what's wrong before changing anything", ['o_reread'], 2840, 400),
	createNode('o_cut', 'Cut 10% of Word Count', 'original-fiction', 'Revision', false, 'Kill your darlings', ['o_revplan'], 3060, 400),
	createNode('o_rewrite', 'Rewrite a Scene From Scratch', 'original-fiction', 'Revision', false, 'Fully rewrite, keeping only the bones', ['o_cut'], 3280, 400),
	createNode('o_consist', 'Revise for Consistency', 'original-fiction', 'Revision', false, 'Continuity, character voice, timeline', ['o_rewrite'], 3500, 400),
	createNode('o_beta', 'Give to a Beta Reader', 'original-fiction', 'Revision', false, 'Give your work to someone and incorporate feedback', ['o_consist'], 3720, 400),
	createNode('o_line', 'Line Edit', 'original-fiction', 'Revision', false, 'Sentence-level pass — rhythm, word choice, filler', ['o_beta'], 3940, 400),
	createNode('o_copy', 'Copy Edit', 'original-fiction', 'Revision', false, 'Grammar, punctuation, technical surface', ['o_line'], 4160, 400),
	createNode('o_threedraft', 'Revise Through Three Full Drafts', 'original-fiction', 'Revision', true, 'Complete three full revision passes', ['o_copy'], 4380, 400),

	// Genre — fan below root
	createNode('o_romance', 'Contemporary Romance', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 1700, 600),
	createNode('o_fantasy', 'Fantasy', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 1900, 600),
	createNode('o_mystery', 'Mystery', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 2100, 600),
	createNode('o_thriller', 'Thriller', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 2300, 600),
	createNode('o_scifi', 'Sci-Fi', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 2500, 600),
	createNode('o_horror', 'Horror', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 2700, 600),
	createNode('o_hist', 'Historical Fiction', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 2900, 600),
	createNode('o_magic', 'Magical Realism', 'original-fiction', 'Genre', false, 'Write one complete story in this genre', ['o_root'], 3100, 600),

	// Structure — chain goes down
	createNode('o_multipov', 'Multiple POV', 'original-fiction', 'Structure', false, 'Write one story', ['o_root'], 2400, 780),
	createNode('o_omni', 'Omniscient Narrator', 'original-fiction', 'Structure', false, 'Write one story', ['o_multipov'], 2400, 950),
	createNode('o_unreliable', 'Unreliable Narrator', 'original-fiction', 'Structure', false, 'Write one story', ['o_omni'], 2400, 1120),
	createNode('o_epist', 'Epistolary', 'original-fiction', 'Structure', false, 'Told through letters, diaries, or logs', ['o_unreliable'], 2400, 1290),
	createNode('o_meta', 'Meta Narrator', 'original-fiction', 'Structure', true, 'The narrator knows this is a story', ['o_epist'], 2400, 1460),

	// Research — fan left-below root
	createNode('o_nonfic', 'Read Non-Fiction for a Story', 'original-fiction', 'Research', false, 'Read a non-fiction book as research', ['o_root'], 1900, 800),
	createNode('o_visit', 'Visit a Location for Research', 'original-fiction', 'Research', false, 'Go to a place specifically for a story', ['o_root'], 1900, 970),
	createNode('o_interview', 'Interview a Real Person', 'original-fiction', 'Research', false, 'Contact and interview a subject matter expert', ['o_root'], 1900, 1140),
	createNode('o_archive', 'Use an Archive or Primary Source', 'original-fiction', 'Research', false, 'Find and use a primary historical source', ['o_root'], 1900, 1310),
	createNode('o_factcheck', 'Fact-Check a Draft', 'original-fiction', 'Research', false, 'Check a completed draft against your research', ['o_root'], 1900, 1480),

	// -------------------------------------------------------------------------
	// FANFICTION — root
	// -------------------------------------------------------------------------
	createNode('f_root', 'Finish a One-Shot', 'fanfiction', 'Root', false, 'Complete one fanfic', [], 2800, 1850),

	// AO3 Ratings — chain goes right-up
	createNode('f_g', 'General', 'fanfiction', 'AO3 Ratings', false, 'Write a G-rated fic', ['f_root'], 3020, 1700),
	createNode('f_t', 'Teen', 'fanfiction', 'AO3 Ratings', false, 'Write a T-rated fic', ['f_g'], 3240, 1700),
	createNode('f_m', 'Mature', 'fanfiction', 'AO3 Ratings', false, 'Write an M-rated fic', ['f_t'], 3460, 1700),
	createNode('f_e', 'Explicit', 'fanfiction', 'AO3 Ratings', true, 'Write an E-rated fic', ['f_m'], 3680, 1700),

	// AO3 Warnings — chain goes right at root y
	createNode('f_nwa', 'No Archive Warnings Apply', 'fanfiction', 'AO3 Warnings', false, 'Write one fic', ['f_root'], 3020, 1850),
	createNode('f_violence', 'Violence', 'fanfiction', 'AO3 Warnings', false, 'Write one fic', ['f_nwa'], 3240, 1850),
	createNode('f_mcd', 'Major Character Death', 'fanfiction', 'AO3 Warnings', false, 'Write one fic', ['f_violence'], 3460, 1850),
	createNode('f_noncon', 'Non-Con', 'fanfiction', 'AO3 Warnings', false, 'Write one fic', ['f_mcd'], 3680, 1850),
	createNode('f_underage', 'Underage', 'fanfiction', 'AO3 Warnings', false, 'Write one fic', ['f_noncon'], 3900, 1850),
	createNode('f_cnw', 'Choose Not to Warn', 'fanfiction', 'AO3 Warnings', true, 'Write one fic', ['f_underage'], 4120, 1850),

	// Ship Categories — chain goes right-down
	createNode('f_ff', 'F/F', 'fanfiction', 'Ship Categories', false, 'Write one fic', ['f_root'], 3020, 2000),
	createNode('f_gen', 'Gen', 'fanfiction', 'Ship Categories', false, 'Write one fic', ['f_ff'], 3240, 2000),
	createNode('f_fm', 'F/M', 'fanfiction', 'Ship Categories', false, 'Write one fic', ['f_gen'], 3460, 2000),
	createNode('f_mm', 'M/M', 'fanfiction', 'Ship Categories', false, 'Write one fic', ['f_fm'], 3680, 2000),
	createNode('f_multi', 'Multi', 'fanfiction', 'Ship Categories', false, 'Write one fic', ['f_mm'], 3900, 2000),
	createNode('f_other', 'Other', 'fanfiction', 'Ship Categories', true, 'Write one fic', ['f_multi'], 4120, 2000),

	// Long-form — chain goes down, cluster at second level
	createNode('f_multi_ch', 'Finish a Multi-Chapter Fic', 'fanfiction', 'Long-form', false, 'Complete it', ['f_root'], 2800, 2000),
	createNode('f_5times', 'Five Times / One Time', 'fanfiction', 'Long-form', false, 'Write one', ['f_multi_ch'], 2580, 2150),
	createNode('f_100drab', '100 Drabble Collection', 'fanfiction', 'Long-form', false, 'Complete all 100', ['f_multi_ch'], 2800, 2150),
	createNode('f_daily', 'Daily Ship/Fandom Challenge', 'fanfiction', 'Long-form', false, 'Write every day of the challenge', ['f_multi_ch'], 3020, 2150),
	createNode('f_mid', 'Mid-Length Fic (5+ chapters)', 'fanfiction', 'Long-form', false, 'Complete it', ['f_multi_ch'], 2800, 2300),
	createNode('f_long', 'Long-Form Fic (20+ chapters)', 'fanfiction', 'Long-form', true, 'Complete it', ['f_mid'], 2800, 2450),

	// Fandom Challenges — fan left of root
	createNode('f_exchange', 'Fic Exchange', 'fanfiction', 'Fandom Challenges', false, 'Participate in one', ['f_root'], 2580, 1700),
	createNode('f_newfandom', 'Write for a New Fandom', 'fanfiction', 'Fandom Challenges', false, "Complete one fic in a fandom you've never written for", ['f_root'], 2580, 1850),
	createNode('f_crossover', 'Write a Crossover', 'fanfiction', 'Fandom Challenges', false, 'Write a fic crossing two fandoms', ['f_root'], 2580, 2000),
	createNode('f_kinktober', 'Complete Kinktober', 'fanfiction', 'Fandom Challenges', true, 'Write every day of Kinktober', ['f_root'], 2580, 2150),

	// -------------------------------------------------------------------------
	// PROCESS — root
	// -------------------------------------------------------------------------
	createNode('pr_7days', 'Write 7 Days in a Row', 'process', 'Root', false, 'Write on 7 consecutive days', [], 0, 1850),

	// Habit chain
	createNode('pr_schedule', 'Schedule Writing Time', 'process', 'Habit', false, 'Block writing time in your calendar', ['pr_7days'], 220, 1850),
	createNode('pr_stick', 'Stick to the Schedule', 'process', 'Habit', true, 'Keep to the schedule for one full week', ['pr_schedule'], 440, 1850),

	// Standalone
	createNode('pr_backup', 'Implement a Backup Strategy', 'process', 'Standalone', false, 'Build a robust, documented backup system for your writing', ['pr_7days'], 0, 2020),
	createNode('pr_unusual', 'Write Somewhere Unusual', 'process', 'Standalone', false, "Write in a location that isn't your normal spot", ['pr_7days'], 0, 2190),

	// -------------------------------------------------------------------------
	// PROFESSIONAL PRACTICE — root
	// -------------------------------------------------------------------------
	createNode('pp_root', 'Enter a Poetry Competition', 'professional-practice', 'Root', false, 'Submit an entry', [], 1150, 1850),

	// Poetry Publication Chain — goes up-right
	createNode('pp_place_p', 'Place in a Poetry Competition', 'professional-practice', 'Poetry Publication', false, 'Win or be shortlisted', ['pp_root'], 1370, 1700),
	createNode('pp_sub_zine', 'Submit to a Zine or Anthology', 'professional-practice', 'Poetry Publication', false, 'Send a submission', ['pp_place_p'], 1590, 1700),
	createNode('pp_pub_zine', 'Publish in a Zine or Anthology', 'professional-practice', 'Poetry Publication', false, 'Get accepted', ['pp_sub_zine'], 1810, 1700),
	createNode('pp_sub_coll', 'Submit a Poetry Collection', 'professional-practice', 'Poetry Publication', false, 'Send the manuscript', ['pp_pub_zine'], 2030, 1700),
	createNode('pp_pub_coll', 'Publish a Poetry Collection', 'professional-practice', 'Poetry Publication', true, 'Get it out into the world', ['pp_sub_coll'], 2250, 1700),

	// Fiction Publication Chain — goes right
	createNode('pp_enter_fic', 'Enter a Writing Competition', 'professional-practice', 'Fiction Publication', false, 'Submit an entry', ['pp_root'], 1370, 1850),
	createNode('pp_place_fic', 'Place in a Writing Competition', 'professional-practice', 'Fiction Publication', false, 'Win or be shortlisted', ['pp_enter_fic'], 1590, 1850),
	createNode('pp_sub_short', 'Submit a Short Story', 'professional-practice', 'Fiction Publication', false, 'Send a submission', ['pp_place_fic'], 1810, 1850),
	createNode('pp_pub_short', 'Publish a Short Story', 'professional-practice', 'Fiction Publication', false, 'Get accepted', ['pp_sub_short'], 1810, 2020),
	createNode('pp_sub_ms', 'Submit a Manuscript', 'professional-practice', 'Fiction Publication', false, 'Send the full novel', ['pp_sub_short'], 2030, 1850),
	createNode('pp_pub_novel', 'Publish a Novel', 'professional-practice', 'Fiction Publication', true, 'Get it out into the world', ['pp_sub_ms'], 2250, 1850),

	// Platform Chain — goes down-right
	createNode('pp_tip', 'Earn First Tip on Ko-fi', 'professional-practice', 'Platform', false, 'Someone pays you', ['pp_root'], 1370, 2020),
	createNode('pp_sub_kofi', 'First Paid Subscriber', 'professional-practice', 'Platform', false, 'Someone commits to a monthly subscription', ['pp_tip'], 1590, 2020),
	createNode('pp_recd', 'Be Recommended', 'professional-practice', 'Platform', false, 'Someone shares your work unprompted', ['pp_sub_kofi'], 1810, 2190),
	createNode('pp_approach', 'Be Approached About Your Work', 'professional-practice', 'Platform', true, 'Someone finds you and reaches out', ['pp_recd'], 2030, 2190)
];

export const edges: SkillEdge[] = [
	// Poetry — Fixed Forms
	createEdge('p_ballad', 'p_triolet'),
	createEdge('p_triolet', 'p_rondel'),
	createEdge('p_rondel', 'p_shakes'),
	createEdge('p_shakes', 'p_petrar'),
	createEdge('p_petrar', 'p_terza'),
	createEdge('p_terza', 'p_ode'),
	createEdge('p_ode', 'p_sapphic'),
	createEdge('p_sapphic', 'p_pantoum'),
	createEdge('p_pantoum', 'p_glosa'),
	createEdge('p_glosa', 'p_ghazal'),
	createEdge('p_ghazal', 'p_vil'),
	createEdge('p_vil', 'p_trit'),
	createEdge('p_trit', 'p_ses'),
	createEdge('p_ses', 'p_crown'),

	// Poetry — Performance Poetry
	createEdge('p_ballad', 'p_spoken'),
	createEdge('p_spoken', 'p_slam_w'),
	createEdge('p_slam_w', 'p_record'),
	createEdge('p_record', 'p_post_perf'),
	createEdge('p_post_perf', 'p_opmic'),
	createEdge('p_opmic', 'p_slam_comp'),

	// Poetry — Traditions & Modes
	createEdge('p_ballad', 'p_free'),
	createEdge('p_free', 'p_confess'),
	createEdge('p_free', 'p_romantic'),
	createEdge('p_free', 'p_victorian'),
	createEdge('p_free', 'p_love'),
	createEdge('p_confess', 'p_share_conf'),
	createEdge('p_love', 'p_give_love'),

	// Original Fiction — Word Count
	createEdge('o_root', 'o_sub2k'),
	createEdge('o_root', 'o_sub10k'),
	createEdge('o_sub10k', 'o_50k_w'),
	createEdge('o_50k_w', 'o_50k_f'),

	// Original Fiction — Revision
	createEdge('o_root', 'o_reread'),
	createEdge('o_reread', 'o_revplan'),
	createEdge('o_revplan', 'o_cut'),
	createEdge('o_cut', 'o_rewrite'),
	createEdge('o_rewrite', 'o_consist'),
	createEdge('o_consist', 'o_beta'),
	createEdge('o_beta', 'o_line'),
	createEdge('o_line', 'o_copy'),
	createEdge('o_copy', 'o_threedraft'),

	// Original Fiction — Genre
	createEdge('o_root', 'o_romance'),
	createEdge('o_root', 'o_fantasy'),
	createEdge('o_root', 'o_mystery'),
	createEdge('o_root', 'o_thriller'),
	createEdge('o_root', 'o_scifi'),
	createEdge('o_root', 'o_horror'),
	createEdge('o_root', 'o_hist'),
	createEdge('o_root', 'o_magic'),

	// Original Fiction — Structure
	createEdge('o_root', 'o_multipov'),
	createEdge('o_multipov', 'o_omni'),
	createEdge('o_omni', 'o_unreliable'),
	createEdge('o_unreliable', 'o_epist'),
	createEdge('o_epist', 'o_meta'),

	// Original Fiction — Research
	createEdge('o_root', 'o_nonfic'),
	createEdge('o_root', 'o_visit'),
	createEdge('o_root', 'o_interview'),
	createEdge('o_root', 'o_archive'),
	createEdge('o_root', 'o_factcheck'),

	// Fanfiction — AO3 Ratings
	createEdge('f_root', 'f_g'),
	createEdge('f_g', 'f_t'),
	createEdge('f_t', 'f_m'),
	createEdge('f_m', 'f_e'),

	// Fanfiction — AO3 Warnings
	createEdge('f_root', 'f_nwa'),
	createEdge('f_nwa', 'f_violence'),
	createEdge('f_violence', 'f_mcd'),
	createEdge('f_mcd', 'f_noncon'),
	createEdge('f_noncon', 'f_underage'),
	createEdge('f_underage', 'f_cnw'),

	// Fanfiction — Ship Categories
	createEdge('f_root', 'f_ff'),
	createEdge('f_ff', 'f_gen'),
	createEdge('f_gen', 'f_fm'),
	createEdge('f_fm', 'f_mm'),
	createEdge('f_mm', 'f_multi'),
	createEdge('f_multi', 'f_other'),

	// Fanfiction — Long-form
	createEdge('f_root', 'f_multi_ch'),
	createEdge('f_multi_ch', 'f_5times'),
	createEdge('f_multi_ch', 'f_100drab'),
	createEdge('f_multi_ch', 'f_daily'),
	createEdge('f_multi_ch', 'f_mid'),
	createEdge('f_mid', 'f_long'),

	// Fanfiction — Fandom Challenges
	createEdge('f_root', 'f_exchange'),
	createEdge('f_root', 'f_newfandom'),
	createEdge('f_root', 'f_crossover'),
	createEdge('f_root', 'f_kinktober'),

	// Process
	createEdge('pr_7days', 'pr_schedule'),
	createEdge('pr_schedule', 'pr_stick'),
	createEdge('pr_7days', 'pr_backup'),
	createEdge('pr_7days', 'pr_unusual'),

	// Professional Practice — Poetry Publication
	createEdge('pp_root', 'pp_place_p'),
	createEdge('pp_place_p', 'pp_sub_zine'),
	createEdge('pp_sub_zine', 'pp_pub_zine'),
	createEdge('pp_pub_zine', 'pp_sub_coll'),
	createEdge('pp_sub_coll', 'pp_pub_coll'),

	// Professional Practice — Fiction Publication
	createEdge('pp_root', 'pp_enter_fic'),
	createEdge('pp_enter_fic', 'pp_place_fic'),
	createEdge('pp_place_fic', 'pp_sub_short'),
	createEdge('pp_sub_short', 'pp_pub_short'),
	createEdge('pp_sub_short', 'pp_sub_ms'),
	createEdge('pp_sub_ms', 'pp_pub_novel'),

	// Professional Practice — Platform
	createEdge('pp_root', 'pp_tip'),
	createEdge('pp_tip', 'pp_sub_kofi'),
	createEdge('pp_sub_kofi', 'pp_recd'),
	createEdge('pp_recd', 'pp_approach')
];
