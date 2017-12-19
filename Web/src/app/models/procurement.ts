
export class PurchaseOrder {
    purchaseOrderNumber: string;
    purchaseOrderDate: Date;
    shoppingOrderNumber: string;
    shoppingOrderDate: Date;
    orderBy: string;
    buyerCompany: string;
    buyerDepartment: string;
    buyerContactPerson: string;
    buyerContactPersonAddress: string;
    buyerContactPersonPhone: string;
    buyerContactPersonEmail: string;
    supplierName: string;
    supplierUniqueNo: string;
    supplierContactPerson: string;
    supplierContactPersonAddress: string;
    supplierContactPersonPhone: string;
    supplierContactPersonEmail: string;
    deliverToPersonName: string;
    deliverToPersonAddress: string;
    invoiceAddress: string;
    totalOrderAmount: string;
    accountingType: string;
    costCenter: string;
    glAccount: string;
    termsOfPayment: string;
    internalNotes: string;
    externalNotes: string;
    orderedMaterial: Array<OrderMaterial>;
    status: string;
}
 
export class OrderMaterial {
    orderMaterialId: number;
    buyerMaterialGroup: string;
    productName: string;
    productDescription: string;
    quantity: number;
    quantityUnit: string;
    pricePerUnit: number;
    currency: string;
    netAmount: number;
}