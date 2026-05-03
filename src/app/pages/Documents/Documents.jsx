import { useState, useEffect, useRef } from "react";
import SubHeader from "../../components/SubHeader/SubHeader";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { errorToast, successToast } from "../../services/ToastHelper";
import axiosInstance from "../../services/axiosInstance";
import { RAG_UPLOAD, RAG_LIST_DOCS, RAG_DELETE_DOC, RAG_QUERY } from "../../utils/apiPath";
import { UploadOutlined, DeleteOutlined, FileTextOutlined, SearchOutlined, SendOutlined, ThunderboltOutlined, FontSizeOutlined } from "@ant-design/icons";
import { Tooltip, Spin } from "antd";
import "./Documents.scss";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [querying, setQuerying] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const fileRef = useRef();

  const fetchDocs = async () => {
    try {
      const { data } = await axiosInstance.get(RAG_LIST_DOCS);
      setDocs(data);
    } catch { errorToast("Failed to load documents"); }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.type)) {
      errorToast("Only PDF and TXT files are supported");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await axiosInstance.post(RAG_UPLOAD, form, { headers: { "Content-Type": "multipart/form-data" } });
      successToast(`"${file.name}" uploaded and indexed successfully`);
      fetchDocs();
    } catch (err) {
      errorToast(err?.response?.data?.message || "Upload failed");
    } finally { setUploading(false); }
  };

  const handleDelete = async (docId, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(docId);
    try {
      await axiosInstance.delete(RAG_DELETE_DOC(docId));
      successToast("Document deleted");
      setDocs((d) => d.filter((doc) => doc._id !== docId));
    } catch { errorToast("Failed to delete document"); }
    finally { setDeletingId(null); }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    if (!docs.length) { errorToast("Upload at least one document first"); return; }
    setQuerying(true);
    setAnswer(null);
    try {
      const { data } = await axiosInstance.post(RAG_QUERY, { query });
      setAnswer(data);
    } catch (err) {
      errorToast(err?.response?.data?.message || "Query failed");
    } finally { setQuerying(false); }
  };

  return (
    <div className="documents-page">
      <SubHeader
        title="Document Intelligence"
        subTitle="Upload documents and ask AI questions grounded in your content."
        showBack={false}
      >
        <div>
          <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: "none" }} onChange={handleFileChange} />
          <ButtonComponent variant="primary" loading={uploading} onClick={() => fileRef.current?.click()}>
            <UploadOutlined style={{ marginRight: 6 }} /> Upload Document
          </ButtonComponent>
        </div>
      </SubHeader>

      {/* Query Box */}
      <div className="rag-query-box">
        <div className="rag-query-box__icon"><SearchOutlined /></div>
        <input
          className="rag-query-box__input"
          placeholder="Ask a question about your documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuery()}
        />
        <button className="rag-query-box__btn" onClick={handleQuery} disabled={querying || !query.trim()}>
          {querying ? <Spin size="small" /> : <SendOutlined />}
        </button>
      </div>

      {/* Answer */}
      {(querying || answer) && (
        <div className="rag-answer-card">
          {querying ? (
            <div className="rag-answer-card__loading"><Spin /> <span>Searching documents and generating answer...</span></div>
          ) : (
            <>
              <div className="rag-answer-card__response">{answer.answer}</div>
              {answer.sources?.length > 0 && (
                <div className="rag-answer-card__sources">
                  <p className="sources-title">
                    Sources used
                    <span className={`search-mode-badge ${answer.searchMode}`}>
                      {answer.searchMode === "semantic"
                        ? <><ThunderboltOutlined /> Semantic</>
                        : <><FontSizeOutlined /> Keyword</>}
                    </span>
                  </p>
                  {answer.sources.map((s, i) => (
                    <div key={i} className="source-item">
                      <FileTextOutlined style={{ color: "#6c47ff", marginRight: 6 }} />
                      <strong>{s.documentName}</strong>
                      {s.similarityScore !== undefined && (
                        <span className="source-item__score">{Math.round(s.similarityScore * 100)}% match</span>
                      )}
                      <span> — "{s.excerpt}"</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="rag-answer-card__meta">
                Tokens used: <strong>{answer.tokensUsed}</strong> &nbsp;|&nbsp;
                Cost: <strong>₹{answer.costInr}</strong> (${answer.costUsd})
              </div>
            </>
          )}
        </div>
      )}

      {/* Document List */}
      <div className="documents-section">
        <h3 className="documents-section__title">Your Documents ({docs.length})</h3>
        {docs.length === 0 ? (
          <div className="documents-empty">
            <FileTextOutlined style={{ fontSize: 40, color: "#cbd5e1", marginBottom: 12 }} />
            <p>No documents yet. Upload a PDF or TXT file to get started.</p>
          </div>
        ) : (
          <div className="documents-grid">
            {docs.map((doc) => (
              <div key={doc._id} className="doc-card">
                <div className="doc-card__icon"><FileTextOutlined /></div>
                <div className="doc-card__info">
                  <div className="doc-card__name">{doc.name}</div>
                  <div className="doc-card__meta">
                    {formatSize(doc.size)} &nbsp;·&nbsp; {doc.chunkCount} chunks &nbsp;·&nbsp;
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Tooltip title="Delete">
                  <button
                    className="doc-card__delete"
                    onClick={() => handleDelete(doc._id, doc.name)}
                    disabled={deletingId === doc._id}
                  >
                    {deletingId === doc._id ? <Spin size="small" /> : <DeleteOutlined />}
                  </button>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
