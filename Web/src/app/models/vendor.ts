
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