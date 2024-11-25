import React, { useEffect, useState } from "react";
import "./Listado.css"; // Importa estilos específicos para el diseño
import axios from "axios";

const ListadoEspiritus = () => {
  const [espiritus, setEspiritus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEspiritus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/espiritus");
        setEspiritus(response.data);
      } catch (err) {
        setError("Error al cargar los espíritus. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEspiritus();
  }, []);
  
  const getProgressColorClass = (nivel) => {
    if (nivel < 50) return "low";
    if (nivel < 80) return "medium";
    return "high";
  };

  if (loading) return <div className="loading">Cargando Espíritus...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listado-espiritus">
      <h1>Espíritus</h1>
      <ul className="espiritus-list">
        {espiritus.map((espiritu) => (
          <li key={espiritu.id} className="espiritu-item">
            <h2 className="espiritu-nombre">{espiritu.nombre}</h2>
            <p className="espiritu-tipo">Tipo: {espiritu.tipo}</p>
            <p className="espiritu-energia">Energía: {espiritu.energia}</p>
            <p className="espiritu-ubicacion">
              Ubicación: {espiritu.coordenada.latitud}, {espiritu.coordenada.longitud}
            </p>
            <p>Nivel De Corrupcion </p>
            <progress className={getProgressColorClass(espiritu.nivelDeCorrupcion)}value={espiritu.nivelDeCorrupcion} max="100"></progress>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListadoEspiritus;