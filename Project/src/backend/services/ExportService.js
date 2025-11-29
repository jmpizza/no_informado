import { jsPDF } from "jspdf";
import { commonClosingAlerts } from "./ClosingService.js";


export default class ExportService{
    constructor(){}

 async  exportClosing(closing){
    var doc = new jsPDF();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric' };
    const date = String(closing.date.toLocaleString('es-us', options))
    const total = String(closing.totalExpected)
    const saldoEsperado = String(closing.totalCounted)
    const ratio = String((closing.totalCounted/closing.totalExpected)*100) 
    const paymentMethods = Object.keys(closing.paymentMethods)
    const diferencia = String(closing.totalDifference) 
    const rol = String(closing.operator)

    doc.setFont('Helvetica')
    doc.setFontSize(30);
    doc.text(60, 30, 'Reporte del cierre #'+ String(closing.id));
    doc.setFontSize(12);
    doc.text(
        20,
        60, 
        'Este reporte corresponde al dia ' + date + ' en el cual se realizo el cierre con un total acumulado de $' 
        + total,
        {maxWidth: 170});

    doc.setFont('Helvetica', 'bold')
    doc.text(20,80,'Datos del cierre:')
    doc.setFont('Helvetica', 'normal')

    doc.text(20, 90, '\u2022' + 'El dinero contado fisicamente fue $' + saldoEsperado + ' pesos');
    doc.text(20, 100, '\u2022' + 'La razon del contado del total fue del ' + ratio + '%'); 
    doc.text(20, 110, '\u2022' + 'El diferencia fue del ' + diferencia + ' pesos'); 
    doc.text(20, 120, '\u2022' + 'El cierre lo hizo: ' + rol);

    doc.setFont('Helvetica', 'bold')
    doc.text(20,130,'Resumen del cierre:')
    doc.setFont('Helvetica', 'normal')

    let yValue = 140
    const payment = closing.paymentMethods
    for (let i = 0; i < paymentMethods.length; i++) {
        doc.text(20, yValue, 
          'Método: ' + payment[i]["name"] + ', ' + 
          'Total: ' + payment[i]["expectedAmount"] + ', ' + 
          'Contado: ' + payment[i]["countedAmount"]);
        yValue = yValue + 10
    }
    doc.save('Reporte.pdf');
 }
}
