import { useState } from "react";
import Swal from "sweetalert2";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import usacLogo from "./assets/usac.svg";
import parseInput from "./lib/parser"; // Importar el parser
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Tipo para el resultado del parser
type ParserError = {
  name: string;
  location: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
    end: {
      line: number;
      column: number;
      offset: number;
    };
  };
  expected?: { type: string; text?: string; description?: string }[];
  found?: string | null;
  message: string;
};

function App() {
  const [editorText, setEditorText] = useState<string>(""); // Texto del editor de código
  const [consoleOutput, setConsoleOutput] = useState<string>(""); // Salida de la consola
  const [messageType, setMessageType] = useState<string>(""); // Tipo de mensaje (success o danger)
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isReportsDropdownOpen, setReportsDropdownOpen] =
    useState<boolean>(false);

  // Función para ejecutar el parser
  const handleParse = () => {
    try {
      const result: ParserError | string = parseInput(editorText); // Ejecutar el parser con el contenido del editor

      // Verificar si el resultado contiene un error
      if (typeof result !== "string" && (result as ParserError).name === "SyntaxError") {
        const error = result as ParserError; // Refinamiento de tipo
        const { line, column } = error.location.start; // Línea y columna del error
        const expected = error.expected
          ?.map((exp: { type: string; text?: string; description?: string }) => exp.text || exp.description)
          .join(", ") || "algo inesperado";
        const found = error.found || "nada";

        setMessageType("danger");
        setConsoleOutput(
          `❌ LA ENTRADA NO ES ACEPTADA.\nError encontrado:\n` +
          `  - Esperado: ${expected}\n` +
          `  - Encontrado: ${found}\n` +
          `  - Línea: ${line}, Columna: ${column}\n` +
          `Mensaje del parser: ${error.message}`
        );
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "¡Error en la ejecución!",
          text: "No se pudo parsear el código.",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      } else {
        setMessageType("success");
        setConsoleOutput(`✅ Resultado del parser:\n${JSON.stringify(result, null, 2)}`);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "¡Ejecución exitosa!",
          text: "El código se ejecutó correctamente.",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    } catch (error) {
      // Manejo de errores inesperados
      if (error instanceof Error) {
        setConsoleOutput(`❌ Error inesperado: ${error.message}`);
      } else {
        setConsoleOutput("❌ Error inesperado.");
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "¡Error en la ejecución!",
        text: "No se pudo parsear el código.",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    }
  };

  const toggleDropdown = () => {
    setReportsDropdownOpen(false);
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleReportsDropdown = () => {
    setDropdownOpen(false);
    setReportsDropdownOpen(!isReportsDropdownOpen);
  };

  return (
    <div className="min-vh-100">
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-light shadow w-90 rounded">
        <div className="container-fluid">
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
            <button className="btn btn-primary me-3" onClick={handleParse}>
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
            <CodeMirror
              value={editorText}
              extensions={[javascript()]} // Extensión para soporte de JavaScript
              onChange={(value: string) => setEditorText(value)} // Reactividad del editor
              height="400px"
              theme="light"
              className="border"
            />
          </div>

          {/* Columna derecha - Consola de salida */}
          <div className="col-md-6">
            <div className="d-flex justify-content-center p-3 fw-bold">
              <h5>Consola de Salida</h5>
            </div>
            <div
              className={`bg-light text-${messageType} border rounded p-3`}
              style={{
                minHeight: "400px",
                overflowY: "auto",
                fontSize: "18px",
              }}
            >
              <pre
                className="m-0"
                style={{
                  whiteSpace: "pre-wrap",
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
