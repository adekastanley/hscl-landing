import { useContentful } from "@/hooks/useContentful";

export default function ContentfulTest() {
	const { data, loading, error } = useContentful();

	return (
		<div className="p-10 bg-white min-h-screen text-black">
			<h1 className="text-3xl font-bold mb-6">Contentful Connection Test</h1>
			{loading && (
				<p className="text-blue-600 animate-pulse">
					Fetching entries from Contentful...
				</p>
			)}
			{error && (
				<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
					<p className="font-bold">Error:</p>
					<p>{error.message}</p>
				</div>
			)}
			{data && (
				<div className="space-y-6">
					<p className="text-green-600 font-semibold">
						Success! Found {data.items.length} entries.
					</p>

					<div className="grid gap-4">
						{data.items.map((item: any) => (
							<div
								key={item.sys.id}
								className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
							>
								<h2 className="text-xl font-bold text-chemonics-navy">
									{item.fields.title || "Untitled Entry"}
								</h2>
								<p className="text-sm text-gray-500 mb-2">
									ID: {item.sys.id} | Type: {item.sys.contentType.sys.id}
								</p>
								<details className="mt-2">
									<summary className="cursor-pointer text-blue-500 hover:underline">
										View Raw JSON
									</summary>
									<pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-60">
										{JSON.stringify(item.fields, null, 2)}
									</pre>
								</details>
							</div>
						))}
					</div>

					<div className="mt-10">
						<h3 className="text-lg font-bold mb-2">Total JSON Data:</h3>
						<pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto max-h-96 text-xs">
							{JSON.stringify(data, null, 2)}
						</pre>
					</div>
				</div>
			)}
		</div>
	);
}
