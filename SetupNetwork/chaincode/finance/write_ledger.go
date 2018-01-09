/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)


//------------------------------------------------------------------------------------
//	Save finance invoice
//------------------------------------------------------------------------------------
func saveFinanceInvoice(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveFinanceInvoice..")

	if len(args) != 25 {
		fmt.Println("Incorrect number of arguments. Expecting 25 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 25")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);
	fmt.Println("Arguments :"+args[13]+","+args[14]+","+args[15]+","+args[16]+","+args[17]+","+args[18]+","+args[19]);

	allBAsBytes, err := stub.GetState("allFinanceInvoiceNumbers")
	if err != nil {
		return shim.Error("Failed to get all Finance Invoice Numbers")
	}
	var allb AllFinanceInvoiceNumbers
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Finance Invoice Numbers")
	}
	if checkDuplicateId(allb.InvoiceNumbers, args[0]) == 0{
		return shim.Error("Duplicate Finance Invoice Number - "+ args[0])
	}

	var bt FinanceInvoice
	bt.InvoiceNumber					= args[0]
	bt.InvoiceDate						= args[1]
	bt.GoodsIssueNumber					= args[2]	
	bt.GoodsIssueDate					= args[3]		
	bt.SalesOrderNumber 				= args[4]
	bt.PurchaseOrderRefNumber 			= args[5]
	bt.PurchaseOrderRefDate 			= args[6]
	bt.SupplierCode 					= args[7]
	bt.PurchaserCompany 				= args[8]
	bt.PurchaserCompanyDept 			= args[9]
	bt.PurchaserContactPersonName 		= args[10]
	bt.PurchaserContactPersonAddress 	= args[11]
	bt.PurchaserContactPersonPhone 		= args[12]
	bt.PurchaserContactPersonEmail 		= args[13]
	bt.DeliverToPersonName 				= args[14]
	bt.DeliveryAddress 					= args[15]
	bt.InvoicePartyId 					= args[16]
	bt.InvoiceAddress 					= args[17]
	bt.GrossAmount 						= args[18]
	bt.VatNumber 						= args[19]
	bt.InvoicePublishDate 						= args[21]
	bt.CurrentStatus 						= args[22]

	var st StatusUpdates
	st.Status = args[22]
	st.UpdatedBy = args[23]
	st.UpdatedOn = args[24]
	bt.StatusUpdates = append(bt.StatusUpdates, st)	

	var material Material
	if args[20] != "" {
		p := strings.Split(args[20], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.MaterialId 		= 		c[0]
			material.ProductName 		= 		c[1]
			material.ProductDescription = 		c[2]
			material.Quantity 			= 		c[3]
			material.QuantityUnit 		= 		c[4]
			material.PricePerUnit 		= 		c[5]
			material.Currency 			= 		c[6]
			material.NetAmount 			= 		c[7]
			material.DispatchedQuantity	= 		c[8]
			material.BatchNumber		= 		c[9]
			material.ExpectedDeliveryDate		= 		c[10]
			bt.MaterialList = append(bt.MaterialList, material)
		}
	}
	
	//Commit Sales Order entry to ledger
	fmt.Println("saveFinanceInvoice - Commit Finance Invoice To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.InvoiceNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Abattoirs Array	
	allb.InvoiceNumbers = append(allb.InvoiceNumbers, bt.InvoiceNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allFinanceInvoiceNumbers", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//------------------------------------------------------------------------------------
//	Update finance invoice
//------------------------------------------------------------------------------------
func updateFinanceInvoiceStatus(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	fmt.Println("Running updateFinanceInvoice..")

	if len(args) != 4 {
		fmt.Println("Incorrect number of arguments. Expecting 4 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]);

	var response = getAllFinanceInvoices(stub, "po", args[0])
	var allDetailsObj AllFinanceInvoiceDetails
	json.Unmarshal([]byte(string(response.Payload)), &allDetailsObj)
	if len(allDetailsObj.FinanceInvoices) != 0 {    
		for j := range allDetailsObj.FinanceInvoices{   					
			var bt FinanceInvoice
			sbAsBytes, err := stub.GetState(allDetailsObj.FinanceInvoices[j].InvoiceNumber)
			if err != nil {
				return shim.Error("Failed to get invoice.")
			}
			json.Unmarshal(sbAsBytes, &bt)
			bt.CurrentStatus 						= args[1]
			var st StatusUpdates
			st.Status = args[1]
			st.UpdatedBy = args[2]
			st.UpdatedOn = args[3]
			bt.StatusUpdates = append(bt.StatusUpdates, st)	
			
			//Commit Sales Order entry to ledger
			fmt.Println("updateFinanceInvoice - Commit Finance Invoice To Ledger");
			btAsBytes, _ := json.Marshal(bt)
			err = stub.PutState(bt.InvoiceNumber, btAsBytes)
			if err != nil {
				return shim.Error(err.Error())
			}
		}
	}
	return shim.Success(nil)
}

//------------------------------------------------------------------------------------
//	Update finance invoice
//------------------------------------------------------------------------------------
func updateFinanceInvoice(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running updateFinanceInvoice..")

	if len(args) != 4 {
		fmt.Println("Incorrect number of arguments. Expecting 4 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]);

	var bt FinanceInvoice
	sbAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Purchase Order record.")
	}
	json.Unmarshal(sbAsBytes, &bt)

	bt.CurrentStatus 						= args[1]

	var st StatusUpdates
	st.Status = args[1]
	st.UpdatedBy = args[2]
	st.UpdatedOn = args[3]
	bt.StatusUpdates = append(bt.StatusUpdates, st)	
	
	//Commit Sales Order entry to ledger
	fmt.Println("updateFinanceInvoice - Commit Finance Invoice To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.InvoiceNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create Payment Proposal block
func savePaymentProposal(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running savePaymentProposal..")

	if len(args) != 11 {
		fmt.Println("Incorrect number of arguments. Expecting 11")
		return shim.Error("Incorrect number of arguments. Expecting 11")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]);

	//check duplicate 	
	allBAsBytes, err := stub.GetState("allPaymentProposalNumbers")
	if err != nil {
		return shim.Error("Failed to get all Payment Proposal Numbers")
	}
	var allb AllPaymentProposalNumbers
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Payment Proposals")
	}
	if checkDuplicateId(allb.PaymentProposalNumbers, args[0]) == 0{
		return shim.Error("Duplicate PaymentProposalNumber - "+ args[0])
	}

	var bt PaymentProposal
	bt.PaymentProposalNumber				= args[0]
	bt.PaymentProposalDate					= args[1]
	bt.VendorUniqueNumber					= args[2]
	bt.VendorBankAccountNumber				= args[3]	
	bt.VendorBankAccountType				= args[4]
	bt.BankUniqueid							= args[5]
	bt.CreatedBy							= args[6]
	bt.CreationDate							= args[7]
	bt.BuyerBankAccountNumber				= args[8]
	bt.BuyerBankAccountType					= args[9]

	var paymentProposalDetails PaymentProposalDetails
	
	if args[10] != "" {
		p := strings.Split(args[10], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			paymentProposalDetails.PaymentProposalNumber 		= c[0]
			paymentProposalDetails.ProposedPaymentDate			= c[1]
			paymentProposalDetails.Tax							= c[2]
			paymentProposalDetails.Amount 						= c[3]
			paymentProposalDetails.PoReferenceNumber 			= c[4]
			paymentProposalDetails.InvoiceReferenceNumber 		= c[5]
			paymentProposalDetails.Status 						= c[6]
			paymentProposalDetails.BankProcessingDate			= c[7]
			bt.ProposalDetails	= append(bt.ProposalDetails, paymentProposalDetails)
		}
	}

	//Commit Inward entry to ledger
	fmt.Println("savePaymentProposal - Commit Payment Proposal To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PaymentProposalNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	allb.PaymentProposalNumbers = append(allb.PaymentProposalNumbers, bt.PaymentProposalNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allPaymentProposalNumbers", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


//Create Payment Proposal block
func processPayment(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running processPayment..")

	if len(args) != 2 {
		fmt.Println("Incorrect number of arguments. Expecting 2")
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Arguments :"+args[0] +","+args[1]);
	var bt PaymentProposal
	sbAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Payment Proposal Number ")
	}

	json.Unmarshal(sbAsBytes, &bt)

	bt.PaymentProposalNumber = args[0]
	var paymentProposalDetails PaymentProposalDetails
	var nbt PaymentProposal
	if args[1] != "" {
		p := strings.Split(args[1], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			paymentProposalDetails.PaymentProposalNumber 		= c[0]
			paymentProposalDetails.ProposedPaymentDate			= c[1]
			paymentProposalDetails.Tax							= c[2]
			paymentProposalDetails.Amount 						= c[3]
			paymentProposalDetails.PoReferenceNumber 			= c[4]
			paymentProposalDetails.InvoiceReferenceNumber 		= c[5]
			paymentProposalDetails.Status 						= c[6]
			paymentProposalDetails.BankProcessingDate			= c[7]
			nbt.ProposalDetails	= append(nbt.ProposalDetails, paymentProposalDetails)
		}
	}

	bt.ProposalDetails = nbt.ProposalDetails

	//Commit Inward entry to ledger
	fmt.Println("savePaymentProposal - Commit Payment Proposal To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PaymentProposalNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}