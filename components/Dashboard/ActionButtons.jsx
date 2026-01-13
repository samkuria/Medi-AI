import "./ActionButtons.css";
import { useNavigate } from "react-router-dom";

const ActionButtons = () => {
  const navigate = useNavigate();
  return (
    <section className="actions">
      <div className="actions-wrapper">
        <button className="action-card chat" onClick={() => navigate("/chat")}>
          <h3>Start A Chat</h3>
          
        </button>

        <button className="action-card session">
          <h3>Book A Session</h3>
        </button>
      </div>
    </section>
  );
};

export default ActionButtons;