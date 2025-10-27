export default function Page() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>The Agentic Project</h1>
      <p>Website is loading correctly!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
