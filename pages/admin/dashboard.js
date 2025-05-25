import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [forts, setForts] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', description: '', image: null, id: null });

  const fetchForts = async () => {
    const res = await fetch('/api/forts');
    const data = await res.json();
    console.log("data", data)
    setForts(data);
  };

  useEffect(() => {
    fetchForts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));

    const url = form.id ? '/api/edit-fort' : '/api/add-fort';
    await fetch(url, { method: 'POST', body: formData });
    setForm({ name: '', location: '', description: '', image: null, id: null });
    fetchForts();
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Fort Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setForm({ ...form, image: file });

            const reader = new FileReader();
            reader.onloadend = () => {
              setForm(prev => ({ ...prev, preview: reader.result }));
            };
            if (file) reader.readAsDataURL(file);
          }}
        />
        {form.preview && (
          <img src={form.preview} alt="Preview" style={{ marginTop: 10 }} />
        )}

        <button type="submit">{form.id ? 'Update' : 'Add'} Fort</button>
      </form>

      <h2>Existing Forts</h2>
      {forts.map(f => (
        <div key={f.id} className="fort">
          <h3>{f.name}</h3>
          <p>{f.location}</p>
          <p>{f.description}</p>
          <p><img src={`data:image/jpeg;base64,${f.fortImage}`} alt={f.name} width={100}/></p>
          <button onClick={() => setForm({ ...f, preview: `data:image/jpeg;base64,${f.fortImage}` })}>Edit</button>
          <button onClick={() => handleDelete(f.id)} className="delete-btn">Delete</button>
        </div>
      ))}
    </div>

  );
}
