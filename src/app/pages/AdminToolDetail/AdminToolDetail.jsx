import { useParams, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";

const AdminToolDetail = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <SubHeader 
        title={`Tool Details: ${toolId}`} 
        subTitle="Manage prompts and settings for this tool."
        onBack={() => navigate("/admin/tools")}
      />
      <div style={{ padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <p>Tool configuration goes here...</p>
      </div>
    </div>
  );
};

export default AdminToolDetail;
