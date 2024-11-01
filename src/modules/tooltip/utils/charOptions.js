
export default function getChartOptions(parametros) {
    return {
        responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#FFF'
              }
            },
            title: {
              display: true,
              text: `${parametros.nombre} 24Hs`,
              color: 'white',
              font: {
                size: 16
              }
            }
          },
          scales: {
            x: {
        type: 'time',
        time: {
          unit: 'minute', // Ajusta la unidad a 'minute' para mostrar intervalos de minutos
          displayFormats: {
            minute: 'HH:mm' // Solo muestra la hora y minuto, por ejemplo, 14:30
          },
          tooltipFormat: 'HH:mm' // Formato del tooltip (hora:minuto)
        },
        grid: {
          color: '#858585'
        },
        ticks: {
          color: 'white'
        },
        title: {
          display: true,
          text: 'Hora',
          color: '#D5D5D5'
        }
      },
            y: {
              grid: {
                color: '#858585'
              },
              ticks: {
                color: 'white'
              },
              title: {
                display: true,
                text: 'Valores',
                color: '#d5d5d5'
              }
            }
          }
    };
};