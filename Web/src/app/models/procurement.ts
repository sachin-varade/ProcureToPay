
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
    invoicePartyId : string;
    vatNo : string;
    termsOfDelivery: string;
}
 
export class OrderMaterial {
    pos: number;    
    productName: string;
    productDescription: string;
    quantity: number;
    quantityUnit: string;
    pricePerUnit: number;
    currency: string;
    expectedDeliveryDate: Date;
    netAmount: number;
}

export class GoodsReceipt {
    goodsReceiptNumber: string;
	goodsReceiptDate: Date;
	purchaseOrderRefNumber: string;
	goodIssueNumber: string;
	consignmentNumber: string;
	purchaserCompany: string;
	purchaserCompanyDept: string;
	purchaserContactPersonName: string;
	purchaserContactPersonAddress: string;
	purchaserContactPersonPhone: string;
	purchaserContactPersonEmail: string;
	deliverToPersonName: string;
    deliveryAddress: string;
    materialList: Array<GoodsReceiptMaterial>;
	totalOrderAmount: Number;
}


export class GoodsReceiptMaterial {
    pos: number;  	
	productName: string;
	productDescription: string;
	quantity: Number;
	quantityUnit: string;
	pricePerUnit: Number;
	currency: string;
	netAmount: Number
	dispatchedQuantity: Number;
	sellerProductCode : string; 
	expectedDeliveryDate: Date;
	batchNumber : string;
    receivedQuantity: Number;
    fdf: boolean;
    fdfDisabled: boolean;
}