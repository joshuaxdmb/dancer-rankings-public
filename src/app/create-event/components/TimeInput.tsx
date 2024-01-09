import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import DateTimePicker from 'react-datetime-picker'

type BirthdayInputFieldProps = {
  disabled?: boolean
  birthdate?: string
  setBirthdate: (birthdate: any) => void
  className?: string
}

const DateInputField = ({
  disabled,
  birthdate,
  setBirthdate,
  className,
}: BirthdayInputFieldProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format the date as the user types it
    const formattedDate = dayjs(e.target.value).toISOString()
    setBirthdate(formattedDate)
  }

  return (
    <DateTimePicker
      hourPlaceholder='hh'
      minutePlaceholder='mm'
      secondPlaceholder='ss'
      dayPlaceholder='DD'
      monthPlaceholder='MM'
      yearPlaceholder='YYYY'
      className='time-picker'
      showNavigation={false}
      disableCalendar={true}
      showLeadingZeros={false}
      onChange={setBirthdate}
      required={true}
      value={birthdate}
      disabled={disabled}
      calendarIcon={null}
      clearIcon={null}
    />
  )
}

export default DateInputField
