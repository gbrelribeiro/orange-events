/* _components/eventhour/EventHour.tsx */
"use client";

interface EventHourProps {
  label: string;
  hourValue: string;
  minuteValue: string;
  onHourChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinuteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hourName: string;
  minuteName: string;
  disabled?: boolean;
}

export default function EventHour({
  label,
  hourValue,
  minuteValue,
  onHourChange,
  onMinuteChange,
  hourName,
  minuteName,
  disabled = false,
}: EventHourProps) {
  return (
    <div className="column gap-1 md:col-span-2">
      <label>
        {label}
      </label>

      <div className="grid grid-cols-2 gap-2">
        <input
          name={hourName}
          type="number"
          min={0}
          max={23}
          className="input px-2"
          placeholder="Horas"
          value={hourValue}
          onChange={onHourChange}
          disabled={disabled}
          required
        />
        <input
          name={minuteName}
          type="number"
          min={0}
          max={59}
          className="input px-2"
          placeholder="Minutos"
          value={minuteValue}
          onChange={onMinuteChange}
          disabled={disabled}
          required
        />
      </div>
    </div>
  );
};