Inicio
  = _ head:Regla tail:(salto+ _ @Regla)* _ ";"? salto* {
    console.log("Gramática reconocida correctamente");
    return "Gramática reconocida correctamente";
  }


Regla
  = head:Identificador _ "\n" _ "=" _ expr:Expresion _ ";"? {
    return { nombre: head, expresion: expr };
  }

Expresion
  = Alternativa

Alternativa
  = Secuencia ((" " / salto _)* "/" _ Secuencia)* _ ";"?

Secuencia
  = Repeticion+

Repeticion
  = grp:Grupo _ "*" _ ";"? { return { tipo: "repeticion", modo: "cero_o_mas", valor: grp }; }
  / grp:Grupo _ "+" _ ";"? { return { tipo: "repeticion", modo: "una_o_mas", valor: grp }; }
  / grp:Grupo _ "?" _ ";"? { return { tipo: "repeticion", modo: "opcional", valor: grp }; }
  / Grupo

Grupo
  = "(" _ alt:Alternativa _ ")" _ { return { tipo: "grupo", valor: alt }; }
  / Elemento

Elemento
  = Basica
  / Rango

Basica
  = Identificador _ ";"?
  / Literal _ ";"?

Literal
  = "\"" chars:[^"]* "\"" { return { tipo: "literal", valor: chars.join("") }; }
  / "'" chars:[^']* "'" { return { tipo: "literal", valor: chars.join("") }; }

Rango
  = "[" chars:(conguion / conjunto)+ "]" _ ";"? {
    return { tipo: "rango", valor: chars };
  }

conguion
  = start:[^-\]] "-" end:[^-\]] {
    return { tipo: "rango", inicio: start, fin: end };
  }

conjunto
  = char:[^\]] {
    return { tipo: "caracter", valor: char };
  }

// Tokens
Identificador "identificador"
  = [a-zA-Z][_a-zA-Z0-9]* { return text(); } 

_ "whitespace or comments"
  = (whitespace / comentario)*

whitespace
  = [ \t\r]+

comentario
  = "//" [^\n]* salto?
  / "/" [^]* "*/"

salto
  = "\n" _ ";"? _