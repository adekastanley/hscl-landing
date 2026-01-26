import db from "@/lib/db";
import { version } from "process";
import { FixSchemaButton } from "@/components/debug/FixSchemaButton";

export default async function DebugPage() {
	let dbStatus = "Unknown";
	let dbError = null;
	let tables: string[] = [];
	let contentItemsColumns: any[] = [];
	let tableSql: string | null = null;

	try {
		// Test connection
		const result = await db.execute("SELECT 1 as val");
		dbStatus = result.rows[0].val === 1 ? "Connected" : "Unexpected Result";

		// List tables to verify schema
		const tablesRes = await db.execute(
			"SELECT name FROM sqlite_master WHERE type='table'",
		);
		tables = tablesRes.rows.map((r) => r.name as string);

		const columnsRes = await db.execute("PRAGMA table_info(content_items)");
		contentItemsColumns = columnsRes.rows;

		const sqlRes = await db.execute(
			"SELECT sql FROM sqlite_master WHERE name='content_items'",
		);
		tableSql = sqlRes.rows[0]?.sql as string;
	} catch (e: any) {
		dbStatus = "Error";
		dbError = e.message;
	}

	const envCheck = {
		TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL
			? "Set (Starts with " +
				process.env.TURSO_DATABASE_URL.substring(0, 8) +
				"...)"
			: "MISSING (Using local file fallback?)",
		TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "Set" : "MISSING",
		NODE_ENV: process.env.NODE_ENV,
		NODE_VERSION: version,
	};

	return (
		<div className="p-8 space-y-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold">System Debug</h1>

			<div className="border p-4 rounded bg-muted/20 space-y-2">
				<h2 className="font-semibold">Environment Variables</h2>
				<pre className="text-sm bg-black/10 p-2 rounded overflow-auto">
					{JSON.stringify(envCheck, null, 2)}
				</pre>
				{!process.env.TURSO_DATABASE_URL && (
					<div className="text-destructive font-bold mt-2">
						CRITICAL: TURSO_DATABASE_URL is missing. Vercel cannot write to a
						local file database.
					</div>
				)}
			</div>

			<div className="border p-4 rounded bg-muted/20 space-y-2">
				<h2 className="font-semibold">Database Connection</h2>
				<div className="flex items-center gap-2">
					Status:
					<span
						className={
							dbStatus === "Connected"
								? "text-green-600 font-bold"
								: "text-red-600 font-bold"
						}
					>
						{dbStatus}
					</span>
				</div>
				{dbError && (
					<div className="text-red-500 text-sm bg-red-50 p-2 rounded">
						Error: {dbError}
					</div>
				)}
				<div className="mt-4">
					<h3 className="font-medium">Tables Found:</h3>
					<ul className="list-disc pl-5">
						{tables.map((t) => (
							<li key={String(t)}>{String(t)}</li>
						))}
					</ul>
				</div>
				{contentItemsColumns.length > 0 && (
					<div className="mt-4">
						<h3 className="font-medium">Content Items Columns:</h3>
						<ul className="list-disc pl-5 text-sm">
							{contentItemsColumns.map((c: any) => (
								<li key={c.name}>
									{c.name} ({c.type}){" "}
									{c.dflt_value ? `Default: ${c.dflt_value}` : ""}
								</li>
							))}
						</ul>
					</div>
				)}
				{tableSql && (
					<div className="mt-4">
						<h3 className="font-medium">Table Definition (SQL):</h3>
						<pre className="text-xs bg-black/10 p-2 rounded overflow-auto mt-1 whitespace-pre-wrap">
							{tableSql}
						</pre>
					</div>
				)}
				{tableSql && (
					<div className="mt-4">
						<h3 className="font-medium">Table Definition (SQL):</h3>
						<pre className="text-xs bg-black/10 p-2 rounded overflow-auto mt-1 whitespace-pre-wrap">
							{tableSql}
						</pre>
					</div>
				)}
				<div className="mt-6 border-t pt-4">
					<h3 className="font-semibold mb-2 text-destructive">
						Administrative Actions
					</h3>
					<div className="flex flex-col gap-2">
						<p className="text-sm text-muted-foreground">
							Run this only if you are seeing "CHECK constraint failed" errors
							for events.
						</p>
						<FixSchemaButton />
					</div>
				</div>
			</div>
		</div>
	);
}
