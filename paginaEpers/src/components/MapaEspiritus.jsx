import React from "react";
import "./MapaEspiritus.css"

const MapWorld = () => {
  return (
    <div className="container">
      {/* Contenedor para el mapa */}
      <div id="map"></div>
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

        {/* Sección de espíritus */}
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
