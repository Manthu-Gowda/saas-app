import SubHeader from "../../components/SubHeader/SubHeader";

const AdminAnalytics = () => {
  return (
    <div>
      <SubHeader 
        title="Analytics & Reporting" 
        subTitle="Detailed metrics and trends for the platform."
        showBack={false}
      />
      <div style={{ padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <p>Analytics dashboards and Recharts components go here...</p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
