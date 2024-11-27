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

const PolygonMap =({ubicaciones}) => {
    
    return(
        <>
        {ubicaciones.map((ubicacion) => (
            <Polygon
              key={ubicacion.id}
              positions={ubicacion.area.map(coordenada => [coordenada.latitud, coordenada.longitud])}
              color={"green"} // Color según el clima
            >
              <Popup>
                <UbicacionDetalles ubicacion={ubicacion}/>
                
              </Popup>
            </Polygon>
          ))}
          </>
    )
}

export default PolygonMap;