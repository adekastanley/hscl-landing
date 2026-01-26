import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Divide, LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
	title: string;
	value: string | number;
	description: string;
	icon: LucideIcon;
	className?: string;
	trend?: {
		label: string;
		value: string;
		positive?: boolean;
	};
}

export function DashboardStatCard({
	title,
	value,
	description,
	icon: Icon,
	className,
	trend,
}: DashboardStatCardProps) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground mt-1">{description}</p>
				{trend && (
					<div className="mt-4 flex items-center text-xs">
						<span
							className={cn(
								"font-medium",
								trend.positive ? "text-green-600" : "text-red-600",
							)}
						>
							{trend.value}
						</span>
						<span className="text-muted-foreground ml-2">{trend.label}</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
