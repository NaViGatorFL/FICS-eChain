# eChain Deployment workflow
Please follow the instructions below and run the commands
## Step 0
Install Ubuntu 20.04 followed by Docker
## Step 1
```
cd ~/mywork
```
(OR go to the directory where minifabric is)

## Step 2
Assign Necessary permission (Replace adminblk with your username)
```
sudo chown -R adminblk: ./
sudo chmod -R 775 ./
```
## Step 3
Start the Network 
```
sudo ./minifabric netup -o {current_org_name}
sudo ./minifabric netup -o org1.ficsechain.com
```

## Step 4	
Create Channel 
```
sudo ./minifabric create
```
Join Peers to channel: 
```
sudo ./minifabric join
```

## Step 6
Do Anchor Update
```
sudo ./minifabric anchorupdate
```

## Step 7
For Custom Chaincode (e.g: asset)
```
cd ./vars/chaincode
sudo mkdir asset
sudo mkdir node (if asset is developed in node)
cd node
sudo cp ~/{chaincode files - REPLACE} /.
```
## Step 8
Install Chain Code

```
sudo ./minifabric install -n chaincode_name -l node -d false
sudo ./minifabric approve
sudo ./minifabric commit
```

## Step 9
Generate profile
```
sudo ./minifabric profilegen
```

# eChain DApp Setup

## Step 10
For deploying the app (node.js) (to get net_name refer Note)
```
sudo ./minifab apprun (for creating the necessary apprun.sh script file, we can directly place this file but need to explore this option)
if command do not end (stop it)
cd ./vars/app/node
sudo npm install
cd ~/mywork
sudo chown -R adminblk: ./
sudo chmod -R 775 ./
docker run --network net_name --name apprun --hostname apprun -p 7081:7081 -d --rm -v /var/run/docker.sock:/var/run/docker.sock -v /home/adminblk/mywork/vars:/vars -v /home/adminblk/mywork/vars/app/node:/go/src/github.com/app --entrypoint /vars/run/apprun.sh node:12.13.1-alpine3.10
```
i.	Go to local GitHub folder ~/GitHub/{app directory}/client and run the following command to start the front end.

## Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve
```

## Compiles and minifies for production
```
npm run build
```

## Lints and fixes files
```
npm run lint
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Notes:
- We can directly place the apprun.sh script in script file (but have not explored this option yet)
- For net_name, Get it from the spec.yaml 
- If not present in spec.yaml, sudo docker network ls
- Find the name ending with ‘_net’

# Disk space overflow fix
Create a file named daemon.json and place it in the /etc/docker directory. Content of the file can be the following JSON object: 
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production_status"
  }
}
[ Run the following command to read the file on Lab Ubuntu Machine $ cat /etc/docker/daemon.json ]


