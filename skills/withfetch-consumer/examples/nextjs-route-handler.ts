import { NextResponse } from "next/server";
import { accept, bearerFromEnv, createFetch, headerFromEnv } from "withfetch";

const upstreamFetch = createFetch(
	accept("application/json"),
	headerFromEnv("X-Api-Key", "UPSTREAM_API_KEY"),
	bearerFromEnv("UPSTREAM_API_TOKEN", { optional: true }),
);

export async function GET() {
	const baseUrl = process.env.UPSTREAM_BASE_URL;
	if (!baseUrl) {
		return NextResponse.json({ error: "UPSTREAM_BASE_URL is not configured" }, { status: 500 });
	}

	const response = await upstreamFetch(`${baseUrl}/users`);

	if (!response.ok) {
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 502 });
	}

	const users = await response.json();
	return NextResponse.json({ users });
}
