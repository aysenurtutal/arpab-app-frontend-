import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {CodiceSitoGestoriService} from "./codice-sito-gestori.service";
import {CodiceSitoGestoriDto} from "./codice-sito-gestori-dto";
@Component({
  selector: 'app-codice-sito-gestori',
  templateUrl: './codice-sito-gestori.component.html',
  styleUrls: ['./codice-sito-gestori.component.css'],
  providers: []

})
export class CodiceSitoGestoriComponent implements OnInit{

  dataDialog: boolean;
  newDialog: boolean;
  dataShowDialog: boolean;
  selectedIdProt: number;
  datas: CodiceSitoGestoriDto[];
  data: CodiceSitoGestoriDto;
  selectedDatas: CodiceSitoGestoriDto[];
  selectedData: CodiceSitoGestoriDto;
  submittedData: boolean;
  isDataReadonly: boolean = false;


  gestoreOptions: any[];
  regioneOptions: any[];
  provinciaOptions: any[];
  comuneOptions: any[];
  protcollOptions: any[];

  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private codiceSitoGestoriService: CodiceSitoGestoriService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.codiceSitoGestoriService.gestoreSelectboxValuesCodiceSitoGestori().subscribe(res => {
      this.gestoreOptions = res;
    })
    this.codiceSitoGestoriService.regioneSelectboxValuesCodiceSitoGestori().subscribe(res => {
      this.regioneOptions = res;
    })
    this.codiceSitoGestoriService.provinciaSelectboxValuesCodiceSitoGestori().subscribe(res => {
      this.provinciaOptions = res;
    })
    this.codiceSitoGestoriService.comuneSelectboxValuesCodiceSitoGestori().subscribe(res => {
      this.comuneOptions = res;
    })
    this.codiceSitoGestoriService.protcollSelectboxValuesCodiceSitoGestori().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.protcollOptions = res.filter(item => item.protocollo !== '').map(item => item.protocollo);
      }
    })
  }

  ngOnInit() {

    this.codiceSitoGestoriService.getCodiceSitoGestoriData().subscribe(data => {
      this.datas = data;
    });
    this.initializeForm();
  }
  parseProtcoll(protcoll: string): string[] {
    if (!protcoll) {
      return [];
    }

    // Remove backslashes from the string
    protcoll = protcoll.replace(/\\/g, '');

    // Parse the JSON string into an array
    return JSON.parse(protcoll);
  }

  initializeForm(): void {
    this.dataForm = this.fb.group({
      numcodsito: ['', Validators.required],
      numcodsitoold: ['', Validators.required],
      nomesito: ['', Validators.required],
      gestore: ['', Validators.required],
      tipoimpianto: [''],
      regione: [''],
      provincia: [''],
      comune: [''],
      indirizzo: [''],
      numlocosscem: [''],
      locosscem: [''],
      coordinatelong: [''],
      coordinatelat: [''],
      protocollocheck: [''],
      protcoll: [''],
      linkcondivisia: [''],
      dataprot: [''],
      statoimpianto: [''],
    });
  }

  dataPatch(): void{
    this.dataForm.patchValue({
      numcodsito: this.data?.numcodsito || '',
      numcodsitoold: this.data?.numcodsitoold || '',
      nomesito: this.data?.nomesito || '',
      gestore: this.data?.gestore || '',
      tipoimpianto: this.data?.tipoimpianto || '',
      regione: this.data?.regione || '',
      provincia: this.data?.provincia || '',
      comune: this.data?.comune || '',
      indirizzo: this.data?.indirizzo || '',
      numlocosscem: this.data?.numlocosscem || '',
      locosscem: this.data?.locosscem || '',
      coordinatelong: this.data?.coordinatelong || '',
      coordinatelat: this.data?.coordinatelat || '',
      protocollocheck: this.data?.protocollocheck || '',
      protcoll: this.data?.protcoll || '',
      linkcondivisia: this.data?.linkcondivisia || '',
      dataprot: this.data?.dataprot || '',
      statoimpianto: this.data?.statoimpianto || '',
    });
  }

  openNewData() {
    this.data = {};
    this.dataPatch();
    this.submittedData = false;
    this.newDialog = true;
    this.isDataReadonly = false;
  }

  editData(data: CodiceSitoGestoriDto) {
    this.data = {...data};
    this.dataDialog = true;
    this.selectedIdProt = data.numcodsito;
    this.isDataReadonly = false;
    this.dataPatch();
  }


  showData(data: CodiceSitoGestoriDto) {
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
  navigateTo() {
    const url = 'https://dropfacile.it/arpab/admin/codicesitogestori';
    window.open(url, '_blank');
  }
  deleteData(data: CodiceSitoGestoriDto) {
    if(data.numcodsito){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.codiceSitoGestoriService.deleteSelectedDataCodiceSitoGestori(data.numcodsito).subscribe(() => {
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
            this.codiceSitoGestoriService.deleteSelectedDataCodiceSitoGestori(numcodsito).subscribe(() => {
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
            this.codiceSitoGestoriService.deletemultipleSelectedDatasCodiceSitoGestori(numcodsitos).subscribe(() => {
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
    const dtoOut = new CodiceSitoGestoriDto();
    dtoOut.numcodsito = this.dataForm.get('numcodsito').value;
    dtoOut.numcodsitoold = this.dataForm.get('numcodsitoold').value;
    dtoOut.nomesito = this.dataForm.get('nomesito').value;
    dtoOut.gestore = this.dataForm.get('gestore').value;
    dtoOut.tipoimpianto = this.dataForm.get('tipoimpianto').value;
    dtoOut.regione = this.dataForm.get('regione').value;
    dtoOut.provincia = this.dataForm.get('provincia').value;
    dtoOut.comune = this.dataForm.get('comune').value;
    dtoOut.indirizzo = this.dataForm.get('indirizzo').value;
    dtoOut.numlocosscem = this.dataForm.get('numlocosscem').value;
    dtoOut.locosscem = this.dataForm.get('locosscem').value;
    dtoOut.coordinatelong = this.dataForm.get('coordinatelong').value;
    dtoOut.coordinatelat = this.dataForm.get('coordinatelat').value;
    dtoOut.protocollocheck = this.dataForm.get('protocollocheck').value;
    dtoOut.protcoll = this.dataForm.get('protcoll').value;
    dtoOut.linkcondivisia = this.dataForm.get('linkcondivisia').value;
    if( dtoOut.numcodsito && dtoOut.numcodsitoold && dtoOut.nomesito && dtoOut.gestore){
      if(this.newDialog == true){
        this.codiceSitoGestoriService.postSaveNewCodiceSitoGestoriData(dtoOut).subscribe((res) => {
          if(res){
            // status code will be added acc to be response
            this.hideDataDialog();
            window.location.reload();
          }else{
            console.log('there is an error while posting')
          }
        })
      }else if(this.dataDialog== true){
        this.codiceSitoGestoriService.putUpdatedOneDataCodiceSitoGestori(this.selectedIdProt, dtoOut).subscribe((res) => {
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
