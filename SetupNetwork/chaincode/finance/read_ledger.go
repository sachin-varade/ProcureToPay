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
	"strconv"	

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Get All Ikea Received
// ============================================================================================================================
func getAllFinanceInvoices(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllFinanceInvoices:Looking for All Ikea Received");

	//get the All Ikea Received index
	allBAsBytes, err := stub.GetState("allFinanceInvoiceNumbers")
	if err != nil {
		return shim.Error("Failed to get all Ikea Received")
	}

	var res AllFinanceInvoiceNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Ids")
	}

	var allIds AllFinanceInvoiceNumbers
	var allDetails AllFinanceInvoiceDetails
	var sb FinanceInvoice
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Details for option=id ")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.InvoiceNumber != "" {
			allDetails.FinanceInvoices = append(allDetails.FinanceInvoices,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}

	for i := range res.InvoiceNumbers{
		sbAsBytes, err := stub.GetState(res.InvoiceNumbers[i])
		if err != nil {
			return shim.Error("Failed to get data")
		}		
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.InvoiceNumbers = append(allIds.InvoiceNumbers,sb.InvoiceNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.FinanceInvoices = append(allDetails.FinanceInvoices,sb);	
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) {
			allDetails.FinanceInvoices = append(allDetails.FinanceInvoices, sb);	
		} else if strings.ToLower(option) == "po-parked" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) && strings.ToLower(sb.CurrentStatus) == "parked" {
			allDetails.FinanceInvoices = append(allDetails.FinanceInvoices, sb);	
		} else if strings.ToLower(option) == "po-posted" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) && strings.ToLower(sb.CurrentStatus) == "posted" {
			allDetails.FinanceInvoices = append(allDetails.FinanceInvoices, sb);	
		} else if strings.ToLower(option) == "po-paid" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) && strings.ToLower(sb.CurrentStatus) == "paid" {
			allDetails.FinanceInvoices = append(allDetails.FinanceInvoices, sb);	
		}
		sb = FinanceInvoice{}
		sbAsBytes = nil
	}
	
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "po" || strings.ToLower(option) == "po-parked" || strings.ToLower(option) == "po-posted" || strings.ToLower(option) == "po-paid"{
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Payment Proposals
// ============================================================================================================================
func getAllPaymentProposals(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllPaymentProposals: Looking for All Payment Proposals");

	//get  All Payment proposals index
	allBAsBytes, err := stub.GetState("allPaymentProposalNumbers")
	if err != nil {
		return shim.Error("Failed to get all Payment proposals")
	}

	var res AllPaymentProposalNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Payment proposal Numbers")
	}

	var allIds AllPaymentProposalNumbers
	var allDetails AllPaymentProposalDetails
	var sb PaymentProposal
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Payment Proposal Number ")
		}

		json.Unmarshal(sbAsBytes, &sb)
		if sb.PaymentProposalNumber != "" {
			allDetails.PaymentProposals = append(allDetails.PaymentProposals,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}

	for i := range res.PaymentProposalNumbers{
		sbAsBytes, err := stub.GetState(res.PaymentProposalNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Payment Proposal Number")
		}
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.PaymentProposalNumbers = append(allIds.PaymentProposalNumbers,sb.PaymentProposalNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.PaymentProposals = append(allDetails.PaymentProposals,sb);	
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.ProposalDetails[0].PoReferenceNumber) {
			allDetails.PaymentProposals = append(allDetails.PaymentProposals, sb);	
		}
		sb = PaymentProposal{}
		sbAsBytes = nil
	}
	
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "po" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

func getUniqueId(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	prefix := ""	
	if strings.ToLower(option) == "payment-proposal" {
		prefix = "PPID-"
		allBAsBytes, err := stub.GetState("allPaymentProposalNumbers")
		if err != nil {
			return shim.Error("Failed to get all AllPaymentProposalNumbers")
		}
		var res AllPaymentProposalNumbers
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal AllPaymentProposalNumbers")
		}
		uniqueId := ""
		if len(res.PaymentProposalNumbers) != 0 {
			uniqueId = res.PaymentProposalNumbers[len(res.PaymentProposalNumbers) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
	} 

	return shim.Success(nil)
}

