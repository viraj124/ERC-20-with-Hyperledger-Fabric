'use strict';

const shim = require('fabric-shim');
const { Contract } = require('fabric-contract-api');

const clientIdentity = shim.ClientIdentity;

class SimpleToken extends Contract {
    //Initialize owner of token in init
    async initLedger(ctx) {
        //getting function and parameters passed
        const fnparam = await ctx.stub.getFunctionAndParameters();
        const args = fnparam.params;
        if (args.length !=1) {
             return shim.error("Length of the arguements isn't correct");
        }
  const coinConfigData = args[0];
  let coinConfig;
  try {
      coinConfig = JSON.parse(coinConfigData);
  } catch (error) {
   return shim.error("Unable to parse token metadata")
  }

  const ownerMSPId = new clientIdentity(ctx.stub).getMSPID();
  const bufferSymbol = Buffer.from(coinConfig.symbol);
  const bufferName = Buffer .from(coinConfig.name);
  const initialSupply = Buffer.from(coinConfig.supply)
  try {
  await ctx.stub.putState("Symbol", bufferSymbol);
  await ctx.stub.putState("Name", bufferName);
  await ctx.stub.putState(ownerMSPId, initialSupply);
    } catch(error) {
        console.log(error);
        throw new Error(`Low on amount`);
    }
}



async getBalance(ctx, ownerId) {

    const balance = await ctx.stub.getState(ownerId);
    if (balance.toString() === ""){
        balance = Buffer.from("0");
    }
    return balance.toString();
}

async getHistory(ctx, ownerId) {
var result = await ctx.stub.getHistoryForKey(ownerId);
return result.toString();
}

async transfer(ctx, recieverMSPId, amount) {
    var amt = parseFloat(amount);
    var senderMSPId = new clientIdentity(ctx.stub).getMSPID();
    var senderBalance = await ctx.stub.getState(senderMSPId);
    var recieverBalance = await ctx.stub.getState(recieverMSPId);
    if (senderBalance.toString() == "") {
        senderBalance = Buffer.from("0");
    }
    if (recieverBalance.toString() == "") {
        recieverBalance = Buffer.from("0");
    }
    var floatSenderBalance = parseFloat(senderBalance.toString());
    var floatRecieverBalance = parseFloat(recieverBalance.toString());
    if (floatSenderBalance < amt) {
            throw new Error(`Low on amount`);
    }

try {
    var  newSenderBalance = floatSenderBalance - amt;
    var newRecieverBalance = floatRecieverBalance + amt;
    await ctx.stub.putState(senderMSPId, Buffer.from(newSenderBalance.toString()));
    await ctx.stub.putState(recieverMSPId, Buffer.from(newRecieverBalance.toString()));

} catch(error) {
            throw new Error(error);
}
}

async approve(ctx, spenderMSPId, value) {
    var val = parseFloat(value);
    var senderMSPId = new clientIdentity(ctx.stub).getMSPID();
    var senderBalance = await ctx.stub.getState(senderMSPId);
    var floatSenderBalance = parseFloat(senderBalance.toString());
    if (floatSenderBalance < val) {
        throw new Error("Balance insufficient");
    }
    var allowance = Buffer.from(val.toString());
    try {
        await ctx.stub.putState(`${senderMSPId}-${spenderMSPId}`, allowance)
    } catch (error) {
        throw new Error(error);
    }
}

async transferFrom(ctx, spenderMSPId, ownerMSPId, recieverMSPId, value) {
    var val = parseFloat(value);
    var senderBalance = await ctx.stub.getState(`${ownerMSPId}-${spenderMSPId}`);
    var floatSenderBalance = parseFloat(senderBalance.toString());
    if (floatSenderBalance<val) {
        throw new Error("Balance insufficient")
    }


    var ownerBalance = await ctx.stub.getState(ownerMSPId);
    var recieverBalance = await ctx.stub.getState(recieverMSPId);
 
    if (recieverBalance.toString() == "") {
        recieverBalance = Buffer.from("0");
    }
    var ownerBalance = parseFloat(ownerBalance.toString());
    var floatRecieverBalance = parseFloat(recieverBalance.toString());
try {
    var newSenderBalance = floatSenderBalance -val;
    var newOwnerBalnce = ownerBalance - val;   
    var newRecieverBalance = floatRecieverBalance + val;
    await ctx.stub.putState(ownerMSPId, Buffer.from(newOwnerBalnce.toString()));
    await ctx.stub.putState(`${ownerMSPId}-${spenderMSPId}`, Buffer.from(newSenderBalance.toString()));
    await ctx.stub.putState(recieverMSPId, Buffer.from(newRecieverBalance.toString()));
} catch(error) {
  throw new Error(error)
}
}
}


module.exports = SimpleToken;

