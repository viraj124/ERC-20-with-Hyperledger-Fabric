ERC 20 Implementation in Hyperledger Fabric

I have implemented a basic ERC 20 Token in Hyperledger Fabric, here are the steps to interact with the chaincode via Node SDK.

-> Clone the Repository
-> Go to Fabcar folder
-> Run ./startFabric.sh javascript to start all the required containers, install and instantiate the chaincode
-> After the above mention process is complete do cd javascript & run npm install to install the required sdk dependencies for     interacting with the chaincode
-> Now run node enrollAdmin.js for enrolling an admin user for the network more details here https://hyperledger-fabric.readthedocs.io/en/release-1.4/write_first_app.html#enrolling-the-admin-user & then run node registerUser.js to creeate a user to interact with chaincode
-> The chaincode file is located at fabric-samples/chaincode/fabcar/javascript/lib and if you refer this https://hyperledger-fabric.readthedocs.io/en/release-1.4/write_first_app.html we can interact with chaincode via Node SDK through innvoke.js & query.js which would call smart contract functions.

Chaincode Functionalities:
Transfer -> transfer tokens from one Org to another -> the key here is the MSP ID
TransferFrom -> allowing some other peer to transfer on your behalf
Approve -> approving that peer to transfer a particular amount.

I have used the fabric samples template since this is my first POC:)
Please give you feedback and don't forget to star.
