import { useState, useEffect } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { errorToast, successToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { AGENTS_LIST, AGENTS_GET, AGENTS_RUN } from "../../utils/apiPath";
import { PlayCircleOutlined, LoadingOutlined, CheckCircleOutlined, RobotOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import "./Agents.scss";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [inputs, setInputs] = useState({});
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    axiosInstance.get(AGENTS_LIST)
      .then(({ data }) => setAgents(data))
      .catch(() => errorToast("Failed to load agents"))
      .finally(() => setLoading(false));
  }, []);

  const openAgent = (agent) => {
    setSelected(agent);
    setInputs({});
    setResult(null);
    setCurrentStep(0);
  };

  const closeModal = () => { setSelected(null); setResult(null); };

  const handleRun = async () => {
    if (!selected) return;
    for (const f of selected.inputFields || []) {
      if (f.required && !inputs[f.name]?.trim()) {
        errorToast(`"${f.label}" is required`); return;
      }
    }
    setRunning(true);
    setCurrentStep(1);
    try {
      const { data } = await axiosInstance.post(AGENTS_RUN, { agentId: selected._id, inputs });
      setResult(data);
      successToast("Agent completed successfully!");
    } catch (err) {
      errorToast(err?.response?.data?.message || "Agent run failed");
    } finally { setRunning(false); setCurrentStep(0); }
  };

  if (loading) return <div className="agents-page"><div className="agents-loading">Loading agents...</div></div>;

  return (
    <div className="agents-page">
      <SubHeader
        title="AI Agents"
        subTitle="Automated multi-step AI workflows that chain tasks together."
        showBack={false}
      />

      {agents.length === 0 ? (
        <div className="agents-empty">
          <RobotOutlined style={{ fontSize: 48, color: "#cbd5e1", marginBottom: 12 }} />
          <p>No agents available yet. Ask your admin to create some!</p>
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card" onClick={() => openAgent(agent)}>
              <div className="agent-card__icon">{agent.icon || "🤖"}</div>
              <div className="agent-card__body">
                <div className="agent-card__name">{agent.name}</div>
                <div className="agent-card__desc">{agent.description}</div>
                <div className="agent-card__meta">
                  {agent.steps?.length || 0} steps &nbsp;·&nbsp; {agent.planRequired} plan
                  {agent.industryId && <> &nbsp;·&nbsp; {agent.industryId.icon} {agent.industryId.name}</>}
                </div>
              </div>
              <div className="agent-card__run">
                <PlayCircleOutlined /> Run
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Run Modal */}
      <Modal
        open={!!selected}
        onCancel={closeModal}
        footer={null}
        title={null}
        width={680}
        destroyOnHide
      >
        {selected && (
          <div className="agent-modal">
            <div className="agent-modal__header">
              <span className="agent-modal__icon">{selected.icon}</span>
              <div>
                <div className="agent-modal__title">{selected.name}</div>
                <div className="agent-modal__desc">{selected.description}</div>
              </div>
            </div>

            {/* Steps preview */}
            <div className="agent-modal__steps">
              {selected.steps?.map((step) => (
                <div key={step.stepNumber} className={`step-item ${running && currentStep === step.stepNumber ? "is-active" : ""} ${result ? "is-done" : ""}`}>
                  <div className="step-item__num">
                    {result ? <CheckCircleOutlined style={{ color: "#10b981" }} /> : running && currentStep === step.stepNumber ? <LoadingOutlined style={{ color: "#6c47ff" }} /> : step.stepNumber}
                  </div>
                  <div className="step-item__label">{step.name}</div>
                  {result && <div className="step-item__var">→ <code>{step.outputVariable}</code></div>}
                </div>
              ))}
            </div>

            {/* Input fields */}
            {!result && (
              <div className="agent-modal__form">
                {(selected.inputFields || []).map((f) => (
                  <div key={f.name} className="agent-form-field">
                    <label>{f.label}{f.required && <span style={{ color: "#ef4444" }}> *</span>}</label>
                    {f.type === "textarea" ? (
                      <textarea placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs((p) => ({ ...p, [f.name]: e.target.value }))} rows={4} />
                    ) : f.type === "select" ? (
                      <select value={inputs[f.name] || ""} onChange={(e) => setInputs((p) => ({ ...p, [f.name]: e.target.value }))}>
                        <option value="">Select...</option>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="text" placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs((p) => ({ ...p, [f.name]: e.target.value }))} />
                    )}
                  </div>
                ))}

                <ButtonComponent variant="primary" style={{ width: "100%", marginTop: 8 }} loading={running} onClick={handleRun}>
                  {running ? `Running Step ${currentStep}...` : "Run Agent"}
                </ButtonComponent>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="agent-modal__results">
                <div className="results-meta">
                  Tokens: <strong>{result.totalTokensUsed}</strong> &nbsp;·&nbsp;
                  Cost: <strong>₹{result.totalCostInr}</strong> (${result.totalCostUsd})
                </div>
                {result.stepResults?.map((step) => (
                  <div key={step.stepNumber} className="result-block">
                    <div className="result-block__header">
                      <CheckCircleOutlined style={{ color: "#10b981" }} />
                      <span>{step.stepName}</span>
                      <span className="result-block__cost">₹{step.costInr}</span>
                    </div>
                    <pre className="result-block__content">{step.response}</pre>
                  </div>
                ))}
                <ButtonComponent variant="outline" style={{ width: "100%", marginTop: 12 }} onClick={() => { setResult(null); setInputs({}); }}>
                  Run Again
                </ButtonComponent>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Agents;
