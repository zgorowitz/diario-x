'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/design-system/components/ui/dialog';
import { Button } from '@repo/design-system/components/ui/button';
import { PersonForm } from './person-form';
import { createPerson } from '@/app/actions/people';
import { toast } from 'sonner';

export function OnboardingWizard({ open, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Create person profile for the current user
      await createPerson({
        ...data,
        userId: user.id, // Link to Clerk user
        email: user.emailAddresses?.[0]?.emailAddress || data.email,
      });

      toast.success('Welcome to Network Map!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to create profile: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Create minimal profile
    handleSubmit({
      firstName: user.firstName || 'User',
      lastName: user.lastName || '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to Network Map!</DialogTitle>
          <DialogDescription>
            Let's start by creating your profile. This will help others in the
            network know more about you.
          </DialogDescription>
        </DialogHeader>
        <PersonForm
          person={{
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.emailAddresses?.[0]?.emailAddress || '',
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
