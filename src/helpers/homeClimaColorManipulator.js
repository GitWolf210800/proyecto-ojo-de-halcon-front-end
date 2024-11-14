import { useHomeClimaStore } from '@/stores/homeClimaStore';
import { alarmColor, alertColor, neutroColor, offlineColor, okColor, tempHotExt, tempMhotExt, tempoColdExt, tempOkExt } from '@/variables';

export const dataColorInfoClima = (svg) => {

    const svgStore = svg;
    const storeData = (useHomeClimaStore()).datos;
    const dataClima = storeData.clima;
    const nombresClima = storeData.nombresClima;
    //const ultimaVez = svgStore.querySelector('#ultimaVez');
    //ultimaVez.textContent = storeData.actualizacion;
    
    for(let i = 0; i < nombresClima.length; i++) {
        const colorTemp = svgStore.querySelector(`#${nombresClima[i]}_temp_color`);
        const colorHum = svgStore.querySelector(`#${nombresClima[i]}_hum_color`);
        const colorHumAbs = svgStore.querySelector(`#${nombresClima[i]}_humAbs_color`);

        const textTemp = svgStore.querySelector(`#${nombresClima[i]}_temp_text`);
        const textHum = svgStore.querySelector(`#${nombresClima[i]}_hum_text`);
        const textHumAbs = svgStore.querySelector(`#${nombresClima[i]}_humAbs_text`);
        const textEntalpia = svgStore.querySelector(`#${nombresClima[i]}_entalpia_text`);

        const datos = dataClima.find((data) => data.nombre === nombresClima[i]);

        try {
            if(datos) {
                const idFab = datos.id_fabrica;
                const temperatura = Math.abs(datos.temperatura.toFixed(0));
                const humedad = Math.abs(datos.humedad.toFixed(0));
                const humedadAbs = Math.abs(datos.humedad_absoluta.toFixed(0));
                const entalpia = Math.abs(datos.entalpia.toFixed(0));
                const validacion = idFab.endsWith('aj');
      //console.log(validacion);

            if(textTemp){
                textTemp.textContent = `${temperatura}°C`;
            }
      
            if(textHum){
                textHum.textContent = `${humedad}% H.r`;
            }

            if(textHumAbs){
                textHumAbs.textContent = `${humedadAbs} g/Kg`;
            }

            if(textEntalpia){
              textEntalpia.textContent = `${entalpia} Kj/kg`;
            }

            if (nombresClima[i] === 'fab9_exterior_clima') {
             continue;
            }

            if (validacion && !isNaN(temperatura)) {
                const min = datos.min_temperatura;
                const max = datos.max_temperatura;
                const minAlarma = datos.min_A_temperatura;
                const maxAlarma = datos.max_A_temperatura;

            if(minAlarma !== 0 && maxAlarma !==0){
                if(temperatura < minAlarma || temperatura > maxAlarma){
                    colorTemp.style.fill = alarmColor;
                    textTemp.style.fill = '#FFF';
                    textTemp.style.stroke = '#000';
                } else if (temperatura < min || temperatura > max){
                    colorTemp.style.fill = alertColor;
                    textTemp.style.fill = '#474747';
                    textTemp.style.stroke = '#2C2C2C';
                } else {           
                    colorTemp.style.fill = okColor;
                    textTemp.style.fill = '#FFF';
                    textTemp.style.stroke = '#000';
                }
            }
            else {
                if(temperatura < min || temperatura > max){
                    colorTemp.style.fill = alertColor;
                    textTemp.style.stroke = '#2C2C2C';
                    textTemp.style.fill = '#474747';
                } else {
                    colorTemp.style.fill = okColor;
                    textTemp.style.fill = '#FFF';
                    textTemp.style.stroke = '#000';
                }
            }
        } else {
          if (colorTemp) {
            colorTemp.style.fill = neutroColor;
          }
        }

      if (validacion && !isNaN(humedad)){
        const min = datos.min_humedad;
        const max = datos.max_humedad;
        const minAlarma = datos.min_A_humedad;
        const maxAlarma = datos.max_A_humedad;

        if(minAlarma !== 0 && maxAlarma !== 0){
          if(humedad < minAlarma || humedad > maxAlarma){
            colorHum.style.fill = alarmColor;
            textHum.style.fill = '#FFF';
            textHum.style.stroke = '#000';
          } else if (humedad < min || humedad > max) {
              colorHum.style.fill = alertColor;
              textHum.style.fill = '#474747';
              textHum.style.stroke = '#2C2C2C';
          } else {
            colorHum.style.fill = okColor;
            textHum.style.fill = '#FFF';
            textHum.style.stroke = '#000';
          }
        } else {
          if (humedad < min || humedad > max) {
              colorHum.style.fill = alarmColor;
              textHum.style.fill = '#FFF';
              textHum.style.stroke = '#000';
          } else {
            colorHum.style.fill = okColor;
            textHum.style.fill = '#FFF';
            textHum.style.stroke = '#000';
          }
        }
      } else {
        if (colorHum){
          colorHum.style.fill = neutroColor;
        }
      }

      if (validacion && !isNaN(humedadAbs)){
        const min = datos.min_humedad_absoluta;
        const max = datos.max_humedad_absoluta;

        if (humedadAbs < min || humedadAbs > max) {
              colorHumAbs.style.fill = alarmColor;
              textHumAbs.style.fill = '#FFF';
              textHumAbs.style.stroke = '#000';
          } else {
            colorHumAbs.style.fill = okColor;
            textHumAbs.style.fill = '#FFF';
            textHumAbs.style.stroke = '#000';
          }
      } else {
        if (colorHumAbs) {
          colorHumAbs.style.fill = neutroColor;
        }
      }
    } else {
       if(colorTemp){
        colorTemp.style.fill = offlineColor;
        textTemp.textContent = 'offline';
        textTemp.style.fill = '#FFF';
       }

      if(colorHum){
        colorHum.style.fill = offlineColor;
        textHum.textContent = 'offline';
        textHum.style.fill = '#FFF';
      }

      if (colorHumAbs){
        colorHumAbs.style.fill = offlineColor;
        textHumAbs.textContent = 'offline';
        textHum.style.fill = '#FFF';
      }
    }
  } catch {
    console.warn(`error en: ${nombresClima[i]}`);
  }
}

};