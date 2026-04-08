import { randomUUID } from "node:crypto";
import express from "express";
import { basicFromEnv, createFetch, userAgent } from "withfetch";

const billingFetch = createFetch(
	userAgent("billing-proxy/1.0"),
	basicFromEnv("BILLING_API_USER", "BILLING_API_PASSWORD"),
);

const app = express();

app.get("/invoices/:id", async (req, res) => {
	const baseUrl = process.env.BILLING_API_BASE_URL;
	if (!baseUrl) {
		res.status(500).json({ error: "BILLING_API_BASE_URL is not configured" });
		return;
	}

	const response = await billingFetch(`${baseUrl}/invoices/${encodeURIComponent(req.params.id)}`, {
		headers: {
			"X-Request-Id": req.get("x-request-id") ?? randomUUID(),
		},
	});

	if (!response.ok) {
		res.status(502).json({ error: "Billing upstream request failed" });
		return;
	}

	res.json(await response.json());
});

app.listen(3000, () => {
	console.log("Billing proxy listening on :3000");
});
