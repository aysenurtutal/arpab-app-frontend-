import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: []
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    searchTerm: string = '';

    constructor() {
    }

    ngOnInit() {
        this.model = [

            {
                items: [
                    {
                        label: 'PROTOCOLLI', icon: 'pi pi-home',
                        items: [
                            {
                                label: 'Protocollo', icon: 'pi pi-fw pi-pencil', routerLink: ['protocollocem']
                            },
                            {
                                label: 'Vedi Protokolli GEOS', icon: 'pi pi-fw pi-pencil', routerLink: ['protocollogeos']
                            },

                        ]
                    },
                    {
                        label: 'GESTORI', icon: 'pi pi-home',
                        items: [
                            {
                                label: 'Catasto Sito Gestori CEM', icon: 'pi pi-fw pi-pencil', routerLink: ['codicesitogestori']
                            },
                            {
                                label: 'Scheda RadioElettrica', icon: 'pi pi-fw pi-pencil', routerLink: ['rilevazionisito']
                            },
                            {
                                label: 'Gestori CEM', icon: 'pi pi-fw pi-pencil', routerLink: ['gestori']
                            },
                        ]
                    },
                    {
                        label: 'MISURAZIONI', icon: 'pi pi-home',
                        items: [
                            {
                                label: 'Misure CEM', icon: 'pi pi-fw pi-pencil', routerLink: ['misurecemrf']
                            },
                            {
                                label: 'Sondestrum', icon: 'pi pi-fw pi-pencil', routerLink: ['sondestrum']
                            },
                            {
                                label: 'Strumenticem', icon: 'pi pi-fw pi-pencil', routerLink: ['strumenticem']
                            },
                        ]
                    },
                    {
                        label: 'ESPORTA DOCUMENTI', icon: 'pi pi-home',
                        items: [
                            {
                                label: 'SCEGLI IL DOCUMENTO DA CREARE', icon: 'pi pi-fw pi-pencil', routerLink: ['']
                            },
                        ]
                    },
                    {
                        label: 'IMPORTA PROTOCOLLO GEOS', icon: 'pi pi-home',
                        items: [
                            {
                                label: 'IMPORTA PROTOCOLLO GEOS', icon: 'pi pi-fw pi-pencil', routerLink: ['']
                            },
                        ]
                    }
                ]
            }
        ];
    }

    search(): void {
       console.log('searched data here for all part')
    }

}
