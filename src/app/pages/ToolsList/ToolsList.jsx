import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import { SearchOutlined, ArrowRightOutlined, LockOutlined } from "@ant-design/icons";
import { getSessionUser } from "../../services/auth";
import axiosInstance from "../../services/axiosInstance";
import { GET_MY_TOOLS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";
import "./ToolsList.scss";

const PLAN_ORDER = { FREE: 0, STARTER: 1, PRO: 2, BUSINESS: 3 };

const ToolsList = () => {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(GET_MY_TOOLS);
        setTools(data);
      } catch {
        errorToast("Failed to fetch tools.");
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const userPlanOrder = PLAN_ORDER[user?.planTier || "FREE"] ?? 0;

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToolClick = (tool) => {
    const required = PLAN_ORDER[tool.planRequired] ?? 0;
    if (required > userPlanOrder) return;
    navigate(`/tools/${tool.slug}`);
  };

  return (
    <div className="tools-list-page">
      <SubHeader
        title="AI Tools Library"
        subTitle="Select a tool below to start generating content."
        showBack={false}
      >
        <div style={{ width: "300px" }}>
          <InputField
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            prefix={<SearchOutlined />}
          />
        </div>
      </SubHeader>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>Loading tools...</div>
      ) : (
        <div className="tools-grid">
          {filteredTools.map((tool) => {
            const required = PLAN_ORDER[tool.planRequired] ?? 0;
            const locked = required > userPlanOrder;
            return (
              <div
                key={tool._id}
                className={`tool-card ${locked ? "tool-card--locked" : ""}`}
                onClick={() => handleToolClick(tool)}
                style={{ cursor: locked ? "not-allowed" : "pointer" }}
              >
                <div className="tool-card__icon">
                  {tool.icon || "🤖"}
                </div>
                <h3 className="tool-card__name">{tool.name}</h3>
                <p className="tool-card__desc">{tool.description}</p>
                <div className="tool-card__footer">
                  {locked ? (
                    <>
                      <span className="tool-card__tag tool-card__tag--locked">
                        <LockOutlined style={{ marginRight: 4 }} />{tool.planRequired}
                      </span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Upgrade required</span>
                    </>
                  ) : (
                    <>
                      <span className="tool-card__tag">
                        {tool.planRequired === "FREE" ? "Free" : tool.planRequired}
                      </span>
                      <span className="tool-card__arrow"><ArrowRightOutlined /></span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {filteredTools.length === 0 && !loading && (
            <div className="tools-empty">
              <p>No tools found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsList;
