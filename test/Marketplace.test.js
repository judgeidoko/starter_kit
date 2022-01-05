const { assert } = require("chai");
require('chai').use(require('chai-as-promised')).should();

const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace;

    before(async () => {
        marketplace = await Marketplace.deployed();
    });

    describe('deployment', async () => {
        it('deployed successfully', async () => {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async () => {
            const name = await marketplace.name;
            assert(name, 'Idoko Marketplace');
        });
    });

    describe('product', async () => {
        let result, productCount;

        before(async () => {
            result = await marketplace.createProduct('Test product 1', web3.utils.toWei('1','Ether'), {from: seller});
            productCount = await marketplace.productCount();
        });

        it('creates product', async () => {
            const event = result.logs[0].args;

            //SUCCESS
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'product id is correct');
            assert.equal(event.name, 'Test product 1', 'product name is correct');
            assert.equal(event.price, web3.utils.toWei('1','Ether'), 'is correct price');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.purchased, false, 'can  be purchased');

            // FAILURE
            await await marketplace.createProduct('', web3.utils.toWei('1','Ether'), {from: seller}).should.be.rejected;
            await await marketplace.createProduct('', 0, {from: seller}).should.be.rejected;
        });

        it('lists products', async () => {
            const product = await marketplace.products(productCount);

            assert.equal(product.id.toNumber(), productCount.toNumber(), 'product id is correct');
            assert.equal(product.name, 'Test product 1', 'product name is correct');
            assert.equal(product.price, web3.utils.toWei('1','Ether'), 'is correct price');
            assert.equal(product.owner, seller, 'owner is correct');
            assert.equal(product.purchased, false, 'can  be purchased');
        });

        it('sells product', async () => {
            let oldSellerBalance;
            oldSellerBalance = await web3.eth.getBalance(seller);
            oldSellerBalance = new web3.utils.BN(oldSellerBalance);

            result = await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1','Ether')});

            const event = result.logs[0].args;

            //SUCCESS
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'product id is correct');
            assert.equal(event.name, 'Test product 1', 'product name is correct');
            assert.equal(event.price, web3.utils.toWei('1','Ether'), 'is correct price');
            assert.equal(event.owner, buyer, 'owner is correct');
            assert.equal(event.purchased, true, 'can  be purchased');

            let newSellerBalance;
            newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price;
            price = web3.utils.toWei('1', 'Ether');
            price = new web3.utils.BN(price);

            const expectedBalance = oldSellerBalance.add(price);

            assert.equal(expectedBalance.toString(), newSellerBalance.toString(), 'seller was credited');

            //FAILURE
            // invalid id
            await await marketplace.purchaseProduct(0, {from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected;
            await await marketplace.purchaseProduct((productCount+1), {from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected;

            // invalid purchase amount
            await await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('0.9','Ether')}).should.be.rejected;

            // invalid buyer
            await await marketplace.purchaseProduct(productCount, {from: deployer, value: web3.utils.toWei('1','Ether')}).should.be.rejected;
            await await marketplace.purchaseProduct(productCount, {from: seller, value: web3.utils.toWei('1','Ether')}).should.be.rejected;

        });
    })
});