import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubHeader from "../../components/SubHeader/SubHeader";
import InputField from "../../components/InputField/InputField";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ChatStructure from "../../components/ChatStructure/ChatStructure";
import UploadField from "../../components/UploadField/UploadField";
import { errorToast, successToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { GET_TOOL_BY_SLUG, RUN_AI_TOOL, EXTRACT_PDF } from "../../utils/apiPath";
import "./ToolRunner.scss";

const ToolRunner = () => {
  const { toolSlug } = useParams();
  const navigate = useNavigate();
  
  const [tool, setTool] = useState(null);
  const [form, setForm] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const { data } = await axiosInstance.get(`${GET_TOOL_BY_SLUG}/${toolSlug}`);
        setTool(data);
        
        const initialForm = {};
        data.fields.forEach(f => initialForm[f.name] = "");
        setForm(initialForm);
      } catch (error) {
        errorToast("Failed to load tool.");
        navigate("/tools");
      }
    };
    fetchTool();
  }, [toolSlug, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePdfUpload = async (info) => {
    const file = info.file;
    if (!file) return;

    setUploadingPdf(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axiosInstance.post(EXTRACT_PDF, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      successToast("PDF extracted successfully!");
      
      // Auto-populate the first textarea field found with the extracted text
      const textareaField = tool.fields.find(f => f.type === "textarea");
      if (textareaField) {
        setForm(prev => ({ ...prev, [textareaField.name]: prev[textareaField.name] + "\n\n" + data.text }));
      }
    } catch (err) {
      errorToast("Failed to extract PDF text.");
    } finally {
      setUploadingPdf(false);
    }
    
    // Prevent default upload behavior
    return false;
  };

  const handleRunTool = async () => {
    // Validate
    const missing = tool.fields.filter(f => f.required && !form[f.name]);
    if (missing.length > 0) {
      errorToast(`Please fill out required fields: ${missing.map(m => m.label).join(", ")}`);
      return;
    }

    setLoading(true);

    let promptText = `Run ${tool.name} with following parameters:\n`;
    tool.fields.forEach(f => {
      if (f.type !== "file") {
        promptText += `${f.label}: ${form[f.name]}\n`;
      }
    });

    const newUserMsg = { id: Date.now().toString(), role: "user", content: promptText };
    setMessages(prev => [...prev, newUserMsg]);

    try {
      const { data } = await axiosInstance.post(RUN_AI_TOOL, {
        toolSlug,
        promptData: form
      });
      
      const newAsstMsg = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.response 
      };
      setMessages(prev => [...prev, newAsstMsg]);
    } catch (error) {
      const errMessage = error.response?.data?.message || "Failed to run tool";
      errorToast(errMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `❌ Error: ${errMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!tool) return null;

  return (
    <div className="tool-runner-page">
      <SubHeader 
        title={tool.name} 
        subTitle={tool.description || tool.desc}
        onBack={() => navigate("/tools")}
      />

      <div className="tool-runner-layout">
        {/* Left pane: Form Inputs */}
        <div className="tool-runner-sidebar">
          <div className="runner-form">
            <h3 className="runner-form__title">Tool Parameters</h3>
            {tool.fields.map(field => {
              if (field.type === "textarea") {
                return (
                  <TextAreaField
                    key={field.name}
                    name={field.name}
                    title={field.label}
                    value={form[field.name] || ""}
                    onChange={handleInputChange}
                    required={field.required}
                    rows={6}
                  />
                );
              }
              if (field.type === "file") {
                return (
                  <div key={field.name} style={{ marginBottom: "20px" }}>
                    <UploadField
                      title={field.label}
                      name={field.name}
                      accept=".pdf"
                      beforeUpload={(file) => {
                        handlePdfUpload({ file });
                        return false; 
                      }}
                      disabled={uploadingPdf}
                      helperText={uploadingPdf ? "Extracting text from PDF..." : "Upload a PDF to auto-fill text below."}
                    />
                  </div>
                );
              }
              return (
                <InputField
                  key={field.name}
                  name={field.name}
                  title={field.label}
                  value={form[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              );
            })}
            <ButtonComponent
              variant="primary"
              size="lg"
              onClick={handleRunTool}
              loading={loading}
              className="runner-form__submit"
            >
              Run AI Tool
            </ButtonComponent>
          </div>
        </div>

        {/* Right pane: Chat/Results */}
        <div className="tool-runner-main">
          <ChatStructure
            messages={messages}
            loading={loading}
            disabled={true} 
            emptyText={`Fill out the parameters on the left and click "Run AI Tool" to see the results here.`}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolRunner;
