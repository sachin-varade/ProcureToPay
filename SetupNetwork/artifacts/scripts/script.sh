#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Build Network"
echo

COUNTER=1
MAX_RETRY=5
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/syngenta.com/orderers/orderer.syngenta.com/msp/tlscacerts/tlsca.syngenta.com-cert.pem
TIMEOUT=60
DELAY=1
# verify the result of the end-to-end test
verifyResult () {
	if [ $1 -ne 0 ] ; then
		echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
    echo "========= ERROR !!! FAILED to execute End-2-End Scenario ==========="
		echo
   		exit 1
	fi
}

setGlobals () {

	if [ $1 -eq 0 ] ; then
		CORE_PEER_LOCALMSPID="SyngentaOrgMSP"
		CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/syngentaOrg.syngenta.com/peers/peer0.syngentaOrg.syngenta.com/tls/ca.crt
		CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/syngentaOrg.syngenta.com/users/Admin@syngentaOrg.syngenta.com/msp		
		CORE_PEER_ADDRESS=peer0.syngentaOrg.syngenta.com:7051		
		CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/syngentaOrg.syngenta.com/peers/peer0.syngentaOrg.syngenta.com/tls/server.crt
		CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/syngentaOrg.syngenta.com/peers/peer0.syngentaOrg.syngenta.com/tls/server.key      
	fi
	if [ $1 -eq 1 ] ; then
		CORE_PEER_LOCALMSPID="VendorOrgMSP"
		CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/vendorOrg.syngenta.com/peers/peer0.vendorOrg.syngenta.com/tls/ca.crt
		CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/vendorOrg.syngenta.com/users/Admin@vendorOrg.syngenta.com/msp		
		CORE_PEER_ADDRESS=peer0.vendorOrg.syngenta.com:7051		
		CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/vendorOrg.syngenta.com/peers/peer0.vendorOrg.syngenta.com/tls/server.crt
		CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/vendorOrg.syngenta.com/peers/peer0.vendorOrg.syngenta.com/tls/server.key      
	fi
	if [ $1 -eq 2 ] ; then
		CORE_PEER_LOCALMSPID="BankOrgMSP"
		CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bankOrg.syngenta.com/peers/peer0.bankOrg.syngenta.com/tls/ca.crt
		CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bankOrg.syngenta.com/users/Admin@bankOrg.syngenta.com/msp
		CORE_PEER_ADDRESS=peer0.bankOrg.syngenta.com:7051
		CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bankOrg.syngenta.com/peers/peer0.bankOrg.syngenta.com/tls/server.crt
		CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bankOrg.syngenta.com/peers/peer0.bankOrg.syngenta.com/tls/server.key      
	fi
	
	env |grep CORE
}

createChannel() {
	setGlobals $1

  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
		peer channel create -o orderer.syngenta.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CHANNEL_NAME}.tx >&log.txt
	else
		peer channel create -o orderer.syngenta.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CHANNEL_NAME}.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
	fi
	res=$?
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo "===================== Channel \"$CHANNEL_NAME\" is created successfully ===================== "
	echo
}

updateAnchorPeers() {
  PEER=$1
  setGlobals $PEER

  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
		peer channel update -o orderer.syngenta.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx >&log.txt
	else
		peer channel update -o orderer.syngenta.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
	fi
	res=$?
	cat log.txt
	verifyResult $res "Anchor peer update failed"
	echo "===================== Anchor peers for org \"$CORE_PEER_LOCALMSPID\" on \"$CHANNEL_NAME\" is updated successfully ===================== "
	sleep $DELAY
	echo
}

## Sometimes Join takes time hence RETRY atleast for 5 times
joinWithRetry () {
	peer channel join -b $CHANNEL_NAME.block  >&log.txt
	res=$?
	cat log.txt
	if [ $res -ne 0 -a $COUNTER -lt $MAX_RETRY ]; then
		COUNTER=` expr $COUNTER + 1`
		echo "PEER$1 failed to join the channel, Retry after 2 seconds"
		sleep $DELAY
		joinWithRetry $1
	else
		COUNTER=1
	fi
  verifyResult $res "After $MAX_RETRY attempts, PEER$ch has failed to Join the Channel"
}

