import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { TrendDirection } from '@/types';

type TrendBadgeProps = {
  percent: number;
  trend: TrendDirection;
};

export function TrendBadge({ percent, trend }: TrendBadgeProps) {
  return (
    <Badge variant="outline">
      {trend === 'up' ? (
        <TrendingUp className="size-4" data-testid="trend-up" />
      ) : trend === 'down' ? (
        <TrendingDown className="size-4" data-testid="trend-down" />
      ) : (
        <Minus className="size-4" data-testid="trend-neutral" />
      )}
      {percent.toFixed()}%
    </Badge>
  );
}
