import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {ProtocolloCemService} from "./protocollo-cem.service";
import {ProtocolloCemDto} from "./protocollo-cem-dto";
@Component({
  selector: 'app-protocollo-cem',
  templateUrl: './protocollo-cem.component.html',
  styleUrls: ['./protocollo-cem.component.css'],
  providers: []

})
export class ProtocolloCemComponent implements OnInit{

  dataDialog: boolean;
  newDialog: boolean;
  dataShowDialog: boolean;
  selectedIdProt: number;
  datas: ProtocolloCemDto[];
  data: ProtocolloCemDto;
  selectedDatas: ProtocolloCemDto[];
  selectedData: ProtocolloCemDto;
  submittedData: boolean;
  isDataReadonly: boolean = false;


  sensoOptions: any[];
  numprotcollOptions: any[];
  subassegnazioneOptions: any[];
  tematicaOptions: any[];
  categoriaOptions: any[];
  sottocategoriaOptions: any[];
  azioneOptions: any[];
  protriferimeOptions: any[];
  numcodsitoOptions: any[];
  statoimpiantoOptions: any[];
  statoproceduraOptions: any[];
  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private protocolloCemService: ProtocolloCemService,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.protocolloCemService.sensoSelectboxValuesProtocolloCem().subscribe(res => {
      this.sensoOptions = res;
    })

