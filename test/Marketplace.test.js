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
        })
    })
});