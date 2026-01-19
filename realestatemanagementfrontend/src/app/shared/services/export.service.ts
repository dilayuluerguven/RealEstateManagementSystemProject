import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportExcel(data: any[], fileName: string, sheetName = 'Sheet1'): void {
    if (!data || data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  }

  exportPdf(
    title: string,
    headers: string[],
    body: any[][],
    fileName: string
  ): void {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    doc.setFontSize(18);
    doc.text(title, 40, 40);

    autoTable(doc, {
      startY: 60,
      head: [headers],
      body: body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(fileName);
  }
}
