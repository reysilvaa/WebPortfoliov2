import type { Profile } from './profile';
import type { Experience } from './experience';
import type { Project } from './project';
import type { Skill } from './skill';
import type { Certificate } from './certificate';
import type { Education } from './education';
import type { OpenSource } from './open-source';

export interface PortfolioContent {
	profile: Profile | null;
	experiences: Experience[];
	projects: Project[];
	skills: Skill[];
	certificates: Certificate[];
	education: Education[];
	openSource: OpenSource[];
}
