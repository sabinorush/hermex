'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/atoms';
import { TextField } from '@/components/molecules';

type SearchBarData = {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
};

type SearchBarProps = {
  onSearch: (data: SearchBarData) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ pickupLocation, returnLocation, pickupDate, pickupTime, returnDate, returnTime });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full bg-brand-secondary-pure px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField
            tone="inverted"
            icon="location_on"
            placeholder="Local de retirada"
            aria-label="Local de retirada"
            value={pickupLocation}
            onChange={(event) => setPickupLocation(event.target.value)}
          />
          <TextField
            tone="inverted"
            icon="calendar_today"
            type="date"
            aria-label="Data de retirada"
            value={pickupDate}
            onChange={(event) => setPickupDate(event.target.value)}
          />
          <TextField
            tone="inverted"
            icon="schedule"
            type="time"
            aria-label="Hora de retirada"
            value={pickupTime}
            onChange={(event) => setPickupTime(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
            <TextField
              tone="inverted"
              icon="location_on"
              placeholder="Local de devolução"
              aria-label="Local de devolução"
              value={returnLocation}
              onChange={(event) => setReturnLocation(event.target.value)}
            />
            <TextField
              tone="inverted"
              icon="calendar_today"
              type="date"
              aria-label="Data de devolução"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
            />
            <TextField
              tone="inverted"
              icon="schedule"
              type="time"
              aria-label="Hora de devolução"
              value={returnTime}
              onChange={(event) => setReturnTime(event.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            Buscar
          </Button>
        </div>
      </div>
    </form>
  );
}
