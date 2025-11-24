import { jsPDF } from "jspdf";
import { commonClosingAlerts } from "./ClosingService.js";

export async function exportClosing(closing){
    var doc = new jsPDF();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric' };
    const date = String(closing.created_at.toLocaleString('es-us', options))
    const total = String(closing.total)
    const saldoEsperado = String(closing.expected_balance)
    const differencia = String(closing.difference)
    const ratio = String((closing.expected_balance/closing.total)*100)
    const movementLenght = 200
    const contado = String(closing.counted)

    doc.setFont('Helvetica')
    doc.setFontSize(30);
    doc.text(60, 30, 'Reporte del cierre #'+ String(closing.id));
    doc.setFontSize(12);
    doc.text(
        20,
        60, 
        'Este reporte corresponde al dia ' + date + ' en el cual se realizo el cierre con un total acumulado de $' 
        + total + ' pesos en ' + movementLenght + ' movimientos a lo largo del dia.',
        {maxWidth: 170});

    doc.setFont('Helvetica', 'bold')
    doc.text(20,80,'Datos del cierre:')
    doc.setFont('Helvetica', 'normal')

    doc.text(20, 90, '\u2022' + 'El dinero contado fisicamente fue $' + contado + ' pesos');
    doc.text(20, 100, '\u2022' + 'El saldo esperado fue $' + saldoEsperado + ' pesos');
    doc.text(20, 110, '\u2022' + 'La diferencia fue de $' + differencia + ' pesos');
    doc.text(20, 120, '\u2022' + 'El saldo esperado del total fue del ' + ratio + '%');

    const alerta = commonClosingAlerts(closing)

    if (alerta){
        doc.text(20, 130, '\u2022' + 'El cierre activó al menos una alerta');
    } else {
        doc.text(20, 130, '\u2022' + 'El cierre no activo alertas');
    }
    doc.save('Reporte.pdf');
}
