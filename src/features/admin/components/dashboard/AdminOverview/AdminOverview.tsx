'use client'
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Deal } from '@/shared/types/entities/deal';
import { Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

interface AdminOverviewProps {
  deals: Deal[];
}

export default function AdminOverview({ deals }: AdminOverviewProps) {
  const { recentDeals, expiringDeals } = useMemo(() => {
    const now = Date.now();

    const recentDeals = deals
      .filter(deal => deal.isActive)
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5);

    const expiringDeals = deals
      .filter(deal => {
        if (!deal.endDate) return false;
        const endDate = new Date(deal.endDate);
        const daysUntilExpiry = (endDate.getTime() - now) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      })
      .slice(0, 3);

    return { recentDeals, expiringDeals };
  }, [deals]);

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6">
      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Recent Deals */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Active Deals
            </CardTitle>
            <CardDescription>Latest deals added to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDeals.length > 0 ? (
              <div className="space-y-2">
                {recentDeals.map((deal) => (
                  <div key={deal.id} className="flex justify-between items-start p-2 bg-card dark:bg-card rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {deal.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {deal.storeName} • {deal.discount}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full mt-3">
                  <Link href="/dashboard/deals">View All Deals</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No deals available</p>
            )}
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Deals expiring within 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {expiringDeals.length > 0 ? (
              <div className="space-y-2">
                {expiringDeals.map((deal) => (
                  <div key={deal.id} className="flex justify-between items-start p-2 bg-muted dark:bg-muted rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {deal.title}
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Expires: {deal.endDate ? dateFormatter.format(new Date(deal.endDate)) : 'No end date'}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full mt-3">
                  <Link href="/dashboard/deals">Manage Expiring Deals</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No deals expiring soon</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
