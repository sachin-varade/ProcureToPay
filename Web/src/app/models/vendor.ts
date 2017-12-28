
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
	// --- below added for goods issue.
	goodsIssueNumber : string;
	logisticProvider : string;

}

export class  VendorMaterial {
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
}

export class  VendorInvoice {
	invoiceNumber: string;
	invoiceDate: Date;
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
}