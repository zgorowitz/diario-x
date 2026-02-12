import { Card, CardContent } from '@repo/design-system/components/ui/card';

export function StatsCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        {Icon && <Icon className="h-8 w-8 text-primary" />}
        <div className="flex-1">
          <div className="text-2xl font-bold">{value || 0}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
