
export class VendorSalesOrder {
	salesOrderNumber: string;
	purchaseOrderRefNumber: string;
	purchaseOrderRefDate: Date;
	purchaserCompany: string;
	purchaserCompanyDept: string;
	purchaserContactPersonName: string;
	purchaserContactPersonAddress: string;
	purchaserContactPersonPhone: string;
	purchaserContactPersonEmail: string;
	deliverToPersonName: string;
	deliveryAddress: string;
	invoicePartyId: string;
	invoicePartyAddress: string;
	materialList: Array<VendorMaterial> = new Array<VendorMaterial>();
	status: string;
	statusUpdatedOn : Date;
	statusUpdatedBy : string;
	vatNo : string;
	termsOfDelivery: string;
	totalOrderAmount: string;
	supplierCode: string;
	// --- below added for goods issue.
	goodsIssueNumber : string;
	logisticProvider : string;
	logisticsConsignmentNumber : string;

}

export class  VendorMaterial {
	pos: number;  
	materialId: string;
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
	// --- below added for goods issue.
	batchNumber : string;
}

export class GoodsIssue{
	goodsIssueNumber: string;
	salesOrderNumber: string;
	deliverToPersonName: string;
	deliveryAddress: string;
	logisticsProvider: string;
	materialList: Array<VendorMaterial> = new Array<VendorMaterial>();
	goodsIssueDate: Date;
}

export class  VendorInvoice {
	invoiceNumber: string;
	invoiceDate: Date;
	invoicePublishDate: Date;
	goodsIssueNumber: string;
	goodsIssueDate: Date;
	salesOrderNumber: string;
	purchaseOrderRefNumber: string;
	purchaseOrderRefDate: Date;
	supplierCode: string;
	purchaserCompany: string;
	purchaserCompanyDept: string;
	purchaserContactPersonName: string;
	purchaserContactPersonAddress: string;
	purchaserContactPersonPhone: string;
	purchaserContactPersonEmail: string;
	deliverToPersonName: string;
	deliveryAddress: string;
	invoicePartyId: string;
	invoiceAddress: string;
	grossAmount: number;
	vatNumber: string;
	materialList: Array<VendorMaterial> = new Array<VendorMaterial>();
	statusUpdates: Array<StatusUpdates> = new Array<StatusUpdates>();
	currentStatus: string = "Created";
}


export class  StatusUpdates {
	status: string;
	updatedBy: number;
	updatedOn: Date;
}

export class Vendor {
	name : string;
	displayName : string;
	uniqueId : string;
	bankAccountNumber : string;
	bankAccountType : string;
	bankUniqueId : string;
}