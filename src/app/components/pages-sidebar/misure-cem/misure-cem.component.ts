import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {MisureCemService} from "./misure-cem.service";
import {MisureCemDto} from "./misure-cem-dto";
@Component({
  selector: 'app-misure-cem',
  templateUrl: './misure-cem.component.html',
  styleUrls: ['./misure-cem.component.css'],
  providers: []

})
export class MisureCemComponent implements OnInit{

  dataDialog: boolean;
  newDialog: boolean;
  dataShowDialog: boolean;
  selectedIdProt: number;
  datas: MisureCemDto[];
  data: MisureCemDto;
  selectedDatas: MisureCemDto[];
  selectedData: MisureCemDto;
  submittedData: boolean;
  isDataReadonly: boolean = false;


  attivitaOptions: any[];
  tipologiaOptions: any[];
  comuneOptions: any[];
  provinciaOptions: any[];
  numcodsitoOptions: any[];
  modellostrumOptions: any[];
  sondaCollegataOptions: any[];
  taraturastrumOptions: any[];

  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private misureCemService: MisureCemService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.misureCemService.attivitàSelectboxValuesMisureCem().subscribe(res => {
      this.attivitaOptions = res;
    })
    this.misureCemService.tipologiaSelectboxValuesMisureCem().subscribe(res => {
      this.tipologiaOptions = res;
    })
    this.misureCemService.comuneSelectboxValuesMisureCem().subscribe(res => {
      this.comuneOptions = res;
    })
    this.misureCemService.provinciaSelectboxValuesMisureCem().subscribe(res => {
      this.provinciaOptions = res;
    })
    this.misureCemService.numcodsitoSelectboxValuesRilevazioniSito().subscribe(res => {
      this.numcodsitoOptions = res;
    })
    this.misureCemService.modellostrumSelectboxValuesRilevazioniSito().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.modellostrumOptions = res.filter(item => item.modstrum !== '').map(item => item.modstrum);
      }
    })
    this.misureCemService.sondaCollegataSelectboxValuesRilevazioniSito().subscribe(res => {
      this.sondaCollegataOptions = res;
    })
    this.misureCemService.taraturastrumSelectboxValuesRilevazioniSito().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.taraturastrumOptions = res.filter(item => item.tartstrum !== '').map(item => item.tartstrum);
      }
    })
  }

  ngOnInit() {
    this.misureCemService.getMisureCemData().subscribe(data => {
      this.datas = data;
    });
    this.initializeForm();
  }
  parseDataFields(dataField: string): string[] {
    if (!dataField) {
      return [];
    }

    // Remove backslashes from the string
    dataField = dataField.replace(/\\/g, '');

    // Parse the JSON string into an array
    return JSON.parse(dataField);
  }
  initializeForm(): void {
    this.dataForm = this.fb.group({
      attività: [''],

      idimiscem: [''],
      sopralluogo: [''],
      tipologia: [''],
      comune: [''],
      provincia: [''],
      codsito: [''],
      data: [''],
      modstrum: [''],
      sonda: [''],
      tartstrum: [''],
      puntodimisura: [''],
      descpuntomis: [''],
      latitudine: [''],
      longitudine: [''],
      valeffrmsvm: [''],
      valeffrmsut: [''],
      permcontgio: [''],
      limleggevm: [''],
      limleggeut: [''],
      rangefreq: [''],
      gammamisura: [''],
      sovraccarico: [''],
      risoluzione: [''],
      misisotrop: ['']
    });
  }


  dataPatch(): void {
    this.dataForm.patchValue({
      attività: this.data?.attività || '',

      idimiscem: this.data?.idimiscem || '',
      sopralluogo: this.data?.sopralluogo || '',
      tipologia: this.data?.tipologia || '',
      comune: this.data?.comune || '',
      provincia: this.data?.provincia || '',
      codsito: this.data?.codsito || '',
      data: this.data?.data || '',
      modstrum: this.data?.modstrum || '',
      sonda: this.data?.sonda || '',
      tartstrum: this.data?.tartstrum || '',
      puntodimisura: this.data?.puntodimisura || '',
      descpuntomis: this.data?.descpuntomis || '',
      latitudine: this.data?.latitudine || '',
      longitudine: this.data?.longitudine || '',
      valeffrmsvm: this.data?.valeffrmsvm || '',
      valeffrmsut: this.data?.valeffrmsut || '',
      permcontgio: this.data?.permcontgio || '',
      limleggevm: this.data?.limleggevm || '',
      limleggeut: this.data?.limleggeut || '',
      rangefreq: this.data?.rangefreq || '',
      gammamisura: this.data?.gammamisura || '',
      sovraccarico: this.data?.sovraccarico || '',
      risoluzione: this.data?.risoluzione || '',
      misisotrop: this.data?.misisotrop || ''
    });
  }

  openNewData() {
    this.data = {};
    this.dataPatch();
    this.submittedData = false;
    this.newDialog = true;
    this.isDataReadonly = false;
  }

  editData(data: MisureCemDto) {
    this.data = {...data};
    this.dataDialog = true;
    this.selectedIdProt = data.idimiscem;
    this.isDataReadonly = false;
    this.dataPatch();

    const dataValue = this.dataForm.get('data').value;
    const formattedDate = dataValue ? new Date(dataValue) : null;
    this.dataForm.controls['data'].setValue(formattedDate);

  }


  showData(data: MisureCemDto) {
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
  deleteData(data: MisureCemDto) {
    if(data.idimiscem){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.misureCemService.deleteSelectedDataMisureCem(data.idimiscem).subscribe(() => {
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
      const idprot = this.selectedDatas[0].idimiscem;
      if(idprot){
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.misureCemService.deleteSelectedDataMisureCem(idprot).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
              this.confirmationService.close();
              window.location.reload();
            })
          }
        });
      }
    } else if(this.selectedDatas.length > 1){
      const idprots = this.selectedDatas.map(data => data.idimiscem);
      if(idprots.length > 1){
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.misureCemService.deletemultipleSelectedDatasMisureCem(idprots).subscribe(() => {
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
    const dtoOut = new MisureCemDto();
    // DB DE YOK ATTIVIA
    dtoOut.attività = this.dataForm.get('attività').value;

    dtoOut.tipologia = this.dataForm.get('tipologia').value;
    dtoOut.comune = this.dataForm.get('comune').value;
    dtoOut.provincia = this.dataForm.get('provincia').value;
    dtoOut.codsito = this.dataForm.get('codsito').value;
    const dateValue = this.dataForm.get('data').value;
    if (dateValue == '' || dateValue == null) {
      dtoOut.data = null;
    } else if (dateValue instanceof Date) {
      const day = String(dateValue.getDate()).padStart(2, '0');
      const month = String(dateValue.getMonth() + 1).padStart(2, '0');
      const year = dateValue.getFullYear();

      dtoOut.data = `${year}-${month}-${day}`;
    }
    dtoOut.modstrum = this.dataForm.get('modstrum').value;
    dtoOut.sonda = this.dataForm.get('sonda').value;
    dtoOut.tartstrum = this.dataForm.get('tartstrum').value;
    dtoOut.puntodimisura = this.dataForm.get('puntodimisura').value;
    dtoOut.descpuntomis = this.dataForm.get('descpuntomis').value;
    dtoOut.latitudine = this.dataForm.get('latitudine').value;
    dtoOut.longitudine = this.dataForm.get('longitudine').value;

      if(this.newDialog == true){
        this.misureCemService.postSaveNewMisureCemData(dtoOut).subscribe((res) => {
          if(res){
            // status code will be added acc to be response
            this.hideDataDialog();
            window.location.reload();
          }else{
            console.log('there is an error while posting')
          }
        })
      }else if(this.dataDialog== true){
        this.misureCemService.putUpdatedOneDataMisureCem(this.selectedIdProt, dtoOut).subscribe((res) => {
          if(res){
            // status code will be added acc to be response
            this.hideDataDialog();
            window.location.reload();
          }else{
            console.log('there is an error while updating')
          }
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
    const selectedData = this.datas.filter(data => this.selectedData.idimiscem  == data.idimiscem );
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
