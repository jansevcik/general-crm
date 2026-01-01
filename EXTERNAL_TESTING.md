# External Testing Guide

Use the following commands to test the CRM Ingestion API.

## Prerequisites
- App running (`npm run dev`)
- Tunnel running (`node scripts/tunnel.js`) - **Capture the URL**

## Base URL
Replace `YOUR_TUNNEL_URL` with the URL provided by the tunnel script (e.g., `https://lovely-pug-22.loca.lt`).

## 1. Create an API Key (Internal)
Since the DB is fresh, you need an API Key.
You can create one by accessing the Dashboard -> API Keys (if you have implemented that UI) or by running a seed/script.
*For now, use the seed script or check the database directly.*

## 2. Ingest Data

### Bash / Mac / Linux
```bash
curl -X POST "YOUR_TUNNEL_URL/api/ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "event": "signup",
    "email": "user@example.com",
    "source": "landing_page",
    "metadata": {
      "plan": "pro"
    }
  }'
```

### PowerShell (Windows)
```powershell
$Headers = @{
    "Authorization" = "Bearer YOUR_API_KEY"
}
$Body = @{
    event = "signup"
    email = "user@example.com"
    source = "landing_page"
    metadata = @{ plan = "pro" }
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "YOUR_TUNNEL_URL/api/ingest" -Method Post -ContentType "application/json" -Headers $Headers -Body $Body
```

## 3. Verify
Check the Dashboard to see the new entry.
