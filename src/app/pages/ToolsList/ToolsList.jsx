import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import { SearchOutlined, RobotOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "./ToolsList.scss";

import axiosInstance from "../../services/axiosInstance";
import { GET_MY_TOOLS } from "../../utils/apiPath";
import { errorToast } from "../../services/ToastHelper";

const ToolsList = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data } = await axiosInstance.get(GET_MY_TOOLS);
        setTools(data);
      } catch (error) {
        errorToast("Failed to fetch tools.");
      }
    };
    fetchTools();
  }, []);

  const filteredTools = tools.filter((t) => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="tools-grid">
        {filteredTools.map((tool) => (
          <div key={tool._id} className="tool-card" onClick={() => navigate(`/tools/${tool.slug}`)}>
            <div className="tool-card__icon">
              <RobotOutlined />
            </div>
            <h3 className="tool-card__name">{tool.name}</h3>
            <p className="tool-card__desc">{tool.description}</p>
            <div className="tool-card__footer">
              <span className="tool-card__tag">Ready</span>
              <span className="tool-card__arrow"><ArrowRightOutlined /></span>
            </div>
          </div>
        ))}
        {filteredTools.length === 0 && (
          <div className="tools-empty">
            <p>No tools found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsList;
