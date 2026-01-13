import { useState } from "react";
import "./MoodCheckIn.css";

const moods = [
  { label: "Very Low", emoji: "😞" },
  { label: "Low", emoji: "😕" },
  { label: "Okay", emoji: "😐" },
  { label: "Good", emoji: "🙂" },
  { label: "Great", emoji: "😄" },
];

const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <section className="moodcheckin">
      <div className="mood-card">
        <h2>How are you feeling today?</h2>
        <p className="subtitle">
          There’s no right or wrong answer. Just be honest with yourself.
        </p>

        <div className="mood-options">
          {moods.map((mood, index) => (
            <button
              key={index}
              className={`mood-btn ${
                selectedMood === index ? "active" : ""
              }`}
              onClick={() => setSelectedMood(index)}
            >
              <span className="emoji">{mood.emoji}</span>
              <span className="label">{mood.label}</span>
            </button>
          ))}
        </div>

        {selectedMood !== null && (
          <p className="feedback">
            Thanks for checking in. MediAI is here with you.
          </p>
        )}
      </div>
    </section>
  );
};

export default MoodCheckIn;