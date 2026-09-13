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
  onSearch?: (data: SearchBarData) => void;
  onClearSearch?: () => void;
  isSearchActive?: boolean;
};

const DATE_ERROR_MESSAGE = 'A data de devolução deve ser posterior à data de retirada.';

function getSearchDateError(pickupDate: string, returnDate: string) {
  if (!pickupDate || !returnDate) return null;

  return new Date(returnDate) <= new Date(pickupDate) ? DATE_ERROR_MESSAGE : null;
}

export function SearchBar({ onSearch, onClearSearch, isSearchActive = false }: SearchBarProps) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextDateError = getSearchDateError(pickupDate, returnDate);
    setDateError(nextDateError);
    if (nextDateError) return;

    onSearch?.({ pickupLocation, returnLocation, pickupDate, pickupTime, returnDate, returnTime });
  }

  function handleClear() {
    setPickupLocation('');
    setPickupDate('');
    setPickupTime('');
    setReturnLocation('');
    setReturnDate('');
    setReturnTime('');
    setDateError(null);
    onClearSearch?.();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full bg-brand-secondary-pure px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TextField
            tone="inverted"
            icon="location_on"
            placeholder="Local de retirada"
            aria-label="Local de retirada"
            required
            value={pickupLocation}
            onChange={(event) => setPickupLocation(event.target.value)}
          />
          <TextField
            tone="inverted"
            icon="calendar_today"
            type="date"
            aria-label="Data de retirada"
            required
            value={pickupDate}
            onChange={(event) => {
              setPickupDate(event.target.value);
              setDateError(null);
            }}
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

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              tone="inverted"
              icon="location_on"
              placeholder="Local de devolução"
              aria-label="Local de devolução"
              required
              value={returnLocation}
              onChange={(event) => setReturnLocation(event.target.value)}
            />
            <TextField
              tone="inverted"
              icon="calendar_today"
              type="date"
              aria-label="Data de devolução"
              required
              aria-describedby={dateError ? 'search-date-error' : undefined}
              aria-invalid={Boolean(dateError)}
              value={returnDate}
              onChange={(event) => {
                setReturnDate(event.target.value);
                setDateError(null);
              }}
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
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            {isSearchActive ? (
              <Button type="button" onClick={handleClear} className="w-full whitespace-nowrap">
                Limpar busca
              </Button>
            ) : null}
            <Button type="submit" variant="primary" className="w-full lg:w-auto">
              Buscar
            </Button>
          </div>
        </div>
        {dateError ? (
          <p id="search-date-error" role="alert" className="text-sm font-medium text-red-200">
            {dateError}
          </p>
        ) : null}
      </div>
    </form>
  );
}

export { DATE_ERROR_MESSAGE, getSearchDateError };
export type { SearchBarData, SearchBarProps };
