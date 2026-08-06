import { Head } from '@inertiajs/react';
import React from 'react';

import { TrendBadge } from '@/components/Backend/TrendBadge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { AnalyticsSummary, DashboardProps, TrendDirection } from '@/types';

export default function Dashboard({
  auth,
  posts,
  publications,
  researchs,
  postsIncreasePercent,
  publicationsIncreasePercent,
  researchsIncreasePercent,
  postsThisMonth,
  postsLastMonth,
  publicationsThisMonth,
  publicationsLastMonth,
  researchsThisMonth,
  researchsLastMonth,
  postsTrend,
  publicationsTrend,
  researchsTrend,
  analytics,
}: DashboardProps) {
  const { toast } = useToast();

  React.useEffect(() => {
    if (auth.user?.email_verified_at == null) {
      toast({
        title: 'Not verified!',
        description: `Seems like you have not verified your email address, please verify your email by clicking the verification link sent to your email (${auth.user?.email}).`,
        variant: 'destructive',
      });
    }
  }, [auth, toast]);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-4">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-3 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          <StatsCard
            title="posts"
            stat={posts}
            count={postsThisMonth}
            lastMonth={postsLastMonth}
            percent={postsIncreasePercent}
            trend={postsTrend}
          />
          <StatsCard
            title="publications"
            stat={publications}
            count={publicationsThisMonth}
            lastMonth={publicationsLastMonth}
            percent={publicationsIncreasePercent}
            trend={publicationsTrend}
          />
          <StatsCard
            title="Research"
            stat={researchs}
            count={researchsThisMonth}
            lastMonth={researchsLastMonth}
            percent={researchsIncreasePercent}
            trend={researchsTrend}
          />
        </div>

        <AnalyticsSection analytics={analytics} />
      </div>
    </AuthenticatedLayout>
  );
}

function trendLabel(trend: TrendDirection): string {
  if (trend === 'up') {
    return 'up';
  }
  if (trend === 'down') {
    return 'down';
  }
  return 'unchanged';
}

type StatsCardProps = {
  title: string;
  stat: number;
  percent: number;
  count: number;
  lastMonth: number;
  trend: TrendDirection;
};

function StatsCard({
  title,
  stat,
  percent,
  count,
  lastMonth,
  trend,
}: StatsCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="uppercase">{title}</CardDescription>
        <CardTitle className="flex w-full justify-between gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {title.charAt(0).toUpperCase() + title.slice(1) + ' : ' + stat}
        </CardTitle>
        <CardAction>
          <TrendBadge percent={percent} trend={trend} />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Number of {title} went {trendLabel(trend)} this month
        </div>
        <div className="text-muted-foreground">
          {title} published this month {count} and last month {lastMonth}
        </div>
      </CardFooter>
    </Card>
  );
}

function AnalyticsSection({ analytics }: { analytics: AnalyticsSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">
      <Card className="from-primary/5 to-card @container/card bg-linear-to-t *:data-[slot=card]:shadow-xs">
        <CardHeader>
          <CardDescription className="uppercase">Views today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {analytics.views_today}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="from-primary/5 to-card @container/card bg-linear-to-t">
        <CardHeader>
          <CardDescription className="uppercase">
            Views this week
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {analytics.views_this_week}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="from-primary/5 to-card @container/card bg-linear-to-t">
        <CardHeader>
          <CardDescription className="uppercase">
            Views this month
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {analytics.views_this_month}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="from-primary/5 to-card @container/card bg-linear-to-t lg:col-span-1">
        <CardHeader>
          <CardDescription className="uppercase">Top pages</CardDescription>
          <CardTitle className="text-base font-semibold">This month</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {analytics.top_pages.length === 0 ? (
            <div className="text-muted-foreground">No page views yet</div>
          ) : (
            <ul className="w-full space-y-1">
              {analytics.top_pages.map(page => (
                <li
                  key={page.path}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span className="truncate font-medium" title={page.path}>
                    {page.path}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {page.views}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
