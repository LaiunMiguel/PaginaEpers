import React, { useEffect, useState } from "react";
import './estadisticas.css';  // Ajusta la ruta según sea necesario
import axios from "axios";

const Estadisticas = () => {
  const [espiritus, setEspiritus] = useState([]);
  const [espirituId, setEspirituId] = useState("");
  const [promedioCorrupcion, setPromedioCorrupcion] = useState(null);
  const [mayorA10, setMayorA10] = useState([]);
  const [mayorA50, setMayorA50] = useState([]);
  const [mayorA80, setMayorA80] = useState([]);
  const [maximosMinimosCorrupcion, setMaximosMinimosCorrupcion] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionId, setUbicacionId] = useState("");
  const [promedioClima, setPromedioClima] = useState({ temperatura: null, humedad: null }); // Estado para almacenar los promedios de clima

  

  const obtenerPromedioClima = async (ubicacionId, dias) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/eventos/clima/promedio/${ubicacionId}/${dias}`
      );
      setPromedioClima({
        temperatura: response.data[0],
        humedad: response.data[1],
      });
    } catch (error) {
      console.error("Error al obtener el promedio de clima:", error);
    }
  };

  // Consultar el promedio de corrupción de los últimos días

  const fetchEspiritus = async () => {
    try {
      const response = await axios.get("http://localhost:8080/espiritus");
      setEspiritus(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUbicaciones = async () => {
    try {
      const response = await axios.get("http://localhost:8080/ubicaciones");
      setUbicaciones(response.data);
      console.log(response.data)
    } catch (err) {
      console.error(err);
    }
  }

  const obtenerPromedioCorrupcion = async (espirituId, dias) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/eventos/corrupcion/promedio?espirituId=${espirituId}&dias=${dias}`
      );
      setPromedioCorrupcion(response.data);
    } catch (error) {
      console.error("Error al obtener el promedio de corrupción:", error);
    }
  };

  // Consultar los picos de corrupción
  const obtenerPicosCorrupcion = async (umbral, dias) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/eventos/corrupcion/picos?umbral=${umbral}&dias=${dias}`
      );
      switch (umbral) {
        case 10:
          setMayorA10(response.data);  // Actualiza los espíritus con más de 10 de corrupción
          break;
        case 50:
          setMayorA50(response.data);  // Actualiza los espíritus con más de 50 de corrupción
          break;
        case 80:
          setMayorA80(response.data);  // Actualiza los espíritus con más de 80 de corrupción
          break;
        default:
          console.log("Umbral no válido");
      }
    } catch (error) {
      console.error("Error al obtener los picos de corrupción:", error);
    }
  };

  // Consultar el pico máximo y mínimo de corrupción para un espíritu
  const obtenerMaximosMinimosCorrupcion = async (espirituId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/eventos/corrupcion/${espirituId}/maximos`
      );
      setMaximosMinimosCorrupcion(response.data);
    } catch (error) {
      console.error("Error al obtener los picos máximos y mínimos:", error);
    }
  };


  useEffect(() => {
    if (ubicacionId) {
      obtenerPromedioClima(ubicacionId,7);
    }
  }, [ubicacionId]);

  useEffect(() => {
    // Llamadas a las funciones según los parámetros que desees consultar
    const dias = 7; // Consultar últimos 7 días
    fetchEspiritus();
    fetchUbicaciones();
    obtenerPicosCorrupcion(10, dias);
    obtenerPicosCorrupcion(50, dias);
    obtenerPicosCorrupcion(80, dias);
    
  }, []);

  useEffect(() => {
    if (espirituId) {
      obtenerPromedioCorrupcion(espirituId, 7);
      obtenerMaximosMinimosCorrupcion(espirituId);
    }
  }, [espirituId]);

  useEffect(() => {
    if (mayorA10.length && mayorA50.length && mayorA80.length) {
      // Filtrar los espíritus para evitar duplicados en los umbrales mayores
      const espiritusMayorA50 = mayorA50.filter((espirituId) =>
        !mayorA80.includes(espirituId)
      );
      const espiritusMayorA10 = mayorA10.filter(
        (espirituId) => !mayorA50.includes(espirituId) && !mayorA80.includes(espirituId)
      );
      
      // Solo actualizar si hay cambios reales en los arrays
      if (JSON.stringify(espiritusMayorA50) !== JSON.stringify(mayorA50)) {
        setMayorA50(espiritusMayorA50);
      }
      if (JSON.stringify(espiritusMayorA10) !== JSON.stringify(mayorA10)) {
        setMayorA10(espiritusMayorA10);
      }
    }
  }, [mayorA10, mayorA50, mayorA80]);

  return (
    
    <div className="estadisticas">
       <div className="EstadisticasContenedor">
        <h2>Estadísticas de Corrupción</h2>
        <div className="EstadisticasEspirituConId">
          <label htmlFor="espirituId">Selecciona Espíritu</label>
            <select
              id="espirituId"
              value={espirituId}
              onChange={(e) => setEspirituId(e.target.value)}
            >
              <option value="">Selecciona un espíritu</option>
              {espiritus.map((espiritu) => (
                <option key={espiritu.id} value={espiritu.id}>
                  {espiritu.nombre}
                </option>
              ))}
            </select>
        
            <div className="promedio">
              <h3>Promedio de Corrupción (últimos 7 días):</h3>
              {promedioCorrupcion !== null ? (
                <p>{promedioCorrupcion}%</p>
              ) : (
                <p>Cargando...</p>
              )}
            </div>

            <div className="pico">
              <h3>Pico Máximo y Mínimo de Corrupción:</h3>
              {maximosMinimosCorrupcion.length > 0 ? (
                <ul>
                  <li>Pico máximo: {maximosMinimosCorrupcion[0]}</li>
                  <li>Pico mínimo: {maximosMinimosCorrupcion[1]}</li>
                </ul>
              ) : (
                <p>Cargando...</p>
              )}
            </div>
        </div>

        <div className="Estadistica General">
            <h3>Espíritus activos que pasaron los 10 de corrupción:</h3>
            {mayorA10.length > 0 ? (
              <ul>
                {mayorA10.map((espirituId, index) => {
                  // Buscar el nombre del espíritu según el ID
                  const espiritu = espiritus.find((esp) => esp.id === espirituId);
                  if (espiritu) {
                    return (
                      <li key={index}>
                        Espíritu ID: {espirituId} - Nombre: {espiritu.nombre}
                      </li>
                    );
                  }
                  return null; // No renderiza nada si no se encuentra el espíritu
                })}
              </ul>
            ) : (
              <p>No se han detectado picos.</p>
            )}
        </div>
        <div className="Estadistica General">
            <h3>Espíritus activos que pasaron los 50 de corrupción:</h3>
            {mayorA50.length > 0 ? (
              <ul>
                {mayorA50.map((espirituId, index) => {
                  // Buscar el nombre del espíritu según el ID
                  const espiritu = espiritus.find((esp) => esp.id === espirituId);
                  if (espiritu) {
                    return (
                      <li key={index}>
                        Espíritu ID: {espirituId} - Nombre: {espiritu.nombre}
                      </li>
                    );
                  }
                  return null; // No renderiza nada si no se encuentra el espíritu
                })}
              </ul>
            ) : (
              <p>No se han detectado picos.</p>
            )}
        </div>
        <div className="Estadistica General">
            <h3>Espíritus activos que pasaron los 80 de corrupción:</h3>
            {mayorA80.length > 0 ? (
              <ul>
                {mayorA80.map((espirituId, index) => {
                  // Buscar el nombre del espíritu según el ID
                  const espiritu = espiritus.find((esp) => esp.id === espirituId);
                  if (espiritu) {
                    return (
                      <li key={index}>
                        Espíritu ID: {espirituId} - Nombre: {espiritu.nombre}
                      </li>
                    );
                  }
                  return null; // No renderiza nada si no se encuentra el espíritu
                })}
              </ul>
            ) : (
              <p>No se han detectado picos.</p>
            )}
        </div>
      </div>
      <div className="EstadisticasClima">
        <h2>Promedio de Clima</h2>
        <label htmlFor="selecUbi">Selecciona Ubicacion</label>
            <select
              id="selecUbiId"
              value={ubicacionId}
              onChange={(e) => setUbicacionId(e.target.value)}
            >
              <option value="">Selecciona un Ubicacion</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id} value={ubicacion.id}>
                  {ubicacion.nombre}
                </option>
              ))}
            </select>

        <p>Temperatura promedio: {promedioClima.temperatura ? `${promedioClima.temperatura.toFixed(2)}°C` : "Cargando..."}</p>
        <p>Humedad promedio: {promedioClima.humedad ? `${promedioClima.humedad}%` : "Cargando..."}</p>
      </div>
        
    </div>
  );
};

export default Estadisticas;
