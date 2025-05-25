import { getConnection } from '../lib/db';

export default function Home({ forts }) {
  return (
   <div className="forts-page">
      {/* Banner Section */}
      <div className="banner">
        <div className="banner-overlay">
          <h1 className="banner-title">Forts of Maharashtra</h1>
          <p className="banner-subtitle">Discover the glory of Maratha Empire</p>
        </div>
      </div>

      {/* Forts List */}
      <div className="forts-grid">
        {forts.map((fort) => (
          <div className="fort-card" key={fort.id}>
            <img
              src={`data:image/jpeg;base64,${fort.image}`}
              alt={fort.name}
              className="fort-image"
            />
            <div className="fort-content">
              <h2 className="fort-name">{fort.name}</h2>
              <p className="fort-location">{fort.location}</p>
              <p className="fort-description">{fort.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const connection = await getConnection();
  const [rows] = await connection.query(
    "SELECT id, name, location, description, TO_BASE64(image) as image FROM forts"
  );
  await connection.end();
  return { props: { forts: rows } };
}
