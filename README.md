# eChain Deployment workflow
eChain deployment architecture is presented in the below diagram. The blockchain network is developed using the Minifabric quick prototyping tool. Each peers are docker containers and hold the copies of blockchain ledgers. Minifabric tool provides a method to deploy chaincodes and applications. The applications are hosted in a docker container named 'apprun'. However, this container is not suitable for rich internet (front-end) applications. Hence, the apprun container is used as a Blockchain API gateway aka Fabric Blockchain API connector (the middle component on the picture). The de-facto DApp (front-end Server) is developed in the first block on the diagram from the left. Both the Blockchain API connector and DApp is developed using Node.js. 

![alt text](https://github.com/NaViGatorFL/eChain/blob/master/echain-deployment-architecture.png)

Please follow the instructions below and run the commands

## Step 0
### Setup Development Environment
1. Install Ubuntu V20.04+ (Note: You can install it on a standalone machine or in virtualbox of your personal computer.)
2. Install Git (Just install the Ubuntu 20.04 default version)
3. Install Docker V20.10.4+ (Just install the Ubuntu 20.04 default version. Extra help: https://docs.docker.com/engine/install/ubuntu/)
4. Install NPM V14+ (Just install the Ubuntu 20.04 default version. Extra help: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)

This tutorial assumes the deployment is happening at the Ubuntu Server Machine in FICS lab. Please feel free to edit the following commands based on your target installation system. 

## Step 1
### Get the Minifabric Binaries 
1. Get the script
```
mkdir -p ~/mywork && cd ~/mywork && curl -o minifab -sL https://tinyurl.com/yxa2q6yr && chmod +x minifab
```
[Source: https://github.com/hyperledger-labs/minifabric]
Make sure you are in _mywork_ directory. (OR go to the directory wherever you downloaded the minifabric executable)
2. Download eChain repository
```
cd ~/{Git-Repo-Dir}
git clone https://github.com/NaViGatorFL/eChain.git
```
This is a private repository, so, carefully input the credentials. After this, go back to _mywork_ directory.

3. Prepare (Copy) your blockchain network configuration. Note that the following command needs to be updated according to your system. 
```
sudo cp ~/{Git-Repo-Dir}/eChain/spec.yaml ~/../mywork/
```

## Step 2
Assign Necessary permission (Replace adminblk with your username)
```
sudo chown -R {username}: ./
sudo chmod -R 775 ./
```
Note that, you may need to run these two commands over and over again down the process. 

## Step 3
Start the Network 
```
sudo ./minifab netup -o org1.ficsechain.com
```
This command does Minifabrci magic. _netup_ starts up the network and _org1.ficsechain.com_ tells the _netup_ script to use the custom configuration given in _spec.yaml_. Under the hood, this scrip does everything to deploy a Hyperledger Fabric blockchain network. At this point, a Hyperledger Fabric network is installed and running. 

## Step 4	
Create a Channel 
```
sudo ./minifab create
```
Join Peers to channel: 
```
sudo ./minifab join
```

## Step 6
Do Anchor Update
```
sudo ./minifab anchorupdate
```

## Step 7
For Custom Chaincode (e.g: asset)
```
cd ./vars/chaincode
sudo mkdir asset
sudo mkdir node (if asset is developed in node)
cd node
sudo cp ~/{Git-Repo-Dir}/chaincodes/* /.
```
## Step 8
Install Chain Code

```
sudo ./minifab install -n {chaincode_name e.g. asset}-l node -d false
sudo ./minifab approve
sudo ./minifab commit
```

## Step 9
Generate profile
```
sudo ./minifab profilegen
```

# eChain DApp Setup

## Step 10
For deploying the app (node.js) (to get net_name refer Note)
```
sudo ./minifab apprun (Does not matter if it fails, just run anyway)
cd ./vars/app/node
sudo rm -r
sudo cp ~/{Git-Repo-Dir}/blockchain-connector-server/*
cd ~/mywork
sudo chown -R adminblk: ./
sudo chmod -R 775 ./
cd ./vars/app/node
sudo npm install
cd ~/mywork
sudo docker network ls (lookup and copy the XXX_net network name, and apply on the next command)
sudo docker run --network {net_name} --name apprun --hostname apprun -p 7081:7081 -d --rm -v /var/run/docker.sock:/var/run/docker.sock -v /home/{username}/mywork/vars:/vars -v /home/{username}/mywork/vars/app/node:/go/src/github.com/app --entrypoint /vars/run/apprun.sh node:12.13.1-alpine3.10
```
### Helpful Notes:
- We can directly place the apprun.sh script in script file (but have not explored this option yet)
- For net_name, Get it from the spec.yaml 
- If not present in spec.yaml, sudo docker network ls
- Find the name ending with ‘_net’

## Step 11 : DApp project setup
Go to the _DApp_ folder on _eChain_ directory and run the following command to start the front end. First build it then run it. 
```
cd ~/{Git-Repo-Dir}/eChain/DApp
npm install
npm run serve
```
At this point, the app should be running. The following commands will be necessary in a production mode. You can skip them for now. 

### Compiles and minifies for production
```
sudo npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Disk space overflow bugfix
Create a file named daemon.json and place it in the /etc/docker directory. Content of the file can be the following JSON object: 
```
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production_status"
  }
}
```
[ Run the following command to read the file on Lab Ubuntu Machine $ cat /etc/docker/daemon.json ]


