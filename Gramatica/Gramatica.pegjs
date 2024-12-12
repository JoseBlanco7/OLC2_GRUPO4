Inicio
  = _ head:Regla  tail:(salto* _ @Regla)* _ ";"? salto*    {
    console.log("Gramática reconocida correctamente");
    return "Gramática reconocida correctamente";
  }


Regla
  =  head:Identificador _ etiqueta:nombre_de_regla? _ salto2* _ "=" _ expr:Expresion _ ";"?      {
    return { nombre: head, etiqueta: etiqueta || null, expresion: expr };
  }

nombre_de_regla "Etiqueta de regla"
  = _ "\"" etiqueta:[^\"]* "\"" {
    return etiqueta.join("");
  }


Expresion
  = Alternativa

Alternativa
  = Secuencia ((" " / salto _)* "/" _ Secuencia )* _ 

Secuencia
  = Repeticion+
  
 RangoMinMax
  = min:(Numero / Identificador)? ".."? max:(Numero / Identificador)? {
      return { tipo: "rango", min: min || 0, max: max || Infinity };
    }
    
 
Repeticion
  = grp:Grupo _ "|" _ conteo:RangoConteo _ "|" _  {
      return { tipo: "repeticion", modo: "conteo", especificacion: conteo, valor: grp };
    }
  /  grp:Grupo _ "|" _ rango:RangoMinMax _  ("," _ delimitador:Grupo*)? _ "|" _ ";"? {
      return {
        tipo: "repeticion",
        modo: "rango",
        rango: rango,
        delimitador: '\",\"' || null,
        valor: grp
      };
    }
  / grp:Grupo _ "*"   { return { tipo: "repeticion", modo: "cero_o_mas", valor: grp }; }
  / grp:Grupo _ "+"   { return { tipo: "repeticion", modo: "una_o_mas", valor: grp }; }
  / grp:Grupo _ "?"  { return { tipo: "repeticion", modo: "opcional", valor: grp }; }
  / Grupo 



Grupo
  = "(" _ alt:Alternativa _ ")" _ { return { tipo: "grupo", valor: alt }; }
  / "(" _  _ Elemento? _  _ Grupo _ _ Elemento? _  _  ")" _ 
  / Elemento 

Elemento
  = Pluck
  / Etiqueta
  / TextoDeExpresion
  / AsersionNegativa
  / AsersionPositiva
  / Basica 
  / Rango
  / Punto
  / FinDeEntrada
  
  
  




Basica
  = Identificador _?
  / Literal _?

Literal
  = "\"" chars:[^"]* "\""  { return { tipo: "literal", valor: chars.join("") }; }
  / "'" chars:[^']* "'"   { return { tipo: "literal", valor: chars.join("") }; }

Rango
  = "[" chars:(conguion / conjunto)+ "]"   {
    return { tipo: "rango", valor: chars };
  }

  Punto
  = "." _ {
    return { tipo: "punto", descripcion: "cualquier caracter, incluyendo espacios" };
  }

FinDeEntrada
  = "!." _ {
    return { tipo: "fin_de_entrada", descripcion: "final de entrada de texto" };
  }

AsersionPositiva
  = "&" _ expr:Elemento _  {
    return { tipo: "asersion_positiva", valor: expr };
  }
  
AsersionNegativa
  = "!" _ expr:Elemento _  {
    return { tipo: "asersion_negativa", valor: expr };
  }

TextoDeExpresion
  = "$" _ expr:Grupo _  {
    return { tipo: "texto", valor: expr };
  }
  
Etiqueta
  = etiqueta:Identificador _ ":" _ expr:Grupo _  {
    return { tipo: "etiqueta", etiqueta: etiqueta, valor: expr };
  }
  


Pluck
  = "@" _ etiqueta:(Identificador _ ":")? expr:Elemento _  {
    return {
      tipo: "pluck",
      etiqueta: etiqueta ? etiqueta[0] : null,
      valor: expr
    };
  }

RangoConteo
  = conteo:(Numero / Identificador) {
      return { tipo: "conteo", valor: conteo };
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
Numero "número"
  = [0-9]+ { return parseInt(text(), 10); }

Identificador "identificador"
  =[_a-zA-Z][_a-zA-Z0-9]* { return text(); }


_ "whitespace or comments"
  = (whitespace  / "\n"* comentario)*

whitespace
  = [ \t\r]+

comentario
  = " "* "//" [^\n]* salto*
  / "/*" (!"*/" .)* "*/" 

salto
  = _ "\n" _ ";"? _
  
  
salto2
= _ "\n" _