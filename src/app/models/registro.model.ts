export class Registro {

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public created: Date;

    constructor( format: string, text: string ){
        this.format = format;
        this.text = text;
        this.created = new Date();
        this.setType();
    }

    private setType(){
        const textStart = this.text.substring(0,4);
        const data = textStart.includes('http') ? 
        {type: 'url', icon:'globe'} : ( textStart.includes('geo') ? {type: 'geo', icon:'pin'} : {type: 'text', icon:'create'} );
        this.type = data.type;
        this.icon = data.icon;
    }

}