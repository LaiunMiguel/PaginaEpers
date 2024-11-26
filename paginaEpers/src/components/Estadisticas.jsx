// src/components/Estadisticas.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Estadisticas = () => {
  const [promedioCorrupcion, setPromedioCorrupcion] = useState(null);
  const [picosCorrupcion, setPicosCorrupcion] = useState([]);
  const [maximosMinimosCorrupcion, setMaximosMinimosCorrupcion] = useState([]);

  // Consultar el promedio de corrupción de los últimos días
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
      setPicosCorrupcion(response.data);
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
    // Llamadas a las funciones según los parámetros que desees consultar
    const espirituId = 1; // Asumiendo un espirituId ejemplo
    const dias = 7; // Consultar últimos 7 días
    const umbral = 50; // Umbral de corrupción para detectar picos

    obtenerPromedioCorrupcion(espirituId, dias);
    obtenerPicosCorrupcion(umbral, dias);
    obtenerMaximosMinimosCorrupcion(espirituId);
  }, []);

  return (
    <div className="estadisticas">
      <h2>Estadísticas de Corrupción</h2>
      
      <div className="promedio">
        <h3>Promedio de Corrupción (últimos 7 días):</h3>
        {promedioCorrupcion !== null ? (
          <p>{promedioCorrupcion}%</p>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      <div className="picos">
        <h3>Picos de Corrupción Detectados:</h3>
        {picosCorrupcion.length > 0 ? (
          <ul>
            {picosCorrupcion.map((espirituId, index) => (
              <li key={index}>Espíritu ID: {espirituId}</li>
            ))}
          </ul>
        ) : (
          <p>No se han detectado picos.</p>
        )}
      </div>

      <div className="maximos-minimos">
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
  );
};

export default Estadisticas;
