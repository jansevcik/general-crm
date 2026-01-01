const entries = [
    {
        email: "customer1@shop.com",
        source: "google_ads",
        value: 120.50,
        currency: "USD",
        items: [{ id: 1, name: "Widget" }, { id: 2, name: "Gadget" }]
    },
    {
        mail: "lead@business.com", // testing alias for email
        campaign: "q4_outreach",
        status: "interested",
        company: "Big Corp"
    },
    {
        user_id: "u_777", // No email provided
        event: "app_error",
        severity: "critical",
        details: { stack: "NullReferenceException" }
    },
    {
        email: "vip@subscriber.com",
        revenue: 99.99, // testing alias for value
        tags: ["platinum", "2024"],
        metadata: { renewed: true }
    },
    {
        email: "legacy@system.old",
        value: "1000", // String number
        source: "direct",
        custom_field: "legacy_import"
    }
];

async function ingest() {
    console.log("Starting ingestion...");
    for (const entry of entries) {
        try {
            const res = await fetch('http://localhost:3000/api/ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dev-key-123'
                },
                body: JSON.stringify(entry)
            });

            const text = await res.text();
            console.log(`Sent: ${entry.email || entry.user_id || 'unknown'} - Status: ${res.status}`);
            // console.log('Response:', text);
        } catch (e) {
            console.error('Failed to send:', e);
        }
    }
    console.log("Ingestion complete.");
}

ingest();
