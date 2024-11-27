import React, { useEffect, useState } from "react";
import "./Listado.css"; // Importa estilos específicos para el diseño
import axios from "axios";


const EspirituDescripcion = ({espiritu}) => {

    const [picosCorrupcion, setPicos] = useState([]);

    useEffect(() => {
        const obtenerMaximosMinimosCorrupcion = async (espirituId) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/eventos/corrupcion/${espirituId}/maximos`
              );
              console.log(response.data)
              setPicos(response.data)
            } catch (error) {
             setPicos([0,0])
            }
          };
          obtenerMaximosMinimosCorrupcion(espiritu.id);
      }, [espiritu]);



    return (
        <div>

        {espiritu.nombre} <br /> ¡Aquí está el espíritu!
        <br />
        picoMaximoCorrupcion {picosCorrupcion[0]}%
        <br /> 
        picoMinimoCorrupcion {picosCorrupcion[1]}%

        </div>
    )
}

export default EspirituDescripcion