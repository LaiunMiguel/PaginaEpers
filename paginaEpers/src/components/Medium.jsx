import React, { useEffect, useState } from "react";
import "./Listado.css"; // Importa estilos específicos para el diseño
import axios from "axios";

const ListadoMediums = () => {
  const [mediums, setMediums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEspiritus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/medium");
        setMediums(response.data);
      } catch (err) {
        setError("Error al cargar los espíritus. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEspiritus();
  }, []);

  const handleDescansar= async (id)=>{
    const response = await axios.put(`http://localhost:8080/medium/${id}/descansar`)
    console.log(response.data)
   // setMediums(response.data)
  }
console.log(mediums)
  if (loading) return <div className="loading">Cargando Mediums...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listado-espiritus">
      <h1>Mediums</h1>
      <ul className="espiritus-list">
        {mediums.map((mediums) => (
          <li key={mediums.id} className="espiritu-item">
            <h2 className="espiritu-nombre">{mediums.nombre}</h2>
            <p className="espiritu-tipo">Espiritus: {mediums.espiritus.map(e => e.nombre).join(', ') }</p>
            <p className="espiritu-energia">Energía: {mediums.mana}</p>
            <p className="espiritu-ubicacion">
              Ubicación: {mediums.coordenada.latitud}, {mediums.coordenada.longitud}
            </p>
            <button onClick={()=>handleDescansar(mediums.id)}>Descansar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListadoMediums;