
import "./DurationSelector.css";

interface DurationSelectorProps {
  base: number;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

export default function DurationSelector({
  base,
  duration,
  setDuration,
}: DurationSelectorProps) {

  const slots = [
    base * 0.5,
    base,
    base * 2,
    base * 3,
    base * 4,
  ];

  return (

    <div className="duration-selector">

      <div className="duration-options">

        {slots.map((slot) => (

          <button
            key={slot}
            className={
              duration === slot
                ? "duration-btn active"
                : "duration-btn"
            }
            onClick={() =>
              setDuration(slot)
            }
          >
            {slot} mins
          </button>

        ))}

      </div>

    </div>
  );
}