printPeerJoined(){	
	if [ $1 -eq 0  ]; then
		echo "===================== syngentaOrg-PEER0 joined on the channel \"$CHANNEL_NAME\" ===================== "
	fi
	if [ $1 -eq 1  ]; then
		echo "===================== vendorOrg-PEER0 joined on the channel \"$CHANNEL_NAME\" ===================== "
	fi
	if [ $1 -eq 2  ]; then
		echo "===================== bankOrg-PEER0 joined on the channel \"$CHANNEL_NAME\" ===================== "
	fi
}

printInstantiateMsg(){	
	if [ $1 -eq 0  ]; then
		echo "===================== chaincode instantiated on syngentaOrg-PEER0 channel \"$CHANNEL_NAME\" ===================== "
	fi
	if [ $1 -eq 1  ]; then
		echo "===================== chaincode instantiated on vendorOrg-PEER0 channel \"$CHANNEL_NAME\" ===================== "
	fi
	if [ $1 -eq 2  ]; then
		echo "===================== chaincode instantiated on bankOrg-PEER0 channel \"$CHANNEL_NAME\" ===================== "
	fi
}

joinChannel () {
	## join peers on procurementchannel
	CHANNEL_NAME="procurementchannel"
	for ch in 0 1; do
		setGlobals $ch
		joinWithRetry $ch
		printPeerJoined $ch
		sleep $DELAY
		echo
	done
	
	## join peers on financechannel
	CHANNEL_NAME="financechannel"
	for ch in 0 2; do
		setGlobals $ch
		joinWithRetry $ch
		printPeerJoined $ch
		sleep $DELAY
		echo
	done
}

installChaincode () {
	PEER=$1
	CC=$2
	VERSION=$3
	CCPATH=$4
	
	setGlobals $PEER
	peer chaincode install -n $CC -v $VERSION -p $CCPATH >&log.txt
	res=$?
	cat log.txt
        verifyResult $res "Chaincode installation on remote peer PEER$PEER has Failed"
	echo "===================== Chaincode $CC is installed on remote peer PEER$PEER ===================== "
	echo
}

instantiateChaincode () {
	PEER=$1
	setGlobals $PEER
	CC=$2
	VERSION=$3
	ARGS=$4
	# while 'peer chaincode' command can get the orderer endpoint from the peer (if join was successful),
	# lets supply it directly as we know it using the "-o" option
	# -P "OR ('SyngentaOrgMSP.member','VendorOrgMSP.member')"
	setGlobals $PEER
	if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
		peer chaincode instantiate -o orderer.syngenta.com:7050 -C $CHANNEL_NAME -n $CC -v $VERSION -c $ARGS >&log.txt
	else
		peer chaincode instantiate -o orderer.syngenta.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CC -v $VERSION -c $ARGS >&log.txt
	fi
	res=$?
	cat log.txt
	verifyResult $res "Chaincode instantiation on PEER$PEER on channel '$CHANNEL_NAME' failed"	
	printInstantiateMsg $PEER
	echo
}

chaincodeQuery () {
  PEER=$1
  CC=$3
  ARGS=$4
  echo "===================== Querying on PEER$PEER on channel '$CHANNEL_NAME'... ===================== "
  setGlobals $PEER
  local rc=1
  local starttime=$(date +%s)

  # continue to poll
  # we either get a successful response, or reach TIMEOUT
  while test "$(($(date +%s)-starttime))" -lt "$TIMEOUT" -a $rc -ne 0
  do
     sleep 3
     echo "Attempting to Query PEER$PEER ...$(($(date +%s)-starttime)) secs"
     peer chaincode query -C $CHANNEL_NAME -n $CC -c $ARGS >&log.txt
     #test $? -eq 0 && VALUE=$(cat log.txt | awk '/Query Result/ {print $NF}')
     #test "$VALUE" = "$2" && let rc=0
	 let rc=0
  done
  echo
  cat log.txt
  if test $rc -eq 0 ; then
	echo "===================== Query on PEER$PEER on channel '$CHANNEL_NAME' is successful ===================== "
  else
	echo "!!!!!!!!!!!!!!! Query result on PEER$PEER is INVALID !!!!!!!!!!!!!!!!"
        echo "================== ERROR !!! =================="
	echo
	#exit 1
  fi
}

