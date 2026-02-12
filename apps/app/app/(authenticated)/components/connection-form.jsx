'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';

export function ConnectionForm({
  people,
  relationshipTypes,
  onSubmit,
  onCancel,
  isSubmitting,
  currentPersonId,
}) {
  const [formData, setFormData] = useState({
    personId: '',
    relationshipTypes: [],
    howMet: '',
    whenMetYear: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      whenMetYear: formData.whenMetYear
        ? parseInt(formData.whenMetYear, 10)
        : null,
    };

    onSubmit(data);
  };

  const toggleRelationType = (typeName) => {
    setFormData((prev) => ({
      ...prev,
      relationshipTypes: prev.relationshipTypes.includes(typeName)
        ? prev.relationshipTypes.filter((t) => t !== typeName)
        : [...prev.relationshipTypes, typeName],
    }));
  };

  // Group relationship types by category
  const grouped = relationshipTypes.reduce((acc, type) => {
    const category = type.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(type);
    return acc;
  }, {});

  // Filter out current person from people list
  const availablePeople = people.filter((p) => p.id !== currentPersonId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="personId">
          Select Person <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.personId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, personId: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a person..." />
          </SelectTrigger>
          <SelectContent>
            {availablePeople.map((person) => (
              <SelectItem key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
                {person.occupation && ` - ${person.occupation}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Relationship Type(s) <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
          {Object.entries(grouped).map(([category, types]) => (
            <div key={category} className="space-y-2">
              <div className="text-sm font-medium capitalize text-muted-foreground">
                {category}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {types.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={formData.relationshipTypes.includes(type.name)}
                      onCheckedChange={() => toggleRelationType(type.name)}
                    />
                    <label
                      htmlFor={type.id}
                      className="text-sm cursor-pointer"
                    >
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {formData.relationshipTypes.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Please select at least one relationship type
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="howMet">How did you meet?</Label>
        <Input
          id="howMet"
          value={formData.howMet}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, howMet: e.target.value }))
          }
          placeholder="At work, college, through friends..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whenMetYear">When did you meet? (Year)</Label>
        <Input
          id="whenMetYear"
          type="number"
          value={formData.whenMetYear}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, whenMetYear: e.target.value }))
          }
          placeholder="2020"
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.personId ||
            formData.relationshipTypes.length === 0
          }
        >
          {isSubmitting ? 'Adding...' : 'Add Connection'}
        </Button>
      </div>
    </form>
  );
}
