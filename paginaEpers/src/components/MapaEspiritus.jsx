import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Importa los estilos de Leaflet
import L from "leaflet";
import "./MapaEspiritus.css";

// Corrige el problema con los íconos de Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapWorld = () => {
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
        
        <Marker position={[-34.6037, -58.3816]}>
          <Popup>
            Buenos Aires, Argentina <br /> ¡Aquí está el marcador!
          </Popup>
        </Marker>
      </MapContainer>

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
