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
		}
	}
	
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}
