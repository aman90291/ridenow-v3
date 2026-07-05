const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>RideNow — Rider</h1>
      <p>Scaffold is live. Feature stories build the rider flow on top of this.</p>
      <p>
        Backend health: <code>{`${API_URL}/healthz`}</code>
      </p>
    </main>
  );
}
