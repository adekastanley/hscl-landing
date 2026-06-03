import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["better-sqlite3"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "15mb",
		},
	},
	async rewrites() {
		return [
			{
				source: "/partners/:path*",
				destination: "/api/files/partners/:path*",
			},
			{
				source: "/resources/:path*",
				destination: "/api/files/resources/:path*",
			},
			{
				source: "/siteimages/:path*",
				destination: "/api/files/siteimages/:path*",
			},
			{
				source: "/documents/:path*",
				destination: "/api/files/documents/:path*",
			},
		];
	},
};

export default nextConfig;
