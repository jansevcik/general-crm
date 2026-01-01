import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function safeFloat(val: any): number | null {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
    }
    return null;
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const apiKey = await prisma.apiKey.findUnique({
            where: { key: token },
        });

        if (!apiKey || !apiKey.isActive) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();

        // Store the event (Postgres deals with JSON automatically)
        const payload = body.payload || body

        console.log("Ingesting Hybrid Event:", JSON.stringify(payload));

        // --- Data "Translation" Layer ---
        // Extract standard columns from payload if they exist
        // This is where "Hybrid" magic happens
        const standardFields = {
            // Identity
            email: payload.email || payload.mail || payload.e_mail || null,
            phone: payload.phone || payload.mobile || payload.tel || null,
            ipAddress: payload.ip || payload.ip_address || payload.ipAddress || "127.0.0.1", // In prod, get from request headers

            // Marketing / Affiliate
            source: payload.source || payload.utm_source || payload.src || null,
            medium: payload.medium || payload.utm_medium || null,
            campaign: payload.campaign || payload.utm_campaign || null,
            clickId: payload.clickId || payload.click_id || payload.cid || null,
            affiliateId: payload.affiliateId || payload.affiliate_id || payload.aid || payload.aff_id || null,

            // Commerce
            value: safeFloat(payload.value) || safeFloat(payload.revenue) || safeFloat(payload.price),
            currency: payload.currency || payload.curr || "USD",

            // Technical
            userAgent: payload.userAgent || payload.user_agent || payload.ua || null
        }

        const event = await prisma.event.create({
            data: {
                payload: payload, // Keep full original data (Tier 2)
                apiKeyId: apiKey.id,
                ...standardFields // Promote to columns (Tier 1)
            }
        })

        return NextResponse.json({ success: true, id: event.id });
    } catch (error) {
        console.error('Ingest Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
