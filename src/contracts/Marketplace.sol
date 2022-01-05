pragma solidity ^0.5.0;

contract Marketplace{
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = 'al-ghoul Marketplace';
    }

    function createProduct(string memory _name, uint _price) public{
        // check parameters
        require(bytes(_name).length > 0);
        require(_price > 0);
        //increment counter
        productCount ++;
        //create product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // trigger event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // fetch product
        Product memory _product = products[_id];
        // get seller
        address payable _seller = _product.owner;
        // validate product
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(msg.sender != _seller);
        // transfer ownership
        _product.owner = msg.sender;
        // mark as purchased
        _product.purchased=true;
        // update product
        products[_id] = _product;
        // credit seller
        address(_seller).transfer(msg.value);

        //trigger an event
        emit ProductCreated(_id, _product.name, _product.price, msg.sender, true);
    }
}