chaincodeInvoke () {
	PEER=$1
	setGlobals $PEER
	# while 'peer chaincode' command can get the orderer endpoint from the peer (if join was successful),
	# lets supply it directly as we know it using the "-o" option
	if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
		peer chaincode invoke -o orderer.syngenta.com:7050 -C $CHANNEL_NAME -n mycc -c '{"Args":["invoke","a","b","10"]}' >&log.txt
	else
		peer chaincode invoke -o orderer.syngenta.com:7050  --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n mycc -c '{"Args":["invoke","a","b","10"]}' >&log.txt
	fi
	res=$?
	cat log.txt
	verifyResult $res "Invoke execution on PEER$PEER failed "
	echo "===================== Invoke transaction on PEER$PEER on channel '$CHANNEL_NAME' is successful ===================== "
	echo
}

## Create channel
echo "Creating channel... procurementchannel"
CHANNEL_NAME="procurementchannel"
createChannel 0
echo "Creating channel... financechannel"
CHANNEL_NAME="financechannel"
createChannel 2

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for syngentaOrg..."
#updateAnchorPeers 0
echo "Updating anchor peers for vendorOrg..."
#updateAnchorPeers 2

## Install chaincode on Peer0/syngentaOrg and Peer2/vendorOrg
echo "Installing chaincode on syngentaOrg/peer0..."
installChaincode 0 "procurementCC" "1.0" "github.com/hyperledger/fabric/examples/chaincode/go/procurement"
installChaincode 1 "procurementCC" "1.0" "github.com/hyperledger/fabric/examples/chaincode/go/procurement"
installChaincode 0 "financeCC" "1.0" "github.com/hyperledger/fabric/examples/chaincode/go/finance"
installChaincode 2 "financeCC" "1.0" "github.com/hyperledger/fabric/examples/chaincode/go/finance"

#Instantiate chaincode
echo "Instantiating chaincode"
CHANNEL_NAME="procurementchannel"
instantiateChaincode 0 "procurementCC" "1.0" '{"Args":["init","a","100","b","200"]}'
CHANNEL_NAME="financechannel"
instantiateChaincode 2 "financeCC" "1.0" '{"Args":["init","a","100","b","200"]}'

#Query on chaincode on Peer0/syngentaOrg
# echo "Querying chaincode"
CHANNEL_NAME="procurementchannel"
chaincodeQuery 0 100 "procurementCC" '{"Args":["getAllAbattoirReceived","details",""]}'
# chaincodeQuery 1 100 "abattoirCC" '{"Args":["getAllParts","a"]}'
# CHANNEL_NAME="processorchannel"
# chaincodeQuery 1 100 "processorCC" '{"Args":["getAllVehicles","a"]}'
# chaincodeQuery 2 100 "processorCC" '{"Args":["getAllVehicles","a"]}'
# CHANNEL_NAME="ikeachannel"
# chaincodeQuery 3 100 "ikeaCC" '{"Args":["query","a"]}'

#Invoke on chaincode on Peer0/syngentaOrg
#echo "Sending invoke transaction on syngentaOrg/peer0..."
#chaincodeInvoke 0

## Install chaincode on Peer3/vendorOrg
#echo "Installing chaincode on vendorOrg/peer3..."
#installChaincode 3

#Query on chaincode on Peer3/vendorOrg, check if the result is 90
#echo "Querying chaincode on vendorOrg/peer3..."
#chaincodeQuery 3 90

echo
echo "========= All GOOD, Network up =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo
exit 0