import SubHeader from "../../components/SubHeader/SubHeader";

const AdminAuditLogs = () => {
  return (
    <div>
      <SubHeader 
        title="Audit Logs" 
        subTitle="Track admin and user actions for security."
        showBack={false}
      />
      <div style={{ padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <p>System audit logs go here...</p>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
