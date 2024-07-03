export class Product {
    constructor(
                public id : number,
                public sku : String,
                public name : String,
                public description : String,
                public unitPrice : number,
                public imgUrl : String,
                public active : boolean,
                public unitsInStock : number,
                public dateCreated : Date,
                public lastUpdate : Date
    ){}
}
