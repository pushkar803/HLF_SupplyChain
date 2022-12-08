# HLF_SupplyChain


### Start Hyperledger network

	cd ~/HLF_SupplyChain

	fablo start

network explorer can be found at http://3.14.67.13:701/ username: admin and password: adminpw

Note:

	fablo [down | start | stop] : to start stop or down network

	fablo prune: Downs the network and removes fablo-target directory.

	fablo reset: down and up steps combined. Network state is lost, but the configuration is kept intact. Useful in cases when you want a fresh instance of network without any state.

	fablo recreate -- prunes the network, generates new config files and ups the network. Useful when you edited fablo-config file and want to start newer network version in one command.


### Start SupplyChain api server

	cd ~/HLF_SupplyChain/server

	pm2 start app.json

this will run on http://3.14.67.13:3003


### Start Supplychain Site

	cd ~/HLF_SupplyChain/hlf_supplychain_website/

check if tmux session with name hlf_website is laready there by
	
    tmux ls

if already there then just enter into it by
  
    tmux a -t hlf_website

and enter

	python3 -m http.server

this will run on http://3.14.67.13:8000/

#### Check docker disk space usage

	docker system df
	
#### Check docker dangling images

	docker images -f dangling=true
	
#### Check docker dangling images
	
	docker system prune -af
	

