#
eChain Deployment workflow
#
Please follow the instructions below and run the commands
##
Step 0
##
Install Ubuntu 20.04 followed by Docker
##
Step 1
```
cd ~/mywork
```
(OR go to the directory where minifabric is)

##
Step 2
##
Assign Necessary permission (Replace adminblk with your username)
```
sudo chown -R adminblk: ./
sudo chmod -R 775 ./
```
##
Step 3
##
Start the Network 
```
sudo ./minifabric netup -o {current_org_name}
sudo ./minifabric netup -o org1.ficsechain.com
```

Step 4.	Create Channel 
a.	sudo ./minifabric create
5.	Join Peers to channel
a.	sudo ./minifabric join

Step 6.	Do Anchor Update
a.	sudo ./minifabric anchorupdate

Step 7.	For Custom Chaincode (e.g: asset)
a.	cd ./vars/chaincode
b.	sudo mkdir asset
c.	sudo mkdir node (if asset is developed in node)
d.	cd node
e.	copy chaincode files in here.

Step 8.	Install Chain Code
a.	sudo ./minifabric install -n chaincode_name -l node -d false
b.	sudo ./minifabric approve
c.	sudo ./minifabric commit

Step 9.	Generate profile
a.	sudo ./minifabric profilegen

# eChain DApp Setup

Step 10.	For deploying the app (node.js) (to get net_name refer Note)
a.	sudo ./minifab apprun (for creating the necessary apprun.sh script file, we can directly place this file but need to explore this option)
b.	if command do not end (stop it)
c.	cd ./vars/app/node
d.	sudo npm install
e.	cd ~/mywork
f.	sudo chown -R adminblk: ./
g.	sudo chmod -R 775 ./
h.	docker run --network net_name --name apprun --hostname apprun -p 7081:7081 -d --rm -v /var/run/docker.sock:/var/run/docker.sock -v /home/adminblk/mywork/vars:/vars -v /home/adminblk/mywork/vars/app/node:/go/src/github.com/app --entrypoint /vars/run/apprun.sh node:12.13.1-alpine3.10
i.	Go to local GitHub folder ~/GitHub/{app directory}/client and run the following command to start the front end.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


###
Notes:
###
•	We can directly place the apprun.sh script in script file (but have not explored this option yet)
•	For net_name, Get it from the spec.yaml 
•	If not present in spec.yaml, sudo docker network ls
•	Find the name ending with ‘_net’

###
Disk space overflow fix: 
###
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


