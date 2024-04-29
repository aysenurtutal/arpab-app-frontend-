import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {RilevazioniSitoService} from "./rilevazioni-sito.service";
import {RilevazioniSitoDto} from "./rilevazioni-sito-dto";
@Component({
  selector: 'app-rilevazioni-sito',
  templateUrl: './rilevazioni-sito.component.html',
  styleUrls: ['./rilevazioni-sito.component.css'],
  providers: []

})
export class RilevazioniSitoComponent implements OnInit{

  dataDialog: boolean;
  newDialog: boolean;
  dataShowDialog: boolean;
  selectedIdProt: number;
  datas: RilevazioniSitoDto[];
  data: RilevazioniSitoDto;
  selectedDatas: RilevazioniSitoDto[];
  selectedData: RilevazioniSitoDto;
  submittedData: boolean;
  isDataReadonly: boolean = false;

  numcodsitoOptions: any[];

  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private rilevazioniSitoService: RilevazioniSitoService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.rilevazioniSitoService.numcodsitoSelectboxValuesRilevazioniSito().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.numcodsitoOptions = res.filter(item => item.numcodsito !== '').map(item => item.numcodsito);
      }
    })
  }

  ngOnInit() {
    this.rilevazioniSitoService.getRilevazioniSitoData().subscribe(data => {
      this.datas = data;
    });
    this.initializeForm();
  }

  initializeForm(): void {
    this.dataForm = this.fb.group({
      idmisurazione: [''],
      numcodsito: ['', Validators.required],
      protocollo: [''],
      sistema: [''],
      azimuth: [''],
      altcentrele: [''],
      antenna: [''],
      altezzaantenna: [''],
      guadagnoantenna: [''],
      tiltmecca: [''],
      titltelettr: [''],
      numerotrx: [''],
      potmaxsingtrx: [''],
      potmaxtotant: [''],
      attcei: [''],
      alpha24: [''],
      fattriduz: [''],
      pottotantfattrid: ['']
    });
  }


  dataPatch(): void {
    this.dataForm.patchValue({
      idmisurazione: this.data?.idmisurazione || '',
      numcodsito: this.data?.numcodsito || '',
      protocollo: this.data?.protocollo || '',
      sistema: this.data?.sistema || '',
      azimuth: this.data?.azimuth || '',
      altcentrele: this.data?.altcentrele || '',
      antenna: this.data?.antenna || '',
      altezzaantenna: this.data?.altezzaantenna || '',
      guadagnoantenna: this.data?.guadagnoantenna || '',
      tiltmecca: this.data?.tiltmecca || '',
      titltelettr: this.data?.titltelettr || '',
      numerotrx: this.data?.numerotrx || '',
      potmaxsingtrx: this.data?.potmaxsingtrx || '',
      potmaxtotant: this.data?.potmaxtotant || '',
      attcei: this.data?.attcei || '',
      alpha24: this.data?.alpha24 || '',
      fattriduz: this.data?.fattriduz || '',
      pottotantfattrid: this.data?.pottotantfattrid || ''
    });
  }


  openNewData() {
    this.data = {};
    this.dataPatch();
    this.submittedData = false;
    this.newDialog = true;
    this.isDataReadonly = false;
  }

  editData(data: RilevazioniSitoDto) {
    this.data = {...data};
    this.dataDialog = true;
    this.selectedIdProt = data.numcodsito;
    this.isDataReadonly = false;
    this.dataPatch();
  }


  showData(data: RilevazioniSitoDto) {
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

  deleteData(data: RilevazioniSitoDto) {
    if(data.numcodsito){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.rilevazioniSitoService.deleteSelectedDataRilevazioniSito(data.numcodsito).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
            this.confirmationService.close();
            window.location.reload();
          })
        }
      });
    }else{
      console.log('pls select a row to be deleted!')
    }
  }

  deleteSelectedDatas() {
    if (this.selectedDatas.length == 1) {
      const numcodsito = this.selectedDatas[0].numcodsito;
      if(numcodsito){
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.rilevazioniSitoService.deleteSelectedDataRilevazioniSito(numcodsito).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
              this.confirmationService.close();
              window.location.reload();
            })
          }
        });
      }
    } else if(this.selectedDatas.length > 1){
      const numcodsitos = this.selectedDatas.map(data => data.numcodsito);
      if(numcodsitos.length > 1){
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.rilevazioniSitoService.deletemultipleSelectedDatasRilevazioniSito(numcodsitos).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
              this.confirmationService.close();
              window.location.reload();
            });
          }
        });
      }
    }else{
      console.log('Please select rows to be deleted!');
    }
  }

  saveData(){
    const dtoOut = new RilevazioniSitoDto();
    dtoOut.idmisurazione = this.dataForm.get('idmisurazione').value;
    dtoOut.numcodsito = this.dataForm.get('numcodsito').value;
    dtoOut.protocollo = this.dataForm.get('protocollo').value;
    dtoOut.sistema = this.dataForm.get('sistema').value;
    dtoOut.azimuth = this.dataForm.get('azimuth').value;
    dtoOut.altcentrele = this.dataForm.get('altcentrele').value;
    dtoOut.antenna = this.dataForm.get('antenna').value;
    dtoOut.altezzaantenna = this.dataForm.get('altezzaantenna').value;
    dtoOut.guadagnoantenna = this.dataForm.get('guadagnoantenna').value;
    dtoOut.tiltmecca = this.dataForm.get('tiltmecca').value;
    dtoOut.titltelettr = this.dataForm.get('titltelettr').value;
    dtoOut.numerotrx = this.dataForm.get('numerotrx').value;
    dtoOut.potmaxsingtrx = this.dataForm.get('potmaxsingtrx').value;
    dtoOut.potmaxtotant = this.dataForm.get('potmaxtotant').value;
    dtoOut.attcei = this.dataForm.get('attcei').value;
    dtoOut.alpha24 = this.dataForm.get('alpha24').value;
    dtoOut.fattriduz = this.dataForm.get('fattriduz').value;
    dtoOut.pottotantfattrid = this.dataForm.get('pottotantfattrid').value;
    if( dtoOut.numcodsito &&
        dtoOut.protocollo &&
        dtoOut.sistema &&
        dtoOut.azimuth &&
        dtoOut.altcentrele &&
        dtoOut.antenna &&
        dtoOut.altezzaantenna &&
        dtoOut.guadagnoantenna &&
        dtoOut.tiltmecca &&
        dtoOut.titltelettr &&
        dtoOut.numerotrx &&
        dtoOut.potmaxsingtrx &&
        dtoOut.potmaxtotant &&
        dtoOut.attcei &&
        dtoOut.alpha24 &&
        dtoOut.fattriduz &&
        dtoOut.pottotantfattrid){
      if(this.newDialog == true){
        this.rilevazioniSitoService.postSaveNewRilevazioniSitoData(dtoOut).subscribe((res) => {
          if(res){
            // status code will be added acc to be response
            this.hideDataDialog();
            window.location.reload();
          }else{
            console.log('there is an error while posting')
          }
        })
      }else if(this.dataDialog== true){
        this.rilevazioniSitoService.putUpdatedOneDataRilevazioniSito(this.selectedIdProt, dtoOut).subscribe((res) => {
          if(res){
            // status code will be added acc to be response
            this.hideDataDialog();
            window.location.reload();
          }else{
            console.log('there is an error while updating')
          }
        })
      }
    }else{
      console.log('pls enter required values')
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
    const selectedData = this.datas.filter(data => this.selectedData.numcodsito  == data.numcodsito );
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
