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
	"errors"
	"strconv"
	"fmt"
	"crypto/rand"	
	"time"
)

// ========================================================
// Input Sanitation - dumb input checking, look for empty strings
// ========================================================
func sanitize_arguments(strs []string) error{
	for i, val:= range strs {
		if len(val) <= 0 {
			return errors.New("Argument " + strconv.Itoa(i) + " must be a non-empty string")
		}
		if len(val) > 32 {
			return errors.New("Argument " + strconv.Itoa(i) + " must be <= 32 characters")
		}
	}
	return nil
}

func NewUniqueId() string{
	n := 10
    b := make([]byte, n)
    if _, err := rand.Read(b); err != nil {
        panic(err)
    }
	s := ""
    s = fmt.Sprintf("%X", b)
	return s    
}

func checkDuplicateId(obj []string, value string) int{
	for i := range obj{
		if obj[i] == value {
			return 0
		} 
	}
	return 1
}

func inTimeSpan(start, end, check time.Time) bool {
    return check.After(start) && check.Before(end)
}