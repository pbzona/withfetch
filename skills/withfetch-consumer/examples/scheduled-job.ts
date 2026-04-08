import { createFetch, headerFromEnv, vercelOidc } from "withfetch";

const internalFetch = createFetch(
	headerFromEnv("X-Service-Name", "SERVICE_NAME", { optional: true }),
	vercelOidc(),
);

export const runSyncJob = async () => {
	const baseUrl = process.env.INTERNAL_API_BASE_URL;
	if (!baseUrl) {
		throw new Error("INTERNAL_API_BASE_URL is not configured");
	}

	const response = await internalFetch(`${baseUrl}/jobs/sync`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ source: "cron" }),
	});

	if (!response.ok) {
		throw new Error(`Sync job failed with status ${response.status}`);
	}
};
