#!/bin/bash
function printHelp () {
  echo "Usage: "
  echo "  setupNetwork.sh -m n|ns|nsw|s|w"
  echo "  setupNetwork.sh -h (print this message)"
  echo "    -m <mode> - one of 'n', 'ns', 'nsw'"
  echo "      - 'n' - bring up the network"
  echo "      - 'ns' - bring up the network and Server API"
  echo "      - 'nsw' - bring up the network, Server API and Client application"
  echo "      - 's' - bring up the Server API"
  echo "      - 'w' - bring up the Client Application"
}
function dkcl(){
        CONTAINER_IDS=$(docker ps -aq)
	echo
        if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" = " " ]; then
                echo "========== No containers available for deletion =========="
        else
                docker rm -f $CONTAINER_IDS
        fi
	echo
}

function dkrm(){
        DOCKER_IMAGE_IDS=$(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')
	echo
        if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
		echo "========== No images available for deletion ==========="
        else
                docker rmi -f $DOCKER_IMAGE_IDS
        fi
	echo
}

function restartNetwork() {
	echo

        #teardown the network and clean the containers and intermediate images
	cd artifacts
	docker-compose down
	dkcl
	dkrm

  #Remove DB files
  rm -rf fabric-ca-server/ca1/fabric-ca-server.db
  rm -rf fabric-ca-server/ca2/fabric-ca-server.db
  rm -rf fabric-ca-server/ca3/fabric-ca-server.db
	
	#Cleanup the material
	rm -rf /tmp/hfc-test-kvs_peerOrg* $HOME/.hfc-key-store/ /tmp/fabric-client-kvs_peerOrg*

	#Start the network
	docker-compose up -d
	
	docker logs -f cli
	cd -
	echo
}

function registerUsers() {		
	echo $PWD
	rm -rf ../Server/hfcInterface/hfc-key-store
  node ../Server/hfcInterface/users.js
}

function startAPI() {		
	echo $PWD
	cd ../
	cd Server
  
  if [ -d node_modules ]; then
		echo "============== node modules installed already ============="
	else
		echo "============== Installing node modules ============="
		npm install
  fi

	npm start	
}

function startWEB() {		
	echo $PWD
	cd ../
	cd Web
	port=`netstat -ano | findstr :4200 | awk '{ print $5 }'`	
	for pid in $port[0]; do
	  echo $pid
	  taskkill /PID $pid /F
	done
	sleep 5

  if [ -d node_modules ]; then
		echo "============== node modules installed already ============="
	else
		echo "============== Installing node modules ============="
		npm install
  fi

	npm start

	# port=".4200*"

	# echo $ntstat
	# echo $port

	# if [[ $ntstat =~ $port ]]; then
	# echo "Output of Netstat command $ntstat port number $port";
	# else 
	# wait 60; /usr/local/etc/rc.d/tomcat6 restart;
	# fi

}

starttime=$(date +%s)

while getopts "h?m:c:t:d:f:s:" opt; do
  case "$opt" in
    h|\?)
      printHelp
      exit 0
    ;;
    m)  MODE=$OPTARG
    ;;    
  esac
done

# Determine whether starting, stopping, restarting or generating for announce
if [ "$MODE" == "n" ]; then
  echo "Starting Network"
  restartNetwork
  registerUsers
elif [ "$MODE" == "ns" ]; then
  echo "Starting Network and API Server application"
  restartNetwork
  registerUsers
  startAPI
elif [ "$MODE" == "nsw" ]; then
  echo "Starting Network, API Server application, and Client application"
  restartNetwork
  registerUsers
  startAPI
  startWEB
elif [ "$MODE" == "s" ]; then
  echo "Starting API Server application"
  startAPI
elif [ "$MODE" == "w" ]; then
  echo "Starting Client application"
  startWEB
else
  printHelp
fi


printf "\nTotal execution time : $(($(date +%s) - starttime)) secs ...\n\n"


