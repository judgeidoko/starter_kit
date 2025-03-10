import React, { Component } from 'react';


class Main extends Component{
    render(){
        return (
        <div id="content">
            <h1>Add a product</h1>
            <form onSubmit={(event) => {
                event.preventDefault();
                const name = this.productName.value;
                const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether');
                this.props.createProduct(name, price);
            }}>
                <div className='form-group mr-sm-2'>
                    <input id="productName" type="text" ref={(input) => {this.productName = input }} className="form-control" placeholder='Product name' required/>
                </div>

                <div className='form-group mr-sm-2'>
                    <input id="productPrice" type="number" ref={(input) => {this.productPrice = input }} className='form-control' placeholder='Product price' required/>
                </div>

                <button type="submit" className='btn btn-primary'>Add product</button>
            </form>
            <p>&nbsp;</p>
            <h1>Products({this.props.productCount})</h1>
            <div className='mr-auto ml-auto'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Seller</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.products.map((product, key) => {
                            return (
                                <tr key={key}>
                                    <td scope='row'>{product.id.toString()}</td>
                                    <td>{product.name}</td>
                                    <td>ETH {window.web3.utils.fromWei(product.price.toString(), 'Ether')}</td>
                                    <td>{product.owner}</td>
                                    <td><button name={product.id} value={product.price} onClick={(event) => {
                                        this.props.purchaseProduct(event.target.name, event.target.value);
                                    }} className='btn btn-secondary btn-sm'>buy</button></td>
                                </tr>
                            );
                        })}
                        
                    </tbody>
                </table>
            </div>
        </div>
      );
    }
}

export default Main;