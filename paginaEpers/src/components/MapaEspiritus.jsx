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
import PolygonMap from "./PolygonMap";

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
  const [nombreEspiritu, setNombreEspiritu] = useState("");
  const [idUbicacion, setIdUbicacion] = useState(0);
  const [idMedium, setIdMedium] = useState(0);
  const [idEspiritu, setIdEspiritu] = useState(0);
  const [reload, setReload] = useState(false);
  const [mediums, setMediums] = useState([]);
  const [coordenadas, setCoordenadas] = useState([]);
  const [latitud, setLatitud] = useState({});
  const [longitud, setLongitud] = useState({});
  const [tipoEspiritu, setTipoEspiritu] = useState("");

  useEffect(() => {
    const fetchEspiritus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/espiritus");
        setEspiritus(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    
    const fetchUbicaciones = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ubicaciones");
        setUbicaciones(response.data);
      } catch (err) {
        console.error(err);
      }finally{
        setReload(false);
      }
    }
    const fetchMediums = async () => {
      try{
        const response = await axios.get("http://localhost:8080/medium");
        setMediums(response.data);
      }
      catch(err){
        console.error(err)
      }
    }

    fetchUbicaciones();
    fetchEspiritus();
    fetchMediums();
  }, [reload]);

  const handleConectarEspiritu = async () => {
    try{
      const response = await axios.put(`http://localhost:8080/espiritus/${idEspiritu}/conectar/${idMedium}`)
      console.log(response)

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
        tipo: tipoEspiritu,
        coordenada:coordenadas[0]
      }
      axios.post("http://localhost:8080/espiritus", body)
      setNombreEspiritu("");

    }catch(err){
      console.error(err)
    }finally{
      setReload(!reload)
    }
  }

  const getColorByClima = (tipoClima) => {
    const optionsMap ={
    "TORMENTA": "red",
    "TEMPLADO" : "green",
    "CALUROSO" : "yellow",
    "FRIO": "blue"
    }
    return optionsMap[tipoClima];
  }

  const handleCoordenadas = (idUbicacion) => {
    setIdUbicacion(idUbicacion);
    const optionsMap= {
      "2672" : [{longitud: -58.28062036755716, latitud: -34.70764336914739}, 
                {longitud: -58.278851560429125,latitud: -34.70655382694591},
                {longitud: -58.27798679281112, latitud: -34.706560597539884},
                {longitud: -58.27865327188177, latitud: -34.706997904281785}], //unqui
      "2671" : [{longitud: -58.25967081722169, latitud: -34.722888081266305}, 
                {longitud: -58.2601907743306 , latitud: -34.72363457066934},
                {longitud: -58.2599761976291 , latitud: -34.7246266041608},
                {longitud: -58.26126986683907, latitud: -34.72283768035948}] //estacion cambiar coords
    }
    setCoordenadas(optionsMap[idUbicacion]);
  }

  const handleMover= async ()=>{
    try {
      const response = await axios.put(`http://localhost:8080/medium/${idMedium}/mover`, {longitud: latitud, latitud: longitud});
      
      console.log('Medium movido con éxito:', response.data);
      
      // setMediums(response.data);
    } catch (error) {
      console.error('Error al mover el médium:', error);
    }
    finally{
      setReload(!reload)
    }
  }

  const handleGoMediumList = () => {
    navigate('/mediums')
  }
  const handleGoEspiritusList = () => {
    navigate('/espiritus')
  }
  
  return (<>
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
        <PolygonMap ubicaciones={ubicaciones}/>
        
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
          <h3>Conectar Espritu a Medium</h3>
          <div className="form-group">
            <label htmlFor="mediumName">Mediums</label>
            <select id="medium" onChange={(e) => setIdMedium(e.target.value)}>
              <option>Selecciona un medium</option>
              {mediums.length > 0 ? (
                mediums.map((medium) => (
                  <option key={medium.id} value={medium.id}>
                    {medium.nombre}
                  </option>
                ))
              ): "No hay mediums"}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="esp">Espiritus</label>
            <select id="esp" onChange={(e) => setIdEspiritu(e.target.value)}>
              <option>Selecciona un espiritu</option>
              {espiritus.length > 0 ? (
                espiritus.map((espiritu) => (
                  <option key={espiritu.id} value={espiritu.id}>
                    {espiritu.nombre}
                  </option>
                ))
              ): "No hay espiritus"}
            </select>
          </div>
          <button onClick={handleConectarEspiritu}>Conectar</button>
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
            <label htmlFor="spiritName">TipoDeEspiritu</label>
            <input
              type="text"
              id="spiritName"
              placeholder="Ingresa el tipo del espíritu"
              value={tipoEspiritu}
              onChange={(e) => setTipoEspiritu(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="spiritLocation">Ubicación</label>
            <select id="spiritLocation" onChange={(e) => handleCoordenadas(e.target.value)}>
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
          <div className="form-group">
            <label htmlFor="spiritLocation">Coordenada Longitud</label>
            <select id="mediumLocation" onChange={(e) => setLongitud(e.target.value)}>
              <option>Selecciona una coordenada</option>
              {coordenadas.length > 0 ? (
                coordenadas.map((coordenada, index) => (
                  <option key={index} value={coordenada.longitud}>
                    {coordenada.longitud}
                  </option>
                ))
              ): "No hay coordenada"}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="spiritLocation">Coordenada Latitud</label>
            <select id="mediumLocation" onChange={(e) => setLatitud(e.target.value)}>
              <option>Selecciona una coordenada</option>
              {coordenadas.length > 0 ? (
                coordenadas.map((coordenada, index) => (
                  <option key={index} value={coordenada.latitud}>
                    {coordenada.latitud}
                  </option>
                ))
              ): "No hay coordenada"}
            </select>
          </div>
          <button onClick={handleCreateEspiritu}>Crear</button>
        </div>
        
        <div className="sectionMover">
          <h3>Mover Medium</h3>
          <div className="form-group">
            <label htmlFor="spiritLocation">Medium</label>
            <select onChange={(e) => setIdMedium(e.target.value)}>
              <option> seleccione al Medium</option>
              {mediums.length > 0 ?(
                mediums.map((medium) => (                  
                  <option key={medium.id} value={medium.id}>
                    {medium.nombre}
                  </option>
                )
              )): "No hay mediums"}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="spiritLocation">Ubicación</label>
            <select id="mediumLocation" onChange={(e) => handleCoordenadas(e.target.value)}>
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
          <div className="form-group">
            <label htmlFor="spiritLocation">Coordenada Longitud</label>
            <select id="mediumLocation" onChange={(e) => setLongitud(e.target.value)}>
              <option>Selecciona una coordenada</option>
              {coordenadas.length > 0 ? (
                coordenadas.map((coordenada, index) => (
                  <option key={index} value={coordenada.longitud}>
                    {coordenada.longitud}
                  </option>
                ))
              ): "No hay coordenada"}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="spiritLocation">Coordenada Latitud</label>
            <select id="mediumLocation" onChange={(e) => setLatitud(e.target.value)}>
              <option>Selecciona una coordenada</option>
              {coordenadas.length > 0 ? (
                coordenadas.map((coordenada, index) => (
                  <option key={index} value={coordenada.latitud}>
                    {coordenada.latitud}
                  </option>
                ))
              ): "No hay coordenada"}
            </select>
          </div>
          <button onClick={handleMover}>Mover</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MapWorld;
