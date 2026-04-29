import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { successToast, errorToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { GET_INDUSTRIES, SET_INDUSTRY } from "../../utils/apiPath";
import { getSessionUser } from "../../services/auth";
import "./Onboarding.scss";

const Onboarding = () => {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [industries, setIndustries] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.industryId) {
      navigate("/dashboard");
      return;
    }

    const fetchIndustries = async () => {
      try {
        const { data } = await axiosInstance.get(GET_INDUSTRIES);
        setIndustries(data);
      } catch (error) {
        errorToast("Failed to load industries");
      }
    };
    fetchIndustries();
  }, [navigate, user]);

  const handleSubmit = async () => {
    if (!selectedId) {
      errorToast("Please select an industry to continue.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(SET_INDUSTRY, { industryId: selectedId });
      
      const updatedUser = { ...user, industryId: selectedId };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      
      successToast("Industry saved! Setting up your workspace...");
      navigate("/dashboard");
    } catch (err) {
      errorToast("Failed to save industry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-card__header">
          <h2>Welcome to Zynapse, {user?.name?.split(' ')[0] || 'User'}! 🎉</h2>
          <p>To personalize your experience, please select your primary industry. We'll tailor the AI tools specifically for your business needs.</p>
        </div>

        <div className="industry-grid">
          {industries.map((ind) => (
            <button
              key={ind._id}
              className={`industry-option ${selectedId === ind._id ? "is-selected" : ""}`}
              onClick={() => setSelectedId(ind._id)}
              type="button"
            >
              <span className="industry-option__icon">{ind.icon}</span>
              <span className="industry-option__name">{ind.name}</span>
              <span className="industry-option__desc">{ind.description}</span>
            </button>
          ))}
        </div>

        <div className="onboarding-card__footer">
          <ButtonComponent
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            loading={loading}
            disabled={!selectedId}
          >
            Continue to Dashboard
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
