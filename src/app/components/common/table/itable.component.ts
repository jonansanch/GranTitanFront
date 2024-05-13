import {PageEvent} from "@angular/material/paginator";

/**
 * definition table component
 */
export interface ItableComponent {

    /**
     * edit event
     * @param element
     */
    edit(element: any);

    /**
     * delete event
     * @param element
     */
    delete(element: any);

    /**
     * Método que se encarga de capturar el cambio de página de la tabla
     * @param pageEvent Evento disparado cuando ocurre un cambio en el paginado
     */
    changedPage(pageEvent: PageEvent);

    /**
     * header columns
     */
    addColumns();
}
