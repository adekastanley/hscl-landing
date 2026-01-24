"use client";
import { useState, useEffect, useCallback } from "react";
// import { client } from "@/lib/contentful";
import { client } from "@/lib/contentful";
// import { EntryCollection, EntrySkeletonType } from "contentful";
import { EntryCollection, EntrySkeletonType } from "contentful";

interface UseContentfulOptions {
	contentType?: string;
	query?: any;
}

export function useContentful<T extends EntrySkeletonType = any>(
	options: UseContentfulOptions = {},
) {
	const [data, setData] = useState<EntryCollection<T> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const params: any = { ...options.query };
			if (options.contentType) {
				params.content_type = options.contentType;
			}

			const response = await client.getEntries<T>(params);
			setData(response);
			setError(null);
		} catch (err: any) {
			console.error("UseContentful Error:", err);
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch from Contentful"),
			);
		} finally {
			setLoading(false);
		}
	}, [options.contentType, JSON.stringify(options.query)]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
