
export class  FinanceInvoice {
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
	materialList: Array<Material> = new Array<Material>();
	statusUpdates: Array<StatusUpdates> = new Array<StatusUpdates>();
}

export class  StatusUpdates {
	status: string;
	updatedBy: number;
	updatedOn: Date;
}

export class  Material {
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

export class PaymentProposal {
	paymentProposalNumber : string;
	proposalDate : Date;
	vendorUniqueId : string;
	vendorBankAccountNumber : string;
	vendorBankAccountType : string;
	vendorBankUniqueId : string;
	createdBy : string;
	createdDate : Date;
	paymentProposalDetails : Array<PaymentProposalDetail> = new Array<PaymentProposalDetail>();
}

export class PaymentProposalDetail {
	paymentProposalNumber : string;
	proposalDate : Date;
	tax : Number;
	amount : Number;
	poReferenceNumber : string;
	invoiceRefernceNumber : string;
	status: string;
	bankProcessingDate : Date;
}