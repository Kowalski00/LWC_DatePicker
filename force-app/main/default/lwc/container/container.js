import { LightningElement, api, track  } from 'lwc';

export default class Container extends LightningElement {

    @track dateContext = new Date();
    @track minDate = new Date();
    @track maxDate = new Date();
    @track dateSelected;

    connectedCallback() {
        this.maxDate.setDate(this.maxDate.getDate() + 7);
    }

    handleChangeDate(event) {

        let selectedDate = event.detail;

        this.dateSelected = this.formatDateISO8601(selectedDate);

    }

    formatDateISO8601(date){
        return date.getFullYear()
        +'-'+('0' + (date.getMonth() + 1)).slice(-2)
        +'-'+('0' + date.getDate()).slice(-2);
    }
    

}