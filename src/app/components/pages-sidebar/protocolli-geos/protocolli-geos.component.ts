import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormGroup} from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {ProtocolliGeosService} from "./protocolli-geos.service";
import {ProtocolliGeosDto} from "./protocolli-geos-dto";
@Component({
  selector: 'app-protocolli-geos',
  templateUrl: './protocolli-geos.component.html',
  styleUrls: ['./protocolli-geos.component.css'],
  providers: []

})
export class ProtocolliGeosComponent implements OnInit{

  dataDialog: boolean;
  newDialog: boolean;
  dataShowDialog: boolean;
  selectedIdProt: number;
  datas: ProtocolliGeosDto[];
  data: ProtocolliGeosDto;
  selectedDatas: ProtocolliGeosDto[];
  selectedData: ProtocolliGeosDto;
  submittedData: boolean;
  isDataReadonly: boolean = false;


  sensoOptions: any[];
  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private protocolliGeosService: ProtocolliGeosService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.protocolliGeosService.sensoSelectboxValuesProtocolloCem().subscribe(res => {
      this.sensoOptions = res;
    })
  }

  ngOnInit() {
    this.protocolliGeosService.getProtocolliGeos().subscribe(data => {
      this.datas = data;
    });
    this.initializeForm();
  }

  initializeForm(): void {
    this.dataForm = this.fb.group({
      idprot: [''],
      senso: [''],
      data: [''],
      protocollo: [''],
      autore: [''],
      mittente: [''],
      destinatario: [''],
      oggetto: [''],
    });
  }

  dataPatch(): void{
    this.dataForm.patchValue({
      id: this.data?.idprot || '',
      senso: this.data?.senso || '',
      data: this.data?.data || '',
      protocollo: this.data?.protocollo || '',
      autore: this.data?.autore || '',
      mittente: this.data?.mittente || '',
      destinatario: this.data?.destinatario || '',
      oggetto: this.data?.oggetto || '',
    });
  }

  openNewData() {
    this.data = {};
    this.dataPatch();
    this.submittedData = false;
    this.newDialog = true;
    this.isDataReadonly = false;
  }

  editData(data: ProtocolliGeosDto) {
    this.data = {...data};
    this.dataDialog = true;
    this.selectedIdProt = data.idprot;
    this.isDataReadonly = false;
    this.dataPatch();

    const dataValue = this.dataForm.get('data').value;
    const formattedDate = dataValue ? new Date(dataValue) : null;

    this.dataForm.controls['data'].setValue(formattedDate);
  }


  showData(data: ProtocolliGeosDto) {
    this.data = {...data};
    this.selectedData = this.data;
    this.dataShowDialog = true;
    this.isDataReadonly =  true;
    this.dataPatch();
  }
  hideDataDialog() {
    this.dataDialog = false;
    this.newDialog = false;
    this.submittedData = false;
  }
  hideShowDialog() {
    this.dataShowDialog = false;
    this.submittedData = false;
  }
  deleteData(data: ProtocolliGeosDto) {
    if(data.idprot){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.protocolliGeosService.deleteSelectedDataProtocolliGeos(data.idprot).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
          })
        }
      });
    }else{
      console.log('pls select a row to be deleted!')
    }
  }

  deleteSelectedDatas() {
    if (this.selectedDatas.length == 1) {
      const idprot = this.selectedDatas[0].idprot;
      this.protocolliGeosService.deleteSelectedDataProtocolliGeos(idprot).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
      })
    } else if(this.selectedDatas.length > 1){
      const idprots = this.selectedDatas.map(data => data.idprot);
      this.protocolliGeosService.deletemultipleSelectedDatasProtocolliGeos(idprots).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
      });
    }else{
      console.log('Please select rows to be deleted!');
    }
  }

  saveData(){
    const dtoOut = new ProtocolliGeosDto();
    dtoOut.senso = this.dataForm.get('senso').value;
    const dateValue = this.dataForm.get('data').value;
    if (dateValue == null) {
      dtoOut.data = null;
    } else if (dateValue instanceof Date) {
      const day = String(dateValue.getDate()).padStart(2, '0');
      const month = String(dateValue.getMonth() + 1).padStart(2, '0');
      const year = dateValue.getFullYear();

      dtoOut.data = `${year}-${month}-${day}`;
    }

    dtoOut.protocollo = this.dataForm.get('protocollo').value;
    dtoOut.autore = this.dataForm.get('autore').value;
    dtoOut.mittente = this.dataForm.get('mittente').value;
    dtoOut.destinatario = this.dataForm.get('destinatario').value;
    dtoOut.oggetto = this.dataForm.get('oggetto').value;

    if(this.newDialog == true){
      this.protocolliGeosService.postSaveNewProtocolliGeosData(dtoOut).subscribe(() => {
      })
    }else if(this.dataDialog== true){
      this.protocolliGeosService.putUpdatedOneDataProtocolliGeos(this.selectedIdProt, dtoOut).subscribe(() => {
      })
    }
  }

  // exportPdf() {
  //   import('jspdf').then((jspdf) => {
  //     import('jspdf-autotable').then((jspdfAutotable) => {
  //       const doc = new jspdf.default('p', 'px', 'a4');
  //       (doc as any).autoTable({ html: '#dt' }); // Declare autoTable as any
  //       doc.save('table.pdf');
  //     });
  //   });
  // }

  exportExcelAll() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datas);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'table.xlsx');
  }
  selectedExportExcel() {
    // Filter selected rows
    const selectedData = this.datas.filter(data => this.selectedDatas.includes(data));

    // Convert filtered data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save as Excel file
    this.saveAsExcelFile(excelBuffer, 'selected_rows.xlsx');
  }
  selectedExportExcelForOneData() {
    const selectedData = this.datas.filter(data => this.selectedData.idprot  == data.idprot );
    // Convert filtered data to Excel format
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save as Excel file
    this.saveAsExcelFile(excelBuffer, 'selected_rows.xlsx');
  }
  // exportWord() {
  //   const doc = new docx.Document();
  //   const table = doc.createTable(this.datas.length + 1, 4); // Adjust the number of rows and columns as per your data
  //   // Insert headers
  //   table.getCell(0, 0).addContent(new docx.Paragraph('ID Misura'));
  //   table.getCell(0, 1).addContent(new docx.Paragraph('Technologia'));
  //   table.getCell(0, 2).addContent(new docx.Paragraph('Potenza'));
  //   table.getCell(0, 3).addContent(new docx.Paragraph('Numero Cod Sito'));
  //
  //   // Insert data
  //   this.datas.forEach((data, index) => {
  //     table.getCell(index + 1, 0).addContent(new docx.Paragraph(data.idMisura));
  //     table.getCell(index + 1, 1).addContent(new docx.Paragraph(data.technologia));
  //     table.getCell(index + 1, 2).addContent(new docx.Paragraph(data.potenza));
  //     table.getCell(index + 1, 3).addContent(new docx.Paragraph(data.numeroCodSito));
  //   });
  //
  //   const buffer = docx.Packer.toBuffer(doc);
  //   fs.writeFileSync('table.docx', buffer);
  // }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);
  }
}
