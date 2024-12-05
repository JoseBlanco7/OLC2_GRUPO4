import { useState, useRef } from "react";
import Swal from "sweetalert2";
import usacLogo from "./assets/usac.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [text, setText] = useState<string>(""); // Estado para manejar el contenido del editor
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isReportsDropdownOpen, setReportsDropdownOpen] =
    useState<boolean>(false);
  const [consoleOutput] = useState<string>(""); // Nuevo estado para la consola de salida
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
    Swal.fire({
      title: "¡Acción ejecutada!",
      text: "El contenido se ha enviado.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
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
      <nav className="navbar navbar-expand-lg navbar-light shadow w-90">
        <div className="container-fluid p-0">
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
            <div className="d-flex justify-content-center">
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
                  minHeight: "200px",
                  resize: "none",
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onScroll={handleScroll}
              ></textarea>
            </div>
          </div>

          {/* Columna derecha - Consola de salida */}
          <div className="col-md-6">
            <div className="d-flex justify-content-center">
              <h5>Consola de Salida</h5>
            </div>
            <div
              className="bg-dark text-success border rounded p-3"
              style={{ minHeight: "200px", overflowY: "auto" }}
            >
              <pre className="m-0">{consoleOutput}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
