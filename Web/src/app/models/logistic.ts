export class LogisticTransaction {
    consignmentNumber: string;
    salesOrderRefNumber : string;
    goodsIssueRefNumber: string;
    purchaseOrderRefNumber: string;
    supplierNumber: string;
    shipToParty: string;
    pickedupDatetime: Date;
    expectedDeliveryDatetime: Date;
    actualDeliveryDatetime: Date;
    hazardousMaterial: string;
    packagingInstruction: string;
    route : string;
    vehicleId : string;
    status : string;
}