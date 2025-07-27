import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { useToast } from '@/components/ui/use-toast';
import { Head } from '@inertiajs/react';
import {

  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
}) {
  const { toast } = useToast();

  React.useState(() => {
    if (auth.user.email_verified_at == null) {
      return toast({
        title: 'Not verified!',
        description: `Seems like you have not verified your email address, please verify your email by clicking the verification link sent to your email (${auth.user.email}).`,
        variant: 'destructive',
      });
    }
  }, [auth]);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
              <StatsCard
                title={'posts'}
                stat={posts}
                count={postsThisMonth}
                lastMonth={postsLastMonth}
                percent={postsIncreasePercent}
              />
              <StatsCard
                title={'publications'}
                stat={publications}
                count={publicationsThisMonth}
                lastMonth={publicationsLastMonth}
                percent={publicationsIncreasePercent}
              />
              <StatsCard
                title={'Research'}
                stat={researchs}
                count={researchsThisMonth}
                lastMonth={researchsLastMonth}
                percent={researchsIncreasePercent}
              />
            </div>

    </AuthenticatedLayout>
  );
}

const StatsCard = ({ title, stat, percent, count, lastMonth }) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="uppercase">{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl flex w-full justify-between gap-2 text-2xl font-semibold tabular-nums">
          {title.charAt(0).toUpperCase() + title.slice(1) + " : " + stat }
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {percent > 0 ? <TrendingUp className="size-4" /> : <TrendingDown />}
            {percent.toFixed()}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of { title } went {percent > 0 ? "up" : "down"} this month
          </div>
          <div className="text-muted-foreground">
            {title} published this month {count} and last month {lastMonth}
          </div>
        </CardFooter>
    </Card>
  );
};
