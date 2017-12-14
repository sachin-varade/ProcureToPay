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
func getAllIkeaReceived(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllIkeaReceived:Looking for All Ikea Received");

	//get the All Ikea Received index
	allBAsBytes, err := stub.GetState("allIkeaReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Ikea Received")
	}

	var res AllIkeaReceivedIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Ikea Received Ids")
	}

	var allIds AllIkeaReceivedIds
	var allDetails AllIkeaReceivedDetails
	var sb IkeaReceived
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Ikea Received Number ")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.IkeaReceivedNumber != "" {
			allDetails.IkeaReceived = append(allDetails.IkeaReceived,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}

	for i := range res.IkeaReceivedNumbers{
		sbAsBytes, err := stub.GetState(res.IkeaReceivedNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Ikea Received Number ")
		}		
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.IkeaReceivedNumbers = append(allIds.IkeaReceivedNumbers,sb.IkeaReceivedNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.IkeaReceived = append(allDetails.IkeaReceived,sb);	
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

// ============================================================================================================================
// Get All Ikea Dispatch
// ============================================================================================================================
func getAllIkeaDispatch(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllIkeaDispatch:Looking for All Ikea Dispatch");

	//get the All Ikea Dispatch index
	allBAsBytes, err := stub.GetState("allIkeaDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Ikea Dispatch")
	}

	var res AllIkeaDispatchIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Ikea Dispatch Ids")
	}

	var allIds AllIkeaDispatchIds
	var allDetails AllIkeaDispatchDetails
	var sb IkeaDispatch
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Ikea Dispatch Number ")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.IkeaDispatchNumber != "" {
			allDetails.IkeaDispatch = append(allDetails.IkeaDispatch,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}

	for i := range res.IkeaDispatchNumbers{
		sbAsBytes, err := stub.GetState(res.IkeaDispatchNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Ikea Dispatch Number ")
		}		
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.IkeaDispatchNumbers = append(allIds.IkeaDispatchNumbers,sb.IkeaDispatchNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.IkeaDispatch = append(allDetails.IkeaDispatch,sb);	
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


// ============================================================================================================================
// Get Ikea Bill Details
// ============================================================================================================================
func getIkeaBillDetails(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getIkeaBillDetails: Looking for Ikea Bill Details");

	//get the All Ikea Received index
	allBAsBytes, err := stub.GetState("allIkeaBillNumbers")
	if err != nil {
		return shim.Error("Failed to get all Ikea Bill Numbers")
	}

	var res AllIkeaBillNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Ikea Bill Numbers")
	}

	var allIds AllIkeaBillNumbers
	var allDetails AllIkeaBillNumberDetails
	var sb IkeaBill
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Ikea bill Number ")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.BillNumber != "" {
			allDetails.IkeaBillNumbers = append(allDetails.IkeaBillNumbers,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}

	for i := range res.IkeaBillNumbers{
		sbAsBytes, err := stub.GetState(res.IkeaBillNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Ikea bill Number ")
		}		
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.IkeaBillNumbers = append(allIds.IkeaBillNumbers,sb.BillNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.IkeaBillNumbers = append(allDetails.IkeaBillNumbers,sb);	
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

// ============================================================================================================================
// Get unique number
// ============================================================================================================================
func getUniqueId(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	prefix := ""	
	if strings.ToLower(option) == "received" {
		prefix = "IRID-"
		allBAsBytes, err := stub.GetState("allIkeaReceivedIds")
		if err != nil {
			return shim.Error("Failed to get all Ikea Received")
		}
		var res AllIkeaReceivedIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Ikea Received Ids")
		}
		uniqueId := ""
		if len(res.IkeaReceivedNumbers) != 0 {
			uniqueId = res.IkeaReceivedNumbers[len(res.IkeaReceivedNumbers) - 1]
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
	} else if strings.ToLower(option) == "dispatch" {
		prefix = "IDID-"
		allBAsBytes, err := stub.GetState("allIkeaDispatchIds")
		if err != nil {
			return shim.Error("Failed to get all Ikea Dispatch")
		}
		var res AllIkeaDispatchIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Ikea Dispatch Ids")
		}
		uniqueId := ""
		if len(res.IkeaDispatchNumbers) != 0 {
			uniqueId = res.IkeaDispatchNumbers[len(res.IkeaDispatchNumbers) - 1]
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
	} else if strings.ToLower(option) == "bill" {
		prefix = "BID-"
		allBAsBytes, err := stub.GetState("allIkeaBillNumbers")
		if err != nil {
			return shim.Error("Failed to get all Ikea Bill Numbers")
		}
		var res AllIkeaBillNumbers
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Ikea Bill Numbers")
		}
		uniqueId := ""
		if len(res.IkeaBillNumbers) != 0 {
			uniqueId = res.IkeaBillNumbers[len(res.IkeaBillNumbers) - 1]
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