import { getItems } from "@/app/actions/content";
import { getTeamMembers } from "@/app/actions/team";
import OurPeopleClientPage from "@/components/pages/our-people/OurPeopleClientPage";

export const metadata = {
	title: "Our People | HCSL",
	description: "Meet the dedicated team driving impact at HCSL.",
};

interface OurPeoplePageProps {
	searchParams: Promise<{
		storiesPage?: string;
	}>;
}

export default async function OurPeoplePage({
	searchParams,
}: OurPeoplePageProps) {
	const params = await searchParams;
	const storiesPage = Number(params.storiesPage) || 1;
	const storiesLimit = 4;

	// Fetch Team, Stories, and Events in parallel
	const [stories, events] = await Promise.all([
		// getTeamMembers("leadership"), // Fetch leadership
		// getTeamMembers("team"), // Fetch team members
		getItems("story", storiesLimit, storiesPage),
		getItems("event", 4),
	]);

	const hasMoreStories = stories.length === storiesLimit;

	return (
		<OurPeopleClientPage
			// leadership={leadership}
			// team={team}
			stories={stories}
			events={events}
			currentStoriesPage={storiesPage}
			hasMoreStories={hasMoreStories}
		/>
	);
}