    this.protocolloCemService.numprotcollSelectboxValuesProtocolloCem().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.numprotcollOptions = res.filter(item => item.protocollo !== '').map(item => item.protocollo);
        console.log(this.numprotcollOptions)
        this.protriferimeOptions = this.numprotcollOptions;
      }
    })

    this.protocolloCemService.tematicaSelectboxValuesProtocolloCem().subscribe(res => {
      this.tematicaOptions = res;
    })
    this.protocolloCemService.categoriaSelectboxValuesProtocolloCem().subscribe(res => {
      this.categoriaOptions = res;
    })
    this.protocolloCemService.sottocategoriaSelectboxValuesProtocolloCem().subscribe(res => {
      this.sottocategoriaOptions = res;
    })
    this.protocolloCemService.azioneSelectboxValuesProtocolloCem().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.azioneOptions = res.filter(item => item.valoretemrum !== '').map(item => item.valoretemrum);
        console.log(this.azioneOptions)
      }
    })

    this.protocolloCemService.subassegnazioneSelectboxValuesProtocolloCem().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.subassegnazioneOptions = res.filter(item => item.nomeoperatore !== '').map(item => item.nomeoperatore);
        console.log(this.subassegnazioneOptions)
      }
    })

    this.protocolloCemService.statoimpiantoSelectboxValuesProtocolloCem().subscribe(res => {
      this.statoimpiantoOptions = res;
    })
    this.protocolloCemService.statoproceduraSelectboxValuesProtocolloCem().subscribe(res => {
      this.statoproceduraOptions = res;
    })

    this.protocolloCemService.numcodsitoSelectboxValuesProtocolloCem().subscribe(res => {
      if (res && Array.isArray(res)) {
        this.numcodsitoOptions = res.filter(item => item.numcodsito !== '').map(item => item.numcodsito);
        console.log(this.numcodsitoOptions)
      }
    })

    // NOW BELOW PART USED FOR PROTRIFERIMEOPTIONS, WHAT IS THE CORRECT ONE?
    // this.protriferimeOptions = this.numprotcollOptions;
    //WHICH TABLE IS PROTRIFIRIMEOPTIONS?
    // this.protocolloCemService.protriferimeSelectboxValuesProtocolloCem().subscribe(res => {
    //   this.protriferimeOptions = res;
    // })
  }

  ngOnInit() {


    this.protocolloCemService.getProtocolloCemData().subscribe(data => {
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
      idprot: [''],
      senso: [''],
      data: [''],
      protocollo: ['', Validators.required],
      autore: [''],
      mittente: [''],
      destinatario: [''],
      oggetto: [''],
      protcollegato: [''],
      numprotcoll: [''],
      riscontrogeos: [''],
      subassegnazione: [''],
      note: [''],
      tematica: [''],
      categoria: [''],
      sottocategoria: [''],
      azione: [''],
      azionedup: [''],
      protriferime:[''],
      aie: [''],
      congiunta: [''],
      simulazione: [''],
      numcodsito: [''],
      statoimpianto: [''],
      statoprocedura:[''],
      scadenza: [''],
      scadenza2: [''],
      cdsdata: [''],
      cdsora: [''],
      notadigos: [''],
      dirigente:[''],
      funzionario:[''],
      commriscontro:[''],
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
      protcollegato: this.data?.protcollegato || '',
      numprotcoll: this.data?.numprotcoll || '',
      riscontrogeos: this.data?.riscontrogeos || '',
      subassegnazione: this.data?.subassegnazione || '',
      note: this.data?.note || '',
      tematica: this.data?.tematica || '',
      categoria: this.data?.categoria || '',
      sottocategoria: this.data?.sottocategoria || '',
      azione: this.data?.azione || '',
      azionedup: this.data?.azionedup || '',
      protriferime: this.data?.protriferime || '',
      aie: this.data?.aie || '',
      congiunta: this.data?.congiunta || '',
      simulazione: this.data?.simulazione || '',
      numcodsito: this.data?.numcodsito || '',
      statoimpianto: this.data?.statoimpianto || '',
      statoprocedura: this.data?.statoprocedura || '',
      scadenza: this.data?.scadenza || '',
      scadenza2: this.data?.scadenza2 || '',
      cdsdata: this.data?.cdsdata || '',
      cdsora: this.data?.cdsora || '',
      notadigos: this.data?.notadigos || '',
      dirigente: this.data?.dirigente || '',
      funzionario: this.data?.funzionario || '',
      commriscontro: this.data?.commriscontro || ''
    });
  }
  dataExpansionPatch(): void{
    this.data.protcollegato = this.dataForm.get('protcollegato').value ? this.dataForm.get('protcollegato').value : this.data?.protcollegato;
    this.data.numprotcoll = this.dataForm.get('numprotcoll').value ? this.dataForm.get('numprotcoll').value : this.data?.numprotcoll;
    this.data.azione = this.dataForm.get('azione').value ? this.dataForm.get('azione').value : this.data?.azione;
    this.data.azionedup = this.dataForm.get('azionedup').value ? this.dataForm.get('azionedup').value : this.data?.azionedup;
    this.data.protriferime = this.dataForm.get('protriferime').value ? this.dataForm.get('protriferime').value : this.data?.protriferime;
    this.data.numcodsito = this.dataForm.get('numcodsito').value ? this.dataForm.get('numcodsito').value : this.data?.numcodsito;
  }

  openNewData() {
    this.data = {};
    this.dataPatch();
    this.submittedData = false;
    this.newDialog = true;
    this.isDataReadonly = false;
  }

  editData(data: ProtocolloCemDto) {
    this.data = {...data};
    this.dataDialog = true;
    this.selectedIdProt = data.idprot;
    this.isDataReadonly = false;
    this.dataPatch();

    const dataValue = this.dataForm.get('data').value;
    const formattedDate = dataValue ? new Date(dataValue) : null;

    this.dataForm.controls['data'].setValue(formattedDate);

    const scadenzaValue = this.dataForm.get('scadenza').value;
    const formattedScadenza = scadenzaValue ? new Date(scadenzaValue) : null;
    this.dataForm.controls['scadenza'].setValue(formattedScadenza);

    const scadenza2Value = this.dataForm.get('scadenza2').value;
    const formattedScadenza2 = scadenza2Value ? new Date(scadenza2Value) : null;
    this.dataForm.controls['scadenza2'].setValue(formattedScadenza2);

    const cdsdataValue = this.dataForm.get('cdsdata').value;
    const formattedCdsdata = cdsdataValue ? new Date(cdsdataValue) : null;
    this.dataForm.controls['cdsdata'].setValue(formattedCdsdata);
  }


  showData(data: ProtocolloCemDto) {
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
  deleteData(data: ProtocolloCemDto) {
    if(data.idprot){
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.protocolloCemService.deleteSelectedDataProtocolloCem(data.idprot).subscribe(() => {
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
      const idprot = this.selectedDatas[0].idprot;
      if(idprot){
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.protocolloCemService.deleteSelectedDataProtocolloCem(idprot).subscribe(() => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Data Deleted', life: 3000 });
              this.confirmationService.close();
              window.location.reload();
            })
          }
        });
      }
    } else if(this.selectedDatas.length > 1){
      const idprots = this.selectedDatas.map(data => data.idprot);
      if(idprots.length > 1){
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.protocolloCemService.deletemultipleSelectedDatasProtocolloCem(idprots).subscribe(() => {
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
    const dtoOut = new ProtocolloCemDto();
    dtoOut.senso = this.dataForm.get('senso').value;
    const dateValue = this.dataForm.get('data').value;
    if (dateValue == '' || dateValue == null) {
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
    dtoOut.protcollegato = this.dataForm.get('protcollegato').value;
    let numprotcollControls = this.dataForm.get('numprotcoll').value;
    if (numprotcollControls && Array.isArray(numprotcollControls)) {
      let modifiedValues = [];
      for (let i = 0; i < numprotcollControls.length; i++) {
        let value = numprotcollControls[i].replace(/"/g, ''); // Remove double quotes
        let parts = value.split('/'); // Split by forward slash
        let numberValue = parts[0]; // Get the first part (before the slash)
        modifiedValues.push(numberValue);
      }
      dtoOut.numprotcoll = "[" + modifiedValues.join(",") + "]"; // Join values with comma and add brackets
    }


    // dtoOut.numprotcoll = this.dataForm.get('numprotcoll').value;

    dtoOut.riscontrogeos = this.dataForm.get('riscontrogeos').value;

    let subassegnazioneControls = this.dataForm.get('subassegnazione').value;
    if (subassegnazioneControls && Array.isArray(subassegnazioneControls)) {
      let modifiedSubassegnazioneValues = [];
      for (let i = 0; i < subassegnazioneControls.length; i++) {
        let value = subassegnazioneControls[i].replace(/"/g, ''); // Remove double quotes
        let parts = value.split('/'); // Split by forward slash
        let numberValue = parts[0]; // Get the first part (before the slash)
        modifiedSubassegnazioneValues.push(numberValue);
      }
      dtoOut.subassegnazione = "[" + modifiedSubassegnazioneValues.join(",") + "]"; // Join values with comma and add brackets
    }
    // dtoOut.subassegnazione = this.dataForm.get('subassegnazione').value;
    dtoOut.note = this.dataForm.get('note').value;
    dtoOut.tematica = this.dataForm.get('tematica').value;
    dtoOut.categoria = this.dataForm.get('categoria').value;
    dtoOut.sottocategoria = this.dataForm.get('sottocategoria').value;
    dtoOut.azione = this.dataForm.get('azione').value;
    dtoOut.azionedup = this.dataForm.get('azionedup').value;
    dtoOut.protriferime = this.dataForm.get('protriferime').value;
    dtoOut.aie = this.dataForm.get('aie').value;
    dtoOut.congiunta = this.dataForm.get('congiunta').value;
    dtoOut.simulazione = this.dataForm.get('simulazione').value;
    dtoOut.numcodsito = this.dataForm.get('numcodsito').value;
    dtoOut.statoimpianto = this.dataForm.get('statoimpianto').value;
    dtoOut.statoprocedura = this.dataForm.get('statoprocedura').value;

    const dateValueScadenza = this.dataForm.get('scadenza').value;
    if (dateValueScadenza == '' || dateValueScadenza == null) {
      dtoOut.scadenza = null;
    } else if (dateValueScadenza instanceof Date) {
      const day = String(dateValueScadenza.getDate()).padStart(2, '0');
      const month = String(dateValueScadenza.getMonth() + 1).padStart(2, '0');
      const year = dateValueScadenza.getFullYear();

      dtoOut.scadenza = `${year}-${month}-${day}`;
    }

    const dateValueScadenza2 = this.dataForm.get('scadenza2').value;
    if (dateValueScadenza2 == '' || dateValueScadenza2 == null) {
      dtoOut.scadenza2 = null;
    } else if (dateValueScadenza2 instanceof Date) {
      const day = String(dateValueScadenza2.getDate()).padStart(2, '0');
      const month = String(dateValueScadenza2.getMonth() + 1).padStart(2, '0');
      const year = dateValueScadenza2.getFullYear();

      dtoOut.scadenza2 = `${year}-${month}-${day}`;
    }

    const dateValueCdsdata = this.dataForm.get('cdsdata').value;
    if (dateValueCdsdata == '' || dateValueCdsdata == null) {
      dtoOut.cdsdata = null;
    } else if (dateValueCdsdata instanceof Date) {
      const day = String(dateValueCdsdata.getDate()).padStart(2, '0');
      const month = String(dateValueCdsdata.getMonth() + 1).padStart(2, '0');
      const year = dateValueCdsdata.getFullYear();

      dtoOut.cdsdata = `${year}-${month}-${day}`;
    }

    dtoOut.cdsora = this.dataForm.get('cdsora').value;
    dtoOut.notadigos = this.dataForm.get('notadigos').value;
    dtoOut.dirigente = this.dataForm.get('dirigente').value;
    dtoOut.funzionario = this.dataForm.get('funzionario').value;
    dtoOut.commriscontro = this.dataForm.get('commriscontro').value;
    if(dtoOut.protocollo){
      if(this.newDialog == true){
        this.protocolloCemService.postSaveNewProtocolloCemData(dtoOut).subscribe((res) => {
          if(res){
            // status code will be added acc to be response
            this.hideDataDialog();
            window.location.reload();
          }else{
            console.log('there is an error while posting')
          }
        })
      }else if(this.dataDialog== true){
        this.protocolloCemService.putUpdatedOneDataProtocolloCem(this.selectedIdProt, dtoOut).subscribe((res) => {
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
      console.log('pls enter protocollo values')
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
