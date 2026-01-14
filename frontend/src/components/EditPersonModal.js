import React, { useState, useEffect } from 'react';

export default function EditPersonModal({ person, onClose, onSave, onMessage }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Esta función se asegura de que el formulario se llene
    // cada vez que el modal se abre con una nueva persona.
    if (person) {
      setFormData({
        id: person.id || '',
        first_name: person.first_name || '',
        last_name: person.last_name || '',
        alias: person.alias || '',
        dob: person.dob ? new Date(person.dob).toISOString().split('T')[0] : '',
        gender: person.gender || '',
        nationality: person.nationality || 'Mexicana',
        observaciones: person.observaciones || ''
      });
    }
  }, [person]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      if (onMessage) onMessage({ type: 'error', text: 'El nombre y el apellido no pueden estar vacíos.' });
      return;
    }
    onSave(formData);
  };

  if (!person) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.iconContainer}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.8rem', color: '#fff' }}>edit</span>
            </div>
            <div>
              <h2 style={styles.title}>Editar Persona</h2>
              <p style={styles.subtitle}>
                Modificando a: {person.first_name} {person.last_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeButton}>✖</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nombres *</label>
              <input name="first_name" value={formData.first_name || ''} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Apellidos *</label>
              <input name="last_name" value={formData.last_name || ''} onChange={handleChange} style={styles.input} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Alias</label>
              <input name="alias" value={formData.alias || ''} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Fecha de Nacimiento</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Género</label>
              <select name="gender" value={formData.gender || ''} onChange={handleChange} style={styles.select}>
                <option value="">Selecciona Género</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Nacionalidad</label>
              <select name="nationality" value={formData.nationality || 'Mexicana'} onChange={handleChange} style={styles.select}>
                <option>Mexicana</option>
                <option>Extranjera</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Observaciones (Señas Particulares)</label>
            <textarea name="observaciones" value={formData.observaciones || ''} onChange={handleChange} style={styles.textarea} rows="3" />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancelar</button>
            <button type="submit" style={styles.saveButton}>Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1001,
    padding: "1rem"
  },
  modal: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    fontFamily: "'Inter', sans-serif",
    color: '#fff'
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.5rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  iconContainer: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "0.75rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.8)",
    margin: "0.25rem 0 0 0",
  },
  closeButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#fff",
    transition: "all 0.2s ease",
  },
  form: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: 1,
  },
  row: {
    display: "flex",
    gap: "1rem",
    flexWrap: 'wrap'
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit"
  },
  select: {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit"
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "0.5rem",
    justifyContent: "flex-end"
  },
  cancelButton: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    padding: "0.75rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  saveButton: {
    background: "linear-gradient(135deg, #3a7bd5 0%, #3c4ae3 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.75rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(79, 172, 254, 0.4)",
    transition: "all 0.3s ease",
  }
};