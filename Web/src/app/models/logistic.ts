export class LogisticTransaction {
    consignmentNumber: string;
    goodsIssueRefNumber: string;
    purchaseOrderRefNumber: string;
    supplierNumber: string;
    shipToParty: string;
    pickedupDatetime: Date;
    expectedDeliveryDatetime: Date;
    actualDeliveryDatetime: Date;
    hazardousMaterial: string;
    packagingInstruction: string;
}