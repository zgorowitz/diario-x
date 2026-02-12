'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';

export function PersonForm({ person, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    email: person?.email || '',
    phone: person?.phone || '',
    age: person?.age || '',
    gender: person?.gender || '',
    religion: person?.religion || '',
    city: person?.city || '',
    country: person?.country || '',
    occupation: person?.occupation || '',
    company: person?.company || '',
    notes: person?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert age to number
    const data = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : null,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="John"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      {/* Demographics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="25"
            min="0"
            max="150"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Male/Female/Other"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion</Label>
          <Input
            id="religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            placeholder="Christianity/Judaism/etc"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="New York"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="United States"
          />
        </div>
      </div>

      {/* Professional */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Google"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional information about this person..."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : person ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
