import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Website from '@/models/Website';
import BlockEvent from '@/models/BlockEvent';
import FocusEvent from '@/models/FocusEvent';
import User from '@/models/User';

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

        const getDomain = (url: string) => {
            try {
                const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
                return parsed.hostname.replace(/^www\./, '').split('.')[0];
            } catch {
                return url;
            }
        };

        const getSiteMinutes = (site: any) => {
            const [startH, startM] = site.startTime.split(':').map(Number);
            const [endH, endM] = site.endTime.split(':').map(Number);
            const duration = (endH * 60 + endM) - (startH * 60 + startM);
            return duration > 0 ? duration : 0;
        };

        const totalFocusMinutes = websites.reduce((total, site) => total + getSiteMinutes(site), 0);

        const siteCounts: Record<string, number> = {};
        websites.forEach(site => {
            const domain = getDomain(site.url);
            siteCounts[domain] = (siteCounts[domain] || 0) + 1;
        });
        const topSites = Object.entries(siteCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([url, count]) => ({ url, count }));
        
        const dailyMinutes: Record<string, number> = {};
        websites.forEach(site => {
            const date = site.dateCreated.toISOString().split('T')[0];
            dailyMinutes[date] = (dailyMinutes[date] || 0) + getSiteMinutes(site);
        });

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            return {
                date: label,
                minutes: Math.round(dailyMinutes[dateStr] || 0)
            };
        });

        const activeDays = Object.values(dailyMinutes);
        const avgDailyMinutes = activeDays.length > 0
            ? Math.round(activeDays.reduce((a, b) => a + b, 0) / activeDays.length)
            : 0;
        
        const bestDayMinutes = activeDays.length > 0 ? Math.max(...activeDays) : 0;

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
        if (lastDate !== today && lastDate !== yesterdayStr) streak = 0;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const blockEventsToday = await BlockEvent.countDocuments({
            userId: user._id,
            blockedAt: { $gte: todayStart }
        });

        // Fetch goals
        const userWithGoals = await User.findById(user._id, 'goals');
        const goals = userWithGoals?.goals || { dailyMinutes: 0, weeklyMinutes: 0 };

        // Daily/weekly goal progress is tracked from actual completed Focus Session time
        // (FocusEvent), not scheduled website-block windows — those are a different metric
        // (see totalFocusMinutes above). "Today" is the caller's local calendar day, passed
        // in as ?date=YYYY-MM-DD, since the server has no way to know the user's timezone.
        const dateParam = req.nextUrl.searchParams.get('date');
        const todayStr = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
            ? dateParam
            : new Date().toISOString().split('T')[0];

        const last7DateStrs = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(`${todayStr}T00:00:00Z`);
            d.setUTCDate(d.getUTCDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const focusEvents = await FocusEvent.find({
            userId: user._id,
            date: { $in: last7DateStrs }
        });

        const todayMinutes = Math.round(
            focusEvents
                .filter(e => e.date === todayStr)
                .reduce((total, e) => total + e.minutes, 0)
        );
        const weeklyFocusMinutes = Math.round(
            focusEvents.reduce((total, e) => total + e.minutes, 0)
        );

        return NextResponse.json({
            totalFocusMinutes,
            topSites,
            streak,
            totalSessions: websites.length,
            last7Days,
            avgDailyMinutes,
            bestDayMinutes,
            blockEventsToday,
            goals,
            todayMinutes,
            weeklyFocusMinutes 
        }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}