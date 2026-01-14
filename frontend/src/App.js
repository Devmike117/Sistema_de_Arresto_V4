import React, { useState } from "react";
import Loader from "./components/Loader";
import RegisterForm from "./components/RegisterForm";
import FacialCapture from "./components/FacialCapture";
import FingerprintScan from "./components/FingerprintScan";
import Dashboard from "./components/Dashboard";
import Notification from "./components/Notification";
import FacialSearch from "./components/FacialSearch";
import SearchPeople from "./components/SearchPeople";
import Login from "./components/Login";
import './styles/global.css';
import HistoryArrestModal from "./components/HistoryArrestModal";
import { API_BASE_URL } from "./config"; // Importar la URL base

function App() {
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const [personData, setPersonData] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [fingerprintFile, setFingerprintFile] = useState(null);

  const [message, setMessage] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false); // Nuevo estado para mostrar el login

  const handleLoaderFinish = () => setLoading(false);

  // Cerrar sesión de administrador
  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentSection(0); // Vuelve a una sección por defecto, ej: "Buscar Personas"
    setMessage({ type: 'success', text: 'Sesión cerrada correctamente.' });
  };

  // Guardar datos de RegisterForm
  const handleNextFromRegister = (data) => {
    setPersonData(data);
    setCurrentSection(3);
    setMessage({ type: "success", text: "Datos guardados. Ahora captura foto y huellas." });
  };

  // Registrar persona y biometría
  const handleRegister = async () => {
    if (!personData) {
      setMessage({ type: "error", text: "Primero guarda los datos de la persona." });
      return;
    }

    const formData = new FormData();
    Object.keys(personData).forEach((key) => {
      const val = typeof personData[key] === "boolean" ? String(personData[key]) : personData[key] || "";
      formData.append(key, val);
    });

    if (photoFile) formData.append("photo", photoFile);
    if (fingerprintFile) formData.append("fingerprint", fingerprintFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `¡Registrado correctamente! ID: ${data.personId}` });
        setPersonData(null);
        setPhotoFile(null);
        setFingerprintFile(null);
        {/*Al terminar el registro y k¿mostrar el mensaje mandar a la sección de inicio */}
        setCurrentSection(null);
        setCurrentSection(0);

      } else {
        setMessage({ type: "error", text: data.error || "Error al registrar." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error al registrar. Revisa la consola." });
    }
  };

let sections = [
  {
    id: "inicio",
    title: "Búsqueda Facial",
    icon: <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}>frame_person</span>,
    content: <FacialSearch onMessage={setMessage} />,
  },
  {
    id: "buscar",
    title: "Buscar Personas",
    icon: <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}>group_search</span>,
    content: <SearchPeople onMessage={setMessage} HistoryArrestModal={HistoryArrestModal} />,
  },
  {
    id: "registro",
    title: "Registro",
    icon: <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}>person_add</span>,
    content: <RegisterForm onNext={handleNextFromRegister} onMessage={setMessage} />,
  },
  {
    id: "biometria",
    title: "Biometría",
    icon: <span className="material-symbols-outlined">familiar_face_and_zone</span>,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        {/* Contenedor de secciones izquierda/derecha */}
        {/* comentar la seccion de huella dactilar, no se cuenta con el dispositivo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            gap: '2rem',
          }}
        >
          {/* Izquierda: Facial */}
          <div style={{ ...styles.biometricContainer, flex: 1, maxWidth: '600px' }}>
            <FacialCapture
              photoFile={photoFile}
              setPhotoFile={setPhotoFile}
              onMessage={setMessage}
            />
          </div>

          {/* Derecha: Huella - COMENTADO: No se cuenta con el dispositivo */}
          {/* <div style={{ ...styles.biometricContainer, flex: 1 }}>
            <FingerprintScan
              fingerprintFile={fingerprintFile}
              setFingerprintFile={setFingerprintFile}
              onMessage={setMessage}
            />
          </div> */}
        </div>

        {/* Botón centrado */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            onClick={handleRegister}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
            style={{
              ...styles.registerButton,
              ...(loading ? styles.registerButtonDisabled : {}),
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <span style={styles.buttonIcon}>
              {loading ? (
                <span
                  className="material-symbols-outlined"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  autorenew
                </span>
              ) : (
                <span className="material-symbols-outlined">person_add</span>
              )}
            </span>
            {loading ? "Registrando..." : "Registrar Persona"}
          </button>
        </div>
      </div>
    ),
      },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}>dashboard</span>,
      content: <Dashboard onMessage={setMessage} />,
    },
  ];

  if (loading) return <Loader onFinish={handleLoaderFinish} />;

  // Si se hace clic en el botón de admin, muestra la página de Login
  if (showAdminLogin) {
    return (
      <>
        <Notification message={message} onClose={() => setMessage(null)} />
        <Login
          onLogin={() => {
            setIsAdminAuthenticated(true);
            setShowAdminLogin(false); // Oculta el login y vuelve a la app
            setCurrentSection(4); // ir a la seccion de busqueda facial
          }}
          onMessage={setMessage}
          onBack={() => setShowAdminLogin(false)} // <-- Añadido: para volver a la app
        />
      </>
    );
  }

  if (!started)
    return (
      <main style={styles.welcomeContainer}>
        <div style={styles.welcomeOverlay}>
          <div style={styles.welcomeCard}>
            <div style={styles.welcomeTopLine}></div>
            <div style={styles.welcomeLogoSection}>
              <div style={styles.welcomeLogoCircle}>
                <span className="material-symbols-outlined" style={styles.welcomeLogoIcon}>
                  security
                </span>
              </div>
            </div>
            <h1 style={styles.welcomeTitle}>
              Sistema Modular para la Gestión Operativa
            </h1>
            <div style={styles.welcomeDivider}></div>
            <h2 style={styles.welcomeSubtitle}>
              Centros de Comando Municipal
            </h2>
            <p style={styles.welcomeDescription}>
              Sistema de identificación biométrica para la gestión operativa y control de arrestos
            </p>
            <button 
              onClick={() => setStarted(true)} 
              style={styles.welcomeButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(58, 123, 213, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(58, 123, 213, 0.5)';
              }}
            >
              <span style={styles.buttonText}>Acceder al Sistema</span>
              <span className="material-symbols-outlined" style={styles.buttonIcon}>arrow_forward</span>
            </button>
            <div style={styles.welcomeFooter}>
              <span style={styles.welcomeFooterIcon} className="material-symbols-outlined">verified_user</span>
              <span style={styles.welcomeFooterText}>Sistema Seguro</span>
              
              <span style={styles.welcomeFooterText}>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </main>
    );

  return (
    <main style={styles.container}>
      <Notification message={message} onClose={() => setMessage(null)} />

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              {/* imagen logo */}
              <img
                src="https://th.bing.com/th/id/R.eb6e5629278a9adf8ffd6d85998747d0?rik=Syphi5ks4Z7ljA&riu=http%3a%2f%2fbe32.mx%2fjsons%2fimg%2fclientes%2fgdhfe-32.jpg&ehk=RPMsfcqAXz8my3Wi2%2bvR0cuElqjAHwjmUzytVmahTVo%3d&risl=&pid=ImgRaw&r=0"
                alt="Logo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <h1 style={styles.title}>Sistema Modular de Comando</h1>
          </div>
          <nav style={styles.nav}>
            {sections
              .filter(sec => isAdminAuthenticated || sec.id !== 'dashboard')
              .map((sec) => {
                const originalIndex = sections.findIndex(s => s.id === sec.id);
                return (
                  <button
                    key={sec.id}
                    style={{ ...styles.navButton, ...(currentSection === originalIndex ? styles.navButtonActive : {}) }}
                    onClick={() => setCurrentSection(originalIndex)}
                  >
                    <span style={styles.navIcon}>{sec.icon}</span>
                    <span style={styles.navText}>{sec.title}</span>
                  </button>
                );
              })}
            {/* Botón condicional: Administrador o Cerrar Sesión */}
            {isAdminAuthenticated ? (
              <button
                style={{
                  ...styles.navButton,
                  background: 'rgba(211, 47, 47, 0.3)',
                  border: '1px solid rgba(211, 47, 47, 0.5)',
                  padding: '0.5rem', // Padding reducido
                  width: '40px',     // Ancho fijo
                  height: '40px',    // Altura fija
                  borderRadius: '50%', // Lo hacemos circular
                  justifyContent: 'center', // Centramos el ícono
                }}
                onClick={handleLogout}
                title="Cerrar Sesión" // Tooltip para accesibilidad
              >
                <span style={styles.navIcon}>
                  <span className="material-symbols-outlined">logout</span>
                </span>
                {/* <span style={styles.navText}>Cerrar Sesión</span> */}
              </button>
            ) : (
              <button
                style={{
                  ...styles.navButton,
                  background: 'rgba(58, 123, 213, 0.2)',
                  border: '1px solid rgba(58, 123, 213, 0.4)',
                }}
                onClick={() => setShowAdminLogin(true)}
              >
                <span style={styles.navIcon}>
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </span>
                <span style={styles.navText}>Administrador</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{sections[currentSection].title}</h2>
        </div>
        <div style={styles.sectionContent}>
          {sections[currentSection].content}
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Sistema Modular de Comando. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

const styles = {
  // Welcome Screen
  welcomeContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2c3e50 0%, #4b6cb7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  welcomeOverlay: {
    width: "100%",
    maxWidth: "700px",
    padding: "2rem"
  },
  welcomeCard: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(25px)",
    borderRadius: "20px",
    padding: "3.5rem 3rem",
    textAlign: "center",
    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    position: "relative",
    overflow: "hidden"
  },
  welcomeTopLine: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: "3px",
    background: "linear-gradient(90deg, transparent, #00d2ff, transparent)",
    borderRadius: "0 0 3px 3px"
  },
  welcomeLogoSection: {
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "center"
  },
  welcomeLogoCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(58, 123, 213, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%)",
    border: "2px solid rgba(0, 210, 255, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 40px rgba(58, 123, 213, 0.3), inset 0 0 20px rgba(0, 210, 255, 0.1)"
  },
  welcomeLogoIcon: {
    fontSize: "3.5rem",
    color: "#00d2ff",
    filter: "drop-shadow(0 0 10px rgba(0, 210, 255, 0.5))"
  },
  welcomeIconContainer: {
    display: "inline-block",
    background: "linear-gradient(135deg, rgba(58, 123, 213, 0.3) 0%, rgba(0, 210, 255, 0.3) 100%)",
    borderRadius: "50%",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 10px 30px rgba(58, 123, 213, 0.4)"
  },
  welcomeIcon: {
    fontSize: "4rem",
    color: "#fff",
    display: "block"
  },
  welcomeTitle: {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "1.5rem",
    textShadow: "0 3px 15px rgba(0, 0, 0, 0.4)",
    lineHeight: "1.3",
    letterSpacing: "-0.3px"
  },
  welcomeDivider: {
    width: "80px",
    height: "3px",
    background: "linear-gradient(90deg, #3a7bd5, #00d2ff)",
    margin: "0 auto 1.5rem",
    borderRadius: "3px",
    boxShadow: "0 0 10px rgba(0, 210, 255, 0.5)"
  },
  welcomeSubtitle: {
    fontSize: "1.5rem",
    color: "#00d2ff",
    marginBottom: "1rem",
    fontWeight: "600",
    letterSpacing: "0.3px",
    textShadow: "0 2px 10px rgba(0, 210, 255, 0.3)"
  },
  welcomeDescription: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.75)",
    marginBottom: "2.5rem",
    fontWeight: "300",
    lineHeight: "1.6",
    maxWidth: "500px",
    margin: "0 auto 2.5rem"
  },
  featureList: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginBottom: "2rem",
    flexWrap: "wrap"
  },
  featureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    minWidth: "120px",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "500"
  },
  featureItemIcon: {
    fontSize: "2rem",
    color: "#00d2ff"
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "2rem"
  },
  feature: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#fff",
    fontSize: "0.95rem"
  },
  featureIcon: {
    fontSize: "1.5rem"
  },
  welcomeButton: {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "1.1rem 2.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(58, 123, 213, 0.5)",
    transition: "all 0.3s ease",
    outline: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.8rem",
    letterSpacing: "0.5px",
    position: "relative",
    overflow: "hidden"
  },
  buttonText: {
    position: "relative",
    zIndex: 1
  },
  buttonIcon: {
    fontSize: "1.3rem",
    transition: "transform 0.3s ease"
  },
  welcomeFooter: {
    marginTop: "2.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.85rem"
  },
  welcomeFooterIcon: {
    fontSize: "1.2rem",
    color: "#00d2ff"
  },
  welcomeFooterText: {
    fontWeight: "400"
  },

  // Main App
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2c3e50 0%, #4b6cb7 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column"
  },

  // Header
  header: {
    background: "rgba(10, 25, 41, 0.5)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "0.6rem 1.5rem",
    position: "sticky",
    top: 0,
    zIndex: 100
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    height: "32px"
  },
  logo: {
    fontSize: "2rem",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "0.5rem",
    borderRadius: "12px"
  },
  title: {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
  },
  nav: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap"
  },
  navButton: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    padding: "0.45rem 0.8rem",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.82rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease",
    outline: "none",
    boxShadow: "none",
  },

  // Estilo activo para el botón de navegación
  navButtonActive: {
    background: "linear-gradient(135deg, #3a7bd5 0%, #092f37 100%)",
    border: "1px solid #ffffff19",
    boxShadow: "0 4px 15px rgba(38, 82, 144, 0.4)",
    outline: "none",
  },

  navIcon: {
    fontSize: "1.05rem"
  },
  navText: {
    fontSize: "0.82rem"
  },

  // Section
  section: {
    flex: 1,
    padding: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%"
  },
  sectionHeader: {
    marginBottom: "2rem"
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#fff",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
  },
  sectionContent: {
    background: "rgba(10, 25, 41, 0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  },

  // Biometric Container
  biometricContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    alignItems: "start"
  },
  registerButton: {
    background: 'linear-gradient(135deg, #3a7bd5 0%, #3c4ae3 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 15px rgba(38, 82, 144, 0.4)',
    transition: 'all 0.3s ease',
    outline: 'none',
    whiteSpace: 'nowrap'
  },

  // Footer
  footer: {
    background: "rgba(10, 25, 41, 0.6)",
    padding: "1.5rem",
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
    margin: 0
  }
};

export default App;