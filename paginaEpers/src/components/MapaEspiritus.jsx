import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup ,Polygon} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Importa los estilos de Leaflet
import L from "leaflet";
import "./MapaEspiritus.css";
import axios from 'axios';
import {useNavigate } from "react-router-dom";
import customIcon from "../assets/ubicacion.svg";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import EspirituDescripcion from "./EspirituDescripcion";
import UbicacionDetalles from "./UbicacionDetalles";

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
  const [ubicaciones, setUbicaciones] = useState([]);
  const [nombreMedium, setNombreMedium] = useState("");
  const [nombreEspiritu, setNombreEspiritu] = useState("");
  const [idUbicacion, setIdUbicacion] = useState(0);
  const [reload, setReload] = useState(false);
  

  useEffect(() => {
    const fetchEspiritus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/espiritus");
        setEspiritus(response.data);
        console.log(response.data)
      } catch (err) {
        console.error(err);
      }
    }
    
    const fetchUbicaciones = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ubicaciones");
        setUbicaciones(response.data);
        console.log(response.data)
      } catch (err) {
        console.error(err);
      }finally{
        setReload(false);
      }
    }

    fetchUbicaciones();
    fetchEspiritus();
  }, [reload]);

  const handleCreateMedium = () => {
    console.log(idUbicacion)
    try{
      const body = {
        nombre: nombreMedium,
        ubicacionId: idUbicacion,
        energia: 100,
        mana: 10,
        manaMax: 20,
        coordenada:{longitud: -58.27789, latitud: -34.706285}
      }
      console.log(body)
      axios.post("http://localhost:8080/medium", body)
      setNombreMedium("");

    }catch(err){
      console.error(err)
    }finally{
      setReload(!reload)
    }
  }


  const handleCreateEspiritu = () => {
    
    try{
      console.log(idUbicacion)
      const body = {
        nombre: nombreEspiritu,
        ubicacionId: idUbicacion,
        energia: 100,
        tipo: "ANGELICAL",
        coordenada:{longitud: -58.27795, latitud: -34.706290}
      }
      console.log(body)
      axios.post("http://localhost:8080/espiritus", body)
      setNombreEspiritu("");

    }catch(err){
      console.error(err)
    }finally{
      setReload(!reload)
    }
  }

  const getColorByClima = (tipoClima) => {
    switch (tipoClima) {
      case "CALUROSO":
        return "red"; // Color para clima caluroso
      case "FRIO":
        return "blue"; // Color para clima frío
      case "TEMPLADO":
        return "green"; // Color para clima templado
      case "TORMENTA":
        return "gray"; // Color para tormenta

    }
  }

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
        center={[-34.706285, -58.27789]} // Coordenadas de Buenos Aires
        zoom={13} // Nivel de zoom
        style={{ height: "400px", width: "100%" }} // Ajusta el tamaño del mapa
      >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {espiritus.map((espiritu) => (
          <Marker key={espiritu.id} position={[espiritu.coordenada.latitud,espiritu.coordenada.longitud]}  icon={customSvgIcon}>
            <Popup>
              <EspirituDescripcion espiritu={espiritu}/>            
            </Popup>
          </Marker>
        ))}

        {ubicaciones.map((ubicacion) => (
          <Polygon
            key={ubicacion.id}
            positions={ubicacion.area.map(coordenada => [coordenada.latitud, coordenada.longitud])}
            color={getColorByClima(ubicacion.tipoClima)} // Color según el clima
          >
            <Popup>
              <UbicacionDetalles ubicacion={ubicacion}/>
              
            </Popup>
          </Polygon>
        ))}

      </MapContainer>
    <div className="butonsContainer">
      <div className="butonList">
        <button className="butons" onClick={handleGoMediumList}>Ver lista de mediums</button>
      </div>
      <div className="buton">
        <button className="butons" onClick={handleGoEspiritusList}>Ver lista de Espiritus</button>
      </div>
      <div className="butonEstadistica">
        <button onClick={() => navigate('/estadisticas')}>Ver Estadísticas</button>
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
              value={nombreMedium}
              onChange={(e) => setNombreMedium(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mediumLocation">Ubicación</label>
            <select id="mediumLocation" onChange={(e) => setIdUbicacion(e.target.value)}>
              <option>Selecciona ubicación</option>
              {ubicaciones.length > 0 ? (
                ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.nombre}
                  </option>
                ))
              ): "No hay ubicaciones"}
            </select>
          </div>
          <button onClick={handleCreateMedium}>Crear</button>
        </div>

        
        <div className="spirits">
          <h3>ESPÍRITUS</h3>
          <div className="form-group">
            <label htmlFor="spiritName">Nombre</label>
            <input
              type="text"
              id="spiritName"
              placeholder="Ingresa el nombre del espíritu"
              value={nombreEspiritu}
              onChange={(e) => setNombreEspiritu(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="spiritLocation">Ubicación</label>
            <select id="spiritLocation" onChange={(e) => setIdUbicacion(e.target.value)}>
              <option>Selecciona ubicación</option>
              {ubicaciones.length > 0 ? (
                ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.nombre}
                  </option>
                ))
              ): "No hay ubicaciones"}
            </select>
          </div>
          <button onClick={handleCreateEspiritu}>Crear</button>
        </div>
      </div>
    </div>
  );
};

export default MapWorld;
