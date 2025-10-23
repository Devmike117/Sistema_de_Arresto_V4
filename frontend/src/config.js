// Define la URL base de tu backend principal (Python/Flask)
// Usa la variable de entorno si existe, si no, usa la IP local.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.0.107:5000';

// Define la URL base de tu backend de embeddings (Python/embeddings)
// Cambia la IP si este servicio corre en otra máquina.
const EMBEDDING_API_URL = process.env.REACT_APP_EMBEDDING_API_URL || 'http://192.168.0.107:8001';

export { API_BASE_URL, EMBEDDING_API_URL };

// Para producción, podrías cambiar 'http://192.168.0.107:5000' por la IP de tu servidor.