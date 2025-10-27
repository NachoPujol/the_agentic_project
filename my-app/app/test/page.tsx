export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Test Page Works!</h1>
      <p>If you see this, routing is working correctly.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
