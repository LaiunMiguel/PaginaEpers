import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "./Listado.css"; // Importa estilos específicos para el diseño
import axios from "axios";


const UbicacionDetalles = ({ubicacion}) => {

    const [climaStats, setClima] = useState([]);

    useEffect(() => {
        const obtenerPromedio7Dias = async (ubicacionId) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/eventos/clima/${ubicacionId}`
              );
              console.log(response.data)
              setClima(response.data)
            } catch (error) {
              console.error("Error al obtener el promedio de la ubicacion", error);
            }
          };
          obtenerPromedio7Dias(ubicacion.id);
      }, [ubicacion]);



    return (
        <div>   

            {ubicacion.nombre} <br /> Tipo: {ubicacion.tipo} Clima: {climaStats}       

        </div>
    )
}

export default UbicacionDetalles