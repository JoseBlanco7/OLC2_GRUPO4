import { useState, useRef } from "react";
import Swal from "sweetalert2";
import usacLogo from "./assets/usac.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [messageType, setMessageType] = useState(""); // Estado para manejar el tipo de mensaje
  const [text, setText] = useState<string>(""); // Estado para manejar el contenido del editor
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isReportsDropdownOpen, setReportsDropdownOpen] =
    useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string>(""); // Nuevo estado para la consola de salida
  //, setConsoleOutput
  // Refs con tipos específicos
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);

  // Obtener los números de línea para el editor
  const getLineNumbers = (): string => {
    const lines = text.split("\n").length;
    return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  };

  // Manejadores de eventos
  const handleButtonClick = (): void => {
    // mensaje que se realizo la ejecución del código con swal como notificacion a la derecha
    Swal.fire({
      position: 'top-end', // Posición en la esquina superior derecha
      icon: 'success', // Tipo de notificación (success, error, warning, info)
      title: '¡Ejecución exitosa!',
      text: 'El código se ejecutó correctamente.',
      showConfirmButton: false, // Oculta el botón de confirmación
      timer: 3000, // Tiempo en milisegundos antes de que se cierre (3 segundos)
      toast: true, // Estilo de notificación flotante
    });
    try {
      // alert(code);
      setMessageType("success");
      setConsoleOutput("El contenido es una PEG." );
    } catch (error) {
      console.error(error);
      setMessageType("danger");
      setConsoleOutput("El contenido no es una PEG.");
    }
  };

  const toggleDropdown = (): void => {
    setReportsDropdownOpen(false);
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleReportsDropdown = (): void => {
    setDropdownOpen(false);
    setReportsDropdownOpen(!isReportsDropdownOpen);
  };

  const handleScroll = (): void => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="min-vh-100 ">
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-light shadow w-90 rounded">
        <div className="container-fluid">
          {" "}
          {/* Elimina el espacio por defecto */}
          <a
            className="navbar-brand"
            href="https://portal.ingenieria.usac.edu.gt/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={usacLogo} alt="Usac logo" style={{ height: "40px" }} />
          </a>
          <div className="d-flex">
            <div className="dropdown me-3">
              <button
                className="btn btn-secondary dropdown-toggle"
                onClick={toggleDropdown}
              >
                Archivo
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu show">
                  <button className="dropdown-item">Nuevo Archivo</button>
                  <button className="dropdown-item">Abrir Archivo</button>
                  <button className="dropdown-item">Guardar</button>
                </div>
              )}
            </div>
            <button
              className="btn btn-primary me-3"
              onClick={handleButtonClick}
            >
              Ejecutar
            </button>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                onClick={toggleReportsDropdown}
              >
                Reportes
              </button>
              {isReportsDropdownOpen && (
                <div className="dropdown-menu show">
                  <button className="dropdown-item">Generar Errores</button>
                  <button className="dropdown-item">Tabla de Símbolos</button>
                  <button className="dropdown-item">Árbol</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container mt-5">
        <div className="row">
          {/* Columna izquierda - Editor de texto */}
          <div className="col-md-6">
            <div className="d-flex justify-content-center p-3 fw-bold">
              <h5>Editor de texto</h5>
            </div>
            <div className="position-relative">
              <div
                ref={lineNumbersRef}
                className="bg-light border text-end px-2 py-2 position-absolute top-0 start-0 h-100"
                style={{
                  width: "40px",
                  zIndex: 1,
                  overflow: "hidden",
                  color: "#6c757d",
                }}
              >
                <pre className="m-0">{getLineNumbers()}</pre>
              </div>
              <textarea
                ref={textareaRef}
                className="form-control"
                style={{
                  paddingLeft: "50px",
                  minHeight: "400px",
                  resize: "none",
                  border : "2px solid #ced4da"
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onScroll={handleScroll}
              ></textarea>
            </div>
          </div>

          {/* Columna derecha - Consola de salida */}
          <div className="col-md-6">
            <div className="d-flex justify-content-center p-3 fw-bold">
              <h5>Consola de Salida</h5>
            </div>
            <div
              className={`bg-light text-${messageType} border rounded p-3 d-flex align-items-center justify-content-center`}
              style={{ minHeight: "400px", overflowY: "auto", fontSize: "24px", border : "2px solid #ced4da" }}
            >
              <pre
                className="m-0 text-center w-100"
                style={{
                  whiteSpace: "pre-wrap", // Permite que el texto se ajuste automáticamente al ancho del contenedor
                  overflow: "hidden", // Elimina barras de desplazamiento adicionales
                }}
              >
                {consoleOutput}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
