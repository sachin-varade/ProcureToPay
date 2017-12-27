
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
}

export class  VendorMaterial {
	MaterialId: string;
	ProductName: string;
	ProductDescription: string;
	Quantity: Number;
	QuantityUnit: string;
	PricePerUnit: Number;
	Currency: Number;
	NetAmount: Number
	DispatchedQuantity: Number;
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