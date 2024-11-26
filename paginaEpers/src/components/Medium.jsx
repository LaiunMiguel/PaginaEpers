import React, { useEffect, useState } from "react";
import "./Listado.css"; // Importa estilos específicos para el diseño
import axios from "axios";




const ListadoMediums = () => {
  const [mediums, setMediums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reload,setReload] = useState(false);

  useEffect(() => {
    const fetchEspiritus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/medium");
        setMediums(response.data);
      } catch (err) {
        setError("Error al cargar los espíritus. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
        setReload(false);
      }
    };

    fetchEspiritus();
  }, [reload]);

  const handleDescansar= async (id)=>{
    const response = await axios.put(`http://localhost:8080/medium/${id}/descansar`)

    console.log(response.data)
    console.log('Medium descanso con exito:', response.data);
   // setMediums(response.data)
  }

  const handleMover= async (id)=>{
    try {
      const nuevasCoordenadas = {latitud:-58.26093034931972 ,longitud:-34.7239854284505 };
      const response = await axios.put(`http://localhost:8080/medium/${id}/mover`, nuevasCoordenadas);
      
      console.log('Medium movido con éxito:', response.data);
      
      // setMediums(response.data);
    } catch (error) {
      console.error('Error al mover el médium:', error);
    }

    finally{
      setReload(!reload)
    }
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
            <button onClick={()=>handleMover(mediums.id)}>Mover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListadoMediums;