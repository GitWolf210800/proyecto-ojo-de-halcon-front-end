export const data = {
    //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          borderColor: '#FA7D07',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 3 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 4 },
            { x: 6, y: 3 },
            { x: 7, y: 3 }
          ],
          fill: false // Puedes cambiar a true si quieres llenar el área debajo de la línea
        }
      ]
  }
  
  export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FA7D07' // Cambia el color de las etiquetas de la leyenda
        }
      },
      title: {
        display: true,
        text: 'fab6_preparacion_clima 24Hs',
        color: 'white', // Cambia el color del título
        fontSize: '25px'
      }
    },
    scales: {
     /* grid: {
        color: 'white'
      },*/
      x: {
        type: 'linear',
        position: 'bottom',
        grid: {
            color: '#d5d5d5' // Cambia el color de la cuadrícula del eje X a blanco
          },
        ticks: {
          color: 'white' // Cambia el color de las etiquetas del eje X
        },
        title: {
          display: true,
          text: 'Horas',
          color: '#D5D5D5' // Cambia el color del título del eje X
        }
      },
      y: {
        grid: {
            color: '#d5d5d5' // Cambia el color de la cuadrícula del eje X a blanco
          },
        ticks: {
          color: 'white' // Cambia el color de las etiquetas del eje Y
        },
        title: {
          display: true,
          text: 'Valores',
          color: '#d5d5d5' // Cambia el color del título del eje Y
        }
      }
    }
  }