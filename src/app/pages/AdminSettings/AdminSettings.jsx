import SubHeader from "../../components/SubHeader/SubHeader";

const AdminSettings = () => {
  return (
    <div>
      <SubHeader 
        title="Platform Settings" 
        subTitle="Configure global platform preferences."
        showBack={false}
      />
      <div style={{ padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <p>Global system configurations go here...</p>
      </div>
    </div>
  );
};

export default AdminSettings;
