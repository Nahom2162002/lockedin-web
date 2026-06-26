import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Website from '@/models/Website';
import { url } from 'inspector';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        if (user.plan !== 'pro') {
            return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });
        }

        const websites = await Website.find({ userId: user._id });

        const totalFocusMinutes = websites.reduce((total, site) => {
            const [startH, startM] = site.startTime.split(':').map(Number);
            const [endH, endM] = site.endTime.split(':').map(Number);
            const duration = (endH * 60 + endM) - (startH * 60 + startM);
            return total + (duration > 0 ? duration: 0);
        }, 0);

        const siteCounts: Record<string, number> = {};
        websites.forEach(site => {
            const domain = site.url.replace(/&https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            siteCounts[domain] = (siteCounts[domain] || 0) + 1;
        });
        const topSites = Object.entries(siteCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([url, count]) => ({ url, count }));
        
        const dates = [...new Set(websites.map(site => site.dateCreated.toISOString().split('T')[0]))].sort();
        let streak = 0;
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];

        for (let i = 0; i < dates.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            } else {
                const prev = new Date(dates[i - 1]);
                const curr = new Date(dates[i]);
                const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

                if (diff === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            }
            streak = Math.max(streak, currentStreak);
        }

        const lastDate = dates[dates.length - 1];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate !== today && lastDate !== yesterdayStr) {
            streak = 0;
        }

        return NextResponse.json({
            totalFocusMinutes,
            topSites,
            streak,
            totalSessions: websites.length 
        }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}