import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

type BirthdayInputFieldProps = {
  disabled?: boolean
  birthdate?: string
  setBirthdate: (birthdate: string) => void
  className?: string
  setWrongBirthdate?: (wrongBirthdate: boolean) => void
}

const BirthdayInputField = ({
  disabled,
  birthdate,
  setBirthdate,
  className,
  setWrongBirthdate,
}: BirthdayInputFieldProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (inputValue.length > 8) {
      setError("Please enter a valid date in YYYYMMDD format.");
      return;
    }

    if (inputValue.length === 8) {
      const year = inputValue.substring(0, 4);
      const month = inputValue.substring(4, 6);
      const day = inputValue.substring(6, 8);

      const dateString = `${year}-${month}-${day}`;
      if (dayjs(dateString, 'YYYY-MM-DD', true).isValid() && dayjs(dateString).isBefore(dayjs(), 'day')) {
        setBirthdate(dateString);
        setError(null);
      } else {
        setWrongBirthdate && setWrongBirthdate(true);
      }
    } else {
      setError(null);
    }
  };

  return (
    <input
      type='date'
      value={birthdate}
      onChange={handleDateChange}
      placeholder='Enter your birthday'
      disabled={disabled}
      className={`bg-transparent text-gray-300 w-full py-2 ${className}`}
    />
  )
}

export default BirthdayInputField
