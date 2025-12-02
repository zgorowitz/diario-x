'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  UserIcon,
  EditIcon,
  UserPlusIcon,
} from 'lucide-react';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Avatar } from '@repo/design-system/components/ui/avatar';
import { Badge } from '@repo/design-system/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { PersonForm } from '../../components/person-form';
import { ConnectionForm } from '../../components/connection-form';
import {
  getPerson,
  updatePerson,
  getPeople,
} from '@/app/actions/people';
import {
  createConnection,
  getRelationshipTypes,
} from '@/app/actions/connections';
import { toast } from 'sonner';

export default function PersonProfilePage({ params }) {
  const router = useRouter();
  const [person, setPerson] = useState(null);
  const [allPeople, setAllPeople] = useState([]);
  const [relationshipTypes, setRelationshipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personId = params?.id;

  useEffect(() => {
    async function loadData() {
      try {
        const [personData, peopleData, typesData] = await Promise.all([
          getPerson(personId),
          getPeople(),
          getRelationshipTypes(),
        ]);

        setPerson(personData);
        setAllPeople(peopleData);
        setRelationshipTypes(typesData);
      } catch (error) {
        toast.error('Failed to load person');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [personId]);

  const handleUpdate = async (data) => {
    setIsSubmitting(true);

    try {
      const updated = await updatePerson(personId, data);
      setPerson(updated);
      setEditOpen(false);
      toast.success('Person updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update person: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddConnection = async (data) => {
    setIsSubmitting(true);

    try {
      await createConnection(personId, data.personId, data);
      const refreshed = await getPerson(personId);
      setPerson(refreshed);
      setConnectionOpen(false);
      toast.success('Connection added successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to add connection: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-2">Person not found</h2>
        <Link href="/">
          <Button>Go back</Button>
        </Link>
      </div>
    );
  }

  const fullName = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(' ');
  const initials = [person.firstName?.[0], person.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();

  // Combine connections
  const connections = [
    ...(person.connectionsFrom || []).map((conn) => ({
      ...conn,
      person: conn.toPerson,
    })),
    ...(person.connectionsTo || []).map((conn) => ({
      ...conn,
      person: conn.fromPerson,
    })),
  ];

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Network
          </Button>
        </Link>

        {/* Profile Header */}
        <Card>
          <CardContent className="flex flex-col md:flex-row gap-6 p-6">
            <Avatar className="h-24 w-24 text-2xl">
              {person.photoUrl ? (
                <img src={person.photoUrl} alt={fullName} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                  {initials || <UserIcon />}
                </div>
              )}
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{fullName}</h1>
                  {person.occupation && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      <span>
                        {person.occupation}
                        {person.company && ` @ ${person.company}`}
                      </span>
                    </div>
                  )}
                  {person.city && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>
                        {person.city}
                        {person.country && `, ${person.country}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setEditOpen(true)} className="gap-2">
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setConnectionOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    Add Connection
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {person.email && (
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${person.email}`}
                    className="text-sm hover:underline"
                  >
                    {person.email}
                  </a>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${person.phone}`}
                    className="text-sm hover:underline"
                  >
                    {person.phone}
                  </a>
                </div>
              )}
              {person.age && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Age:</span> {person.age}
                </div>
              )}
              {person.gender && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Gender:</span>{' '}
                  {person.gender}
                </div>
              )}
              {person.religion && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Religion:</span>{' '}
                  {person.religion}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Info */}
          {(person.occupation || person.company) && (
            <Card>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {person.occupation && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Occupation:</span>{' '}
                    {person.occupation}
                  </div>
                )}
                {person.company && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Company:</span>{' '}
                    {person.company}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notes */}
        {person.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{person.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Connections */}
        <Card>
          <CardHeader>
            <CardTitle>
              Connections ({connections.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No connections yet
              </p>
            ) : (
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <Link
                        href={`/person/${conn.person.id}`}
                        className="font-medium hover:underline"
                      >
                        {conn.person.firstName} {conn.person.lastName}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {conn.relationshipTypes?.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      {conn.howMet && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Met: {conn.howMet}
                          {conn.whenMetYear && ` (${conn.whenMetYear})`}
                        </p>
                      )}
                    </div>
                    {conn.strengthScore && (
                      <div className="text-sm text-muted-foreground">
                        Strength: {conn.strengthScore.toFixed(1)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Person</DialogTitle>
          </DialogHeader>
          <PersonForm
            person={person}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Add Connection Dialog */}
      <Dialog open={connectionOpen} onOpenChange={setConnectionOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Connection</DialogTitle>
          </DialogHeader>
          <ConnectionForm
            people={allPeople}
            relationshipTypes={relationshipTypes}
            currentPersonId={personId}
            onSubmit={handleAddConnection}
            onCancel={() => setConnectionOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
