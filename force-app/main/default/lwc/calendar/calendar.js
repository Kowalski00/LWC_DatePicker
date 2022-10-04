import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

const today = new Date();
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

const REGEX = /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/](\d{4})$/;

export default class Calendar extends NavigationMixin(LightningElement) {
    
    @track dateContext = new Date();
    @track selectedDate = '';
    @track error;

    @api label = '';
    @api placeholder = '';
    @api required = false;
    @api name;

    minDate;
    maxDate;
    lastClass; 
    isDatePickerInitialized;
    hasError = true;
    errorMessage = '';

    _isMouseOver;
    _hasFocus = false;
    _months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    @api
    get disabled(){
        return this._disabled;
    }
    
    set disabled(value){
        this._disabled = value;
    }

    @api
    get value(){
        return this.formatDate(this.selectedDate);
    }
    
    set value(value){
        if ((typeof value === 'string' || value instanceof String) && value !== '' ){
            value = this.convertDateToUTC(new Date(value));
        }
        this.selectedDate = value;
    }

    convertDateToUTC(date) { 
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }

    @api
    get min(){
        return this.minDate;
    }
    
    set min(value){
        this.minDate = new Date(value);
    }

    @api
    get max(){
        return this.maxDate;
    }
    
    set max(value){
        this.maxDate = new Date(value);
    }

    connectedCallback() {
        this.refreshDateNodes();
    }

    renderedCallback() {
        this.refreshDateNodes();
    }

    initCalendar(){
        this.refreshDateNodes();
        this.isDatePickerInitialized = true;
    }

    handleClick(){
        this.refreshDateNodes();
        this.isDatePickerInitialized = !this.isDatePickerInitialized;
    }

    handleFocus() {
        this._hasFocus = true;
    }

    handleBlur() {
        this.hasError = false;
        if(!this._isMouseOver){
            this.isDatePickerInitialized = false;
        }
    }

    handleMouseEnter(){
        this._isMouseOver = true;
    }

    handleMouseLeave(){
        this._isMouseOver = false;
    }

    handleInput(event){
        let input = event.target.value;
        var date = this.validateInput(input);
        if(!date) {
            this.errorMessage = "Sua entrada não é válida ou não corresponde ao formato permitido dd/MM/yyyy.";
            this.hasError = true;
        }
        else{
            this.hasError = false;
            this.selectedDate = new Date(date);
            this.dateContext = new Date(date);
            this.dispatchEvent(new CustomEvent('selectionchange', { detail: this.selectedDate }));
        }
        this.isDatePickerInitialized = false;
    }

    validateInput(input){
        var match = input.match(REGEX);
        return (this.validateDate(match)) ? new Date(match[3], match[2]-1, match[1]) : null;
    }

    validateDate(match){
        if(!match) return false;

        if (match[3] == 31 && (match[2] == 4 || match[2] == 6 || match[2] == 9 || match[2] == 11)) {
            return false; // 31st of a month with 30 days
        } else if (match[3] >= 30 && match[2] == 2) {
            return false; // February 30th or 31st
        } else if (match[2] == 2 && match[3] == 29 && !(match[1] % 4 == 0 && (match[1] % 100 != 0 || match[1] % 400 == 0))) {
            return false; // February 29th outside a leap year
        } else {
            return true; 
        }
    }

    isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    @api
    setSelected(event) {
        const selectedDate = this.template.querySelector('.selected');
        if (selectedDate) {
            selectedDate.className = this.lastClass;
        }
        
        const {date} = event.target.dataset;
        var dateSelected = new Date(date);
        
        if(!this.isValidDate(dateSelected)){
            const splitDate = date.split('/');
            dateSelected = new Date(splitDate[2],splitDate[1]-1,splitDate[0]);
        }

        if((dateSelected >= this.minDate && dateSelected <= this.maxDate) || (!this.minDate || !this.maxDate)){
            this.selectedDate = dateSelected;
            this.dateContext = dateSelected;
            this.lastClass = event.target.className;
            event.target.className = 'selected';
            this.isDatePickerInitialized = false;


            this.dispatchEvent(new CustomEvent('selectionchange', { detail: this.selectedDate }));

        }
    }

    refreshDateNodes() {
        this.dates = [];

        const currentDate = new Date(this.dateContext);
        const startMonth = new Date(this.dateContext).setDate(1);
        const dateLastDayOfMonth = new Date(currentDate.getFullYear(),currentDate.getMonth() + 1, 0);
        const numberWeeks = Math.round( ( (dateLastDayOfMonth - startMonth) / ONE_WEEK) + 1);

        let firstSunday = new Date(this.getSundayOfWeek( startMonth ));

        for (let week = 0; week <= numberWeeks; week++) {

            Array(7).fill(0).forEach((element, i) => {

                let className = '';
                let day = new Date(firstSunday);
                day.setDate( day.getDate() + (( 7 * week ) + i));

                if (day.getMonth() === this.dateContext.getMonth()) {
                    if (day === today) {
                        className = 'today';
                    }
                    else if(day < this.minDate || day > this.maxDate){
                        className = 'invalid';
                    } else {
                        className = 'valid';
                    }
                } else {
                    className = 'padder';
                }

                this.dates.push({
                    className,
                    formatted: day.toLocaleDateString('en-US'),
                    text: String(day.getDate())
                });
            });
        }
    }

    getSundayOfWeek(firstDay){
        firstDay = new Date(firstDay);
        var day = firstDay.getDay(),
            diff = firstDay.getDate() - day ; 
        return new Date(firstDay.setDate(diff));
    }

    previousMonth() {
        this.isDatePickerInitialized = false;
        this.dateContext.setMonth(this.dateContext.getMonth() - 1);
        this.initCalendar();
    }

    nextMonth() {
        this.isDatePickerInitialized = false;
        this.dateContext.setMonth(this.dateContext.getMonth() + 1 );
        this.initCalendar();
    }

    formatDate(date){
        if(!date) return;

        if (typeof this.selectedDate === 'string' || this.selectedDate instanceof String)
            return this.selectedDate;

        return ('0' + date.getDate()).slice(-2)+'/'+('0' + (date.getMonth() + 1)).slice(-2)+'/'+(date.getFullYear());
    }

    get getInputValue() {

        if(!this.selectedDate || this.selectedDate === '') return '';

        return this.formatDate(this.selectedDate);
    }

    get formattedSelectedDate() {

        if(!this.selectedDate || this.selectedDate === '') return;

        return this.formatDate(this.selectedDate);
    }

    get year() {
        return this.dateContext.getFullYear();
    }

    get month() {
        return this._months[ this.dateContext.getMonth() ];
    }
    
}