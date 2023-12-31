import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

type BirthdayInputFieldProps = {
  disabled?: boolean;
  birthdate?: string;
  setBirthdate: (birthdate: string) => void;
  className?:string
}

const BirthdayInputField = ({disabled, birthdate, setBirthdate, className}:BirthdayInputFieldProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format the date as the user types it
    const formattedDate = dayjs(e.target.value).format('YYYY-MM-DD');
    setBirthdate(formattedDate);
  };

  return (
    <input
      type="date"
      value={birthdate}
      onChange={handleDateChange}
      placeholder="Enter your birthday"
      disabled={disabled}
      className={'bg-transparent text-gray-300 w-full py-2 '+className}
      // Additional styling can be applied here or via external CSS
    />
  );
}

export default BirthdayInputField;
