import { auth, currentUser } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  UsersIcon,
  NetworkIcon,
  TrendingUpIcon,
  UserPlusIcon,
} from 'lucide-react';
import { Input } from '@repo/design-system/components/ui/input';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { StatsCard } from './components/stats-card';
import { PersonCard } from './components/person-card';
import { AddPersonDialog } from './components/add-person-dialog';
import { OnboardingWizard } from './components/onboarding-wizard';
import { getPeople, getStats, getPersonByUserId } from '../actions/people';

export const metadata = {
  title: 'Network Map - Dashboard',
  description: 'Your collaborative relationship network',
};

async function DashboardContent({ searchQuery }) {
  const people = await getPeople(searchQuery);
  const stats = await getStats();

  return (
    <>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          icon={UsersIcon}
          label="Total People"
          value={stats.totalPeople}
        />
        <StatsCard
          icon={NetworkIcon}
          label="Connections"
          value={stats.totalConnections}
        />
        <StatsCard
          icon={UserPlusIcon}
          label="Your Connections"
          value={stats.yourConnections}
        />
        <StatsCard
          icon={TrendingUpIcon}
          label="New This Week"
          value={stats.newThisWeek}
        />
      </div>

      {/* People Grid */}
      {people.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <UsersIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No people yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your network by adding people you know.
          </p>
          <AddPersonDialog />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function DashboardPage({ searchParams }) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    notFound();
  }

  // Check if user has created their profile
  const userPerson = await getPersonByUserId(userId);
  const needsOnboarding = !userPerson;

  const params = await searchParams;
  const searchQuery = params?.q || '';

  return (
    <>
      {needsOnboarding && <OnboardingWizard open={true} user={user} />}

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Network Map</h1>
            <p className="text-muted-foreground">
              Build and explore your relationship network
            </p>
          </div>
          <AddPersonDialog />
        </div>

        {/* Search */}
        <form action="/" method="get" className="w-full md:max-w-md">
          <Input
            type="search"
            name="q"
            placeholder="Search people by name, occupation, or location..."
            defaultValue={searchQuery}
            className="w-full"
          />
        </form>

        {/* Content */}
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            </div>
          }
        >
          <DashboardContent searchQuery={searchQuery} />
        </Suspense>
      </div>
    </>
  );
}
