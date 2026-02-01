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
		peoplePage?: string;
	}>;
}

export default async function OurPeoplePage({
	searchParams,
}: OurPeoplePageProps) {
	const params = await searchParams;
	const storiesPage = Number(params.storiesPage) || 1;
	const peoplePage = Number(params.peoplePage) || 1;
	const storiesLimit = 4;

	// Fetch Team, Stories, Events, and People Stories in parallel
	const [stories, peopleStories] = await Promise.all([
		// getTeamMembers("leadership"), // Fetch leadership
		// getTeamMembers("team"), // Fetch team members
		getItems("story", storiesLimit, storiesPage),

		getItems("people_story", storiesLimit, peoplePage),
	]);

	const hasMoreStories = stories.length === storiesLimit;
	const hasMorePeopleStories = peopleStories.length === storiesLimit;

	return (
		<OurPeopleClientPage
			// leadership={leadership}
			// team={team}
			stories={stories}
			peopleStories={peopleStories}
			currentStoriesPage={storiesPage}
			hasMoreStories={hasMoreStories}
			currentPeoplePage={peoplePage}
			hasMorePeopleStories={hasMorePeopleStories}
		/>
	);
}
