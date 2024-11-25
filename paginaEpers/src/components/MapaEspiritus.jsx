import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Importa los estilos de Leaflet
import L from "leaflet";
import "./MapaEspiritus.css";
import axios from 'axios';
import {useNavigate } from "react-router-dom";
import customIcon from "../assets/ubicacion.svg";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapWorld = () => {
  const customSvgIcon = L.divIcon({
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" width="30" height="30" stroke-width="2"> <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path> <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path> </svg> ',
    className: '', // Para deshabilitar clases predeterminadas de Leaflet
  });
  const navigate = useNavigate();
  const [espiritus, setEspiritus] = useState([]);
  const [mediums, setMediums] = useState();
  useEffect(() => {
    const fetchEspiritus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/espiritus");
        setEspiritus(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEspiritus();
  }, [mediums]);




console.log(espiritus);
  const handleGoMediumList = () => {
    navigate('/mediums')
  }
  const handleGoEspiritusList = () => {
    navigate('/espiritus')
  }
  return (
    <div className="container">
      {/* Contenedor para el mapa */}
      <MapContainer
        id="map"
        center={[-34.6037, -58.3816]} // Coordenadas de Buenos Aires
        zoom={13} // Nivel de zoom
        style={{ height: "400px", width: "100%" }} // Ajusta el tamaño del mapa
      >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {espiritus.map((espiritu) => (
          <Marker key={espiritu.id} position={[espiritu.coordenada.longitud, espiritu.coordenada.latitud]}  icon={customSvgIcon}>
            <Popup>
              {espiritu.nombre} <br /> ¡Aquí está el espíritu!
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    <div className="butonsContainer">
      <div className="butonList">
        <button className="butons" onClick={handleGoMediumList}>Ver lista de mediums</button>
      </div>
      <div className="buton">
        <button className="butons" onClick={handleGoEspiritusList}>Ver lista de Espiritus</button>
      </div>
    </div>
      <div className="section">
        {/* Sección de mediums */}
        <div className="mediums">
          <h3>MEDIUMS</h3>
          <div className="form-group">
            <label htmlFor="mediumName">Nombre</label>
            <input
              type="text"
              id="mediumName"
              placeholder="Ingresa el nombre del médium"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mediumLocation">Ubicación</label>
            <select id="mediumLocation">
              <option>Selecciona ubicación</option>
            </select>
          </div>
          <button>Crear</button>
        </div>

        
        <div className="spirits">
          <h3>ESPÍRITUS</h3>
          <div className="form-group">
            <label htmlFor="spiritName">Nombre</label>
            <input
              type="text"
              id="spiritName"
              placeholder="Ingresa el nombre del espíritu"
            />
          </div>
          <div className="form-group">
            <label htmlFor="spiritLocation">Ubicación</label>
            <select id="spiritLocation">
              <option>Selecciona ubicación</option>
            </select>
          </div>
          <button>Crear</button>
        </div>
      </div>
    </div>
  );
};

export default MapWorld;
