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

func getAllDashboardData(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllDashboardData: Looking for All Purchase Orders");

	allBAsBytes, err := stub.GetState("allPurchaseOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Purchase order numbers")
	}

	var res AllPurchaseOrderNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Purchase order records")
	}
	var allDetailsPO AllPurchaseOrderDetails
	var allDetailsSO AllVendorSalesOrderDetails
	var allDetailsGI AllGoodsIssueDetails
	var allDetailsLT AllLogisticTransactionDetails
	var allDetailsVI AllVendorInvoiceDetails
	var allDetailsGR AllGoodsReceiptDetails
	var poNumbers string
	fmt.Println("loop all");
	
	for i := range res.PurchaseOrderNumbers{
		sbAsBytes, err := stub.GetState(res.PurchaseOrderNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Purchase Order record.")
		}
		var sb PurchaseOrder
		json.Unmarshal(sbAsBytes, &sb)

		if filterDate(value, sb.PurchaseOrderDate) {
			if strings.ToLower(option) == "date-po-numbers" {
				if poNumbers != ""{
					poNumbers = poNumbers + ","
				}
				poNumbers = poNumbers + sb.PurchaseOrderNumber
			} else if strings.ToLower(option) == "date-po-created" {
				allDetailsPO.PurchaseOrders = append(allDetailsPO.PurchaseOrders, sb);
			} else if strings.ToLower(option) == "date-so-created" && filterDate(value, sb.PurchaseOrderDate) {
				var response = getAllVendorSalesOrders(stub, "po", sb.PurchaseOrderNumber)
				var allDetailsObj AllVendorSalesOrderDetails
				json.Unmarshal([]byte(string(response.Payload)), &allDetailsObj)
				if len(allDetailsObj.VendorSalesOrders) != 0 {    
					for j := range allDetailsObj.VendorSalesOrders{   					
						allDetailsSO.VendorSalesOrders = append(allDetailsSO.VendorSalesOrders, allDetailsObj.VendorSalesOrders[j]);
					}
				}
			} else if strings.ToLower(option) == "date-goods-issued" {
				var response = getAllGoodsIssue(stub, "po", sb.PurchaseOrderNumber)
				var allDetailsObj AllGoodsIssueDetails
				json.Unmarshal([]byte(string(response.Payload)), &allDetailsObj)
				if len(allDetailsObj.GoodsIssueList) != 0 {   
					for j := range allDetailsObj.GoodsIssueList{   					    
						allDetailsGI.GoodsIssueList = append(allDetailsGI.GoodsIssueList, allDetailsObj.GoodsIssueList[j]);
					}
				}
			} else if strings.ToLower(option) == "date-logistic-delivered" {
				var response = getAllLogisticTransactions(stub, "po", sb.PurchaseOrderNumber)
				var allDetailsObj AllLogisticTransactionDetails
				json.Unmarshal([]byte(string(response.Payload)), &allDetailsObj)
				if len(allDetailsObj.LogisticTransactions) != 0 {  
					for j := range allDetailsObj.LogisticTransactions{   					         
						allDetailsLT.LogisticTransactions = append(allDetailsLT.LogisticTransactions, allDetailsObj.LogisticTransactions[j]);
					}
				}
			} else if strings.ToLower(option) == "date-vendor-invoice-created" {
				var response = getAllVendorInvoices(stub, "po", sb.PurchaseOrderNumber)
				var allDetailsObj AllVendorInvoiceDetails
				json.Unmarshal([]byte(string(response.Payload)), &allDetailsObj)
				if len(allDetailsObj.VendorInvoices) != 0 {     
					for j := range allDetailsObj.VendorInvoices{   					           
						allDetailsVI.VendorInvoices = append(allDetailsVI.VendorInvoices, allDetailsObj.VendorInvoices[j]);
					}
				}
			} else if strings.ToLower(option) == "date-goods-received" {
				var response = getAllGoodsReceiptDetails(stub, "po", sb.PurchaseOrderNumber)
				var allDetailsObj AllGoodsReceiptDetails
				json.Unmarshal([]byte(string(response.Payload)), &allDetailsObj)
				if len(allDetailsObj.GoodsReceipts) != 0 {       
					for j := range allDetailsObj.GoodsReceipts{   					           
						allDetailsGR.GoodsReceipts = append(allDetailsGR.GoodsReceipts, allDetailsObj.GoodsReceipts[j]);
					}
				}
			} 
		}
	}
	if strings.ToLower(option) == "date-po-numbers" {
		rabAsBytes, _ := json.Marshal(poNumbers)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "date-po-created" {
		rabAsBytes, _ := json.Marshal(allDetailsPO)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "date-so-created" {
		rabAsBytes, _ := json.Marshal(allDetailsSO)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "date-goods-issued" {
		rabAsBytes, _ := json.Marshal(allDetailsGI)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "date-logistic-delivered" {
		rabAsBytes, _ := json.Marshal(allDetailsLT)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "date-vendor-invoice-created" {
		rabAsBytes, _ := json.Marshal(allDetailsVI)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "date-goods-received" {
		rabAsBytes, _ := json.Marshal(allDetailsGR)		
		return shim.Success(rabAsBytes)	 
	}
	
	return shim.Success(nil)
}


// ============================================================================================================================
// Get All Purchase Orders
// ============================================================================================================================
func getAllPurchaseOrders(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllPurchaseOrders: Looking for All Purchase Orders");

	//get the LogisticTransactions index
	allBAsBytes, err := stub.GetState("allPurchaseOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Purchase order numbers")
	}

	var res AllPurchaseOrderNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Purchase order records")
	}
	var sb PurchaseOrder
	var allIds AllPurchaseOrderNumbers
	var allDetails AllPurchaseOrderDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Purchase Order record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.PurchaseOrderNumber != "" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.PurchaseOrderNumbers{

		sbAsBytes, err := stub.GetState(res.PurchaseOrderNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Purchase Order record.")
		}
		var sb PurchaseOrder
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.PurchaseOrderNumbers = append(allIds.PurchaseOrderNumbers, sb.PurchaseOrderNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		} else if strings.ToLower(option) == "created" && strings.ToLower(sb.Status) == "created" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		} else if strings.ToLower(option) == "approved" && strings.ToLower(sb.Status) == "approved" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);
		} else if strings.ToLower(option) == "approved-paid" {
			if strings.ToLower(sb.Status) == "approved" || strings.ToLower(sb.Status) == "paid" {
				allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);
			}
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderNumber) {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		} else if strings.ToLower(option) == "vendors-approved" && strings.ToLower(sb.Status) == "approved" && strings.ToLower(value) == strings.ToLower(sb.SupplierUniqueNo) {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);
		}
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	 
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "created" || strings.ToLower(option) == "approved" || strings.ToLower(option) == "po" || strings.ToLower(option) == "vendors-approved" || strings.ToLower(option) == "approved-paid" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get unique number
// ============================================================================================================================
func getUniqueId(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	prefix := ""	
	if strings.ToLower(option) == "logistic" {
		prefix = "LID-"
		allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
		if err != nil {
			return shim.Error("Failed to get all allLogisticTransactionIds")
		}
		var res AllLogisticTransactionIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Logistic Transactions records")
		}
		uniqueId := ""
		if len(res.ConsignmentNumbers) != 0 {
			uniqueId = res.ConsignmentNumbers[len(res.ConsignmentNumbers) - 1]
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
	} else if strings.ToLower(option) == "goods-receipt" {
		prefix = "BGRID-"
		allBAsBytes, err := stub.GetState("allGoodsReceiptIds")
		if err != nil {
			return shim.Error("Failed to get all allGoodsReceiptIds")
		}
		var res AllGoodsReceiptIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all allGoodsReceiptIds")
		}
		uniqueId := ""
		if len(res.GoodsReceiptNumbers) != 0 {
			uniqueId = res.GoodsReceiptNumbers[len(res.GoodsReceiptNumbers) - 1]
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
		} else if strings.ToLower(option) == "vendor" {
			prefix = "VSOID-"
			allBAsBytes, err := stub.GetState("allVendorSalesOrderNumbers")
			if err != nil {
				return shim.Error("Failed to get all allVendorSalesOrderNumbers")
			}
			var res AllVendorSalesOrderNumbers
			err = json.Unmarshal(allBAsBytes, &res)
			if err != nil {
				fmt.Println("Printing Unmarshal error:-");
				fmt.Println(err);
				return shim.Error("Failed to Unmarshal all allVendorSalesOrderNumbers")
			}
			uniqueId := ""
			if len(res.SalesOrderNumbers) != 0 {
				uniqueId = res.SalesOrderNumbers[len(res.SalesOrderNumbers) - 1]
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
			} else if strings.ToLower(option) == "goods-issue" {
				prefix = "GIID-"
				allBAsBytes, err := stub.GetState("allGoodsIssueNumbers")
				if err != nil {
					return shim.Error("Failed to get all AllGoodsIssueNumbers")
				}
				var res AllGoodsIssueNumbers
				err = json.Unmarshal(allBAsBytes, &res)
				if err != nil {
					fmt.Println("Printing Unmarshal error:-");
					fmt.Println(err);
					return shim.Error("Failed to Unmarshal all AllGoodsIssueNumbers")
				}
				uniqueId := ""
				if len(res.GoodsIssueNumbers) != 0 {
					uniqueId = res.GoodsIssueNumbers[len(res.GoodsIssueNumbers) - 1]
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
				} else if strings.ToLower(option) == "vendor-consignment" {
					prefix = "VCID-"
					allBAsBytes, err := stub.GetState("allGoodsIssueNumbers")
					if err != nil {
						return shim.Error("Failed to get all AllGoodsIssueNumbers")
					}
					var res AllGoodsIssueNumbers
					err = json.Unmarshal(allBAsBytes, &res)
					if err != nil {
						fmt.Println("Printing Unmarshal error:-");
						fmt.Println(err);
						return shim.Error("Failed to Unmarshal all AllGoodsIssueNumbers")
					}
					uniqueId := ""
					if len(res.GoodsIssueNumbers) != 0 {
						var sb GoodsIssue
						uniqueId = res.GoodsIssueNumbers[len(res.GoodsIssueNumbers) - 1]
						sbAsBytes, err := stub.GetState(uniqueId)
						if err != nil {
							return shim.Error("Failed to get vendor record.")
						}
						json.Unmarshal(sbAsBytes, &sb)
						uniqueId = sb.LogisticsConsignmentNumber
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
					} else if strings.ToLower(option) == "invoice" {
					prefix = "INVID-"
					allBAsBytes, err := stub.GetState("allVendorInvoiceNumbers")
					if err != nil {
						return shim.Error("Failed to get all allVendorInvoiceNumbers")
					}
					var res AllVendorInvoiceNumbers
					err = json.Unmarshal(allBAsBytes, &res)
					if err != nil {
						fmt.Println("Printing Unmarshal error:-");
						fmt.Println(err);
						return shim.Error("Failed to Unmarshal all allVendorInvoiceNumbers")
					}
					uniqueId := ""
					if len(res.InvoiceNumbers) != 0 {
						uniqueId = res.InvoiceNumbers[len(res.InvoiceNumbers) - 1]
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

// ============================================================================================================================
// Get All Logistic Transactions
// ============================================================================================================================
func getAllLogisticTransactions(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllLogisticTransactions: Looking for All Logistic Transactions");

	//get the LogisticTransactions index
	allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all allLogisticTransactionIds")
	}

	var res AllLogisticTransactionIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Logistic Transactions records")
	}
	var sb LogisticTransaction
	var allIds AllLogisticTransactionIds
	var allDetails AllLogisticTransactionDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.ConsignmentNumber != "" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		var sb LogisticTransaction
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers, sb.ConsignmentNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		} else if strings.ToLower(option) == "so" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		} else if strings.ToLower(option) == "gin" && strings.ToLower(value) == strings.ToLower(sb.GoodsIssueRefNumber)  {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		}	
		sb = LogisticTransaction{}		
		sbAsBytes = nil
	}

	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "po" || strings.ToLower(option) == "so" || strings.ToLower(option) == "gin" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Vendor Sales Orders
// ============================================================================================================================
func getAllVendorSalesOrders(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllVendorSalesOrders: Looking for All Vendor Sales Orders");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allVendorSalesOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Sales order numbers")
	}

	var res AllVendorSalesOrderNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Vendor Sales order records")
	}
	var sb VendorSalesOrder
	var allIds AllVendorSalesOrderNumbers
	var allDetails AllVendorSalesOrderDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Sales Order record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.SalesOrderNumber != "" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.SalesOrderNumbers{

		sbAsBytes, err := stub.GetState(res.SalesOrderNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Sales Order record.")
		}
		var sb VendorSalesOrder
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.SalesOrderNumbers = append(allIds.SalesOrderNumbers, sb.SalesOrderNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "receipt" && strings.ToLower(sb.Status) == "receipt" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "issued" && strings.ToLower(sb.Status) == "issued" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "vendors-so" && strings.ToLower(value) == strings.ToLower(sb.SupplierCode) {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "so" && strings.ToLower(value) == strings.ToLower(sb.SalesOrderNumber) {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		}
		sb = VendorSalesOrder{}		
		sbAsBytes = nil
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "receipt" || strings.ToLower(option) == "vendors-so" || strings.ToLower(option) == "issued" || strings.ToLower(option) == "po" || strings.ToLower(option) == "so"  {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Goods Receipt Details
// ============================================================================================================================
func getAllGoodsReceiptDetails(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("allGoodsReceiptIds: Looking for allGoodsReceiptIds");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allGoodsReceiptIds")
	if err != nil {
		return shim.Error("Failed to get allGoodsReceiptIds")
	}

	var res AllGoodsReceiptIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal allGoodsReceiptIds")
	}
	var sb GoodsReceipt
	var allIds AllGoodsReceiptIds
	var allDetails AllGoodsReceiptDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Sales Order record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.GoodsReceiptNumber != "" {
			allDetails.GoodsReceipts = append(allDetails.GoodsReceipts, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.GoodsReceiptNumbers{

		sbAsBytes, err := stub.GetState(res.GoodsReceiptNumbers[i])
		if err != nil {
			return shim.Error("Failed to get goods receipt record.")
		}
		var sb GoodsReceipt
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.GoodsReceiptNumbers = append(allIds.GoodsReceiptNumbers, sb.GoodsReceiptNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.GoodsReceipts = append(allDetails.GoodsReceipts, sb);	
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) {
			allDetails.GoodsReceipts = append(allDetails.GoodsReceipts, sb);	
		} else if strings.ToLower(option) == "so" {
			allDetails.GoodsReceipts = append(allDetails.GoodsReceipts, sb);	
		}
		sb = GoodsReceipt{}		
		sbAsBytes = nil
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "po" || strings.ToLower(option) == "so"{
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Vendor - Goods Issue
// ============================================================================================================================
func getAllGoodsIssue(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllGoodsIssue: Looking for All Vendor Goods Issue");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allGoodsIssueNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Sales order numbers")
	}

	var res AllGoodsIssueNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Vendor Goods Issue records")
	}
	var sb GoodsIssue
	var allIds AllGoodsIssueNumbers
	var allDetails AllGoodsIssueDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Goods Issue record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.GoodsIssueNumber != "" {
			allDetails.GoodsIssueList = append(allDetails.GoodsIssueList, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.GoodsIssueNumbers{

		sbAsBytes, err := stub.GetState(res.GoodsIssueNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Goods Issue record.")
		}
		var sb GoodsIssue
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.GoodsIssueNumbers = append(allIds.GoodsIssueNumbers, sb.GoodsIssueNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.GoodsIssueList = append(allDetails.GoodsIssueList, sb);	
		} else if strings.ToLower(option) == "po" {
			sbAsBytesvso, err := stub.GetState(sb.SalesOrderNumber)
			if err != nil {
				return shim.Error("Failed to get SO.")
			}
			var vso VendorSalesOrder
			json.Unmarshal(sbAsBytesvso, &vso)
			if strings.ToLower(value) == strings.ToLower(vso.PurchaseOrderRefNumber) {
				allDetails.GoodsIssueList = append(allDetails.GoodsIssueList, sb);	
			}
		} else if strings.ToLower(option) == "so" && strings.ToLower(value) ==  strings.ToLower(sb.SalesOrderNumber) {
			allDetails.GoodsIssueList = append(allDetails.GoodsIssueList, sb)	
		}
		sb = GoodsIssue{}		
		sbAsBytes = nil
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "po" || strings.ToLower(option) == "so"{
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}


// ============================================================================================================================
// Get All Vendor - Invoice
// ============================================================================================================================
func getAllVendorInvoices(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllVendorInvoices: Looking for All Vendor Invoices");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allVendorInvoiceNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Invoice numbers")
	}

	var res AllVendorInvoiceNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Vendor Invoice records")
	}

	var sb VendorInvoice
	var allIds AllVendorInvoiceNumbers
	var allDetails AllVendorInvoiceDetails
	
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Vendor Invoice record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.InvoiceNumber != "" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.InvoiceNumbers{

		sbAsBytes, err := stub.GetState(res.InvoiceNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Goods Issue record.")
		}
		var sb VendorInvoice
		json.Unmarshal(sbAsBytes, &sb)
		var lastStatus StatusUpdates
		lastStatus = sb.StatusUpdates[len(sb.StatusUpdates)-1]
		if strings.ToLower(option) == "ids" {
			allIds.InvoiceNumbers = append(allIds.InvoiceNumbers, sb.InvoiceNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		} else if strings.ToLower(option) == "created" && strings.ToLower(lastStatus.Status) == "created" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		} else if strings.ToLower(option) == "validated" && strings.ToLower(lastStatus.Status) == "validated" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		} else if strings.ToLower(option) == "approved" && strings.ToLower(lastStatus.Status) == "validated" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		} else if strings.ToLower(option) == "po" && strings.ToLower(value) == strings.ToLower(sb.PurchaseOrderRefNumber) {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);
		} else if strings.ToLower(option) == "so" && strings.ToLower(value) == strings.ToLower(sb.SalesOrderNumber) {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);
		}
		sb = VendorInvoice{}		
		sbAsBytes = nil
	}

	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "validated" || strings.ToLower(option) == "approved" || strings.ToLower(option) == "po" || strings.ToLower(option) == "so" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}
