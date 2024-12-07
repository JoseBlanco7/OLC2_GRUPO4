import Swal from "sweetalert2";
import { useState, useRef } from "react";
//import CodeMirror from "@uiw/react-codemirror";
//import { javascript } from "@codemirror/lang-javascript";
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
  const [text, setText] = useState<string>(""); 
  const [consoleOutput, setConsoleOutput] = useState<string>(""); // Salida de la consola
  const [messageType, setMessageType] = useState<string>(""); 
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isReportsDropdownOpen, setReportsDropdownOpen] =
    useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  // Obtener los números de línea para el editor
  const getLineNumbers = (): string => {
    const lines = text.split("\n").length;
    return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  };
  const handleScroll = (): void => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  // Función para ejecutar el parser
  const handleParse = (inputText?: string) => {
    const textToParse = inputText || text; 

    try {
      const result: ParserError | string = parseInput(textToParse);

      if (
        typeof result !== "string" &&
        (result as ParserError).name === "SyntaxError"
      ) {
        const error = result as ParserError;
        const { line, column } = error.location.start;
        const expected =
          error.expected
            ?.map(
              (exp: { type: string; text?: string; description?: string }) =>
                exp.text || exp.description
            )
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
        setConsoleOutput(
          `✅ Resultado del parser:\n${JSON.stringify(result, null, 2)}`
        );
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
            <button
              className="btn btn-primary me-3"
              onClick={() => handleParse()}
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
                  border: "2px solid #ced4da",
                }}
                value={text}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setText(newValue); 
                  handleParse(newValue); 
                }}
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
              style={{
                minHeight: "400px",
                overflow: "hidden",
              }}
            >
              <pre
                className="m-0 text-center w-100"
                style={{
                  fontSize: "37",
                  whiteSpace: "pre-wrap", 
                  overflow: "hidden", 
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