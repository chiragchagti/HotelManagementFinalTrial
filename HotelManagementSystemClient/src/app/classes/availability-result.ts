export class AvailabilityResult {
    subTotal:number
    serviceCharges:number
    isAvailable:boolean
    availabilityByDate:{[key:string]: boolean}
    sgst:number
    cgst:number
    totalAmount:number
    constructor(){
        this.subTotal=0;
        this.serviceCharges=0
        this.isAvailable = false
        this.availabilityByDate = {}
        this.sgst=0
        this.cgst=0
        this.totalAmount=0
    }
}
