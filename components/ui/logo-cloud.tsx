import { getPartners } from "@/actions/partners";
import { InfiniteSlider } from "./infinite-slider";
// import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { ProgressiveBlur } from "./progressive-blur";

export const LogoCloud = async () => {
	const partners = await getPartners();

	// Fallback to static if no partners (or we can just show empty)
	// For now, let's use the DB partners if available, otherwise maybe keep static?
	// The user asked to "add and remove", so likely wants full control.
	// If empty, we might hide the section or show a placeholder?
	// Let's assume if 0 partners, we hide or show nothing, BUT for dev/demo purposes I'll stick to DB only as requested to "pull it here".
	// If the user wants to keep defaults until they add some, they can add them.
	// Actually, let's keep the hardcoded ones if DB is empty? No, "I want to be able to add and remove".
	// So DB is source of truth.

	if (!partners || partners.length === 0) {
		return null; // Or return empty section
	}

	return (
		<section className="bg-background pb-16 md:pb-32 overflow-hidden">
			<div className="group relative m-auto max-w-6xl px-6">
				<div className="flex flex-col items-center md:flex-row">
					<div className="inline md:max-w-44 md:border-r md:pr-6">
						<p className="text-end text-sm">Our Partners</p>
					</div>
					<div className="relative py-6 md:w-[calc(100%-11rem)]">
						<InfiniteSlider speedOnHover={20} speed={40} gap={80}>
							{partners.map((partner: any) => (
								<div
									key={partner.id}
									className="flex items-center justify-center"
								>
									<img
										className="mx-auto h-12 w-auto object-contain dark:invert opacity-80 hover:opacity-100 transition-opacity"
										src={partner.logo_url}
										alt={`${partner.name} Logo`}
										height="48"
										width="auto"
									/>
								</div>
							))}
						</InfiniteSlider>

						<div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
						<div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
						<ProgressiveBlur
							className="pointer-events-none absolute left-0 top-0 h-full w-20"
							direction="left"
							blurIntensity={1}
						/>
						<ProgressiveBlur
							className="pointer-events-none absolute right-0 top-0 h-full w-20"
							direction="right"
							blurIntensity={1}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
