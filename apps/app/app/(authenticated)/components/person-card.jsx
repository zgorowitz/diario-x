import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Avatar } from '@repo/design-system/components/ui/avatar';
import Link from 'next/link';
import { UserIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react';

export function PersonCard({ person }) {
  const fullName = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(' ');
  const initials = [person.firstName?.[0], person.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();

  // Count connections
  const connectionCount =
    (person.connectionsFrom?.length || 0) + (person.connectionsTo?.length || 0);

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Avatar className="h-20 w-20 text-lg">
          {person.photoUrl ? (
            <img src={person.photoUrl} alt={fullName} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              {initials || <UserIcon />}
            </div>
          )}
        </Avatar>

        <div className="text-center">
          <h3 className="font-semibold text-lg">{fullName}</h3>

          {person.occupation && (
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
              <BriefcaseIcon className="h-3 w-3" />
              <span>
                {person.occupation}
                {person.company && ` @ ${person.company}`}
              </span>
            </div>
          )}

          {person.city && (
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPinIcon className="h-3 w-3" />
              <span>
                {person.city}
                {person.country && `, ${person.country}`}
              </span>
            </div>
          )}

          {connectionCount > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <Link href={`/person/${person.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
