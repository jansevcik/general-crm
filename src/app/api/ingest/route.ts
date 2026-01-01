import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
        await prisma.event.create({
            data: {
                payload: body,
                apiKeyId: apiKey.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ingest Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
