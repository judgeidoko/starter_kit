import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/MarketPlace.json';
import Navbar from './Navbar';
import Main from './Main';
import Loading from './Loading';

class App extends Component {

  async componentDidMount(){
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }else{
      alert('Non ethereum browser detected, you should consider metamask');
    }
  }

  async loadBlockChainData(){
    const web3 = window.web3;
    //load data
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });
    
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if(networkData){
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address);
      const productCount = await marketplace.methods.productCount().call();
      console.log(productCount.toNumber());

      for(var i=1; i <= productCount.toNumber(); i++){
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product]
        });
      }

      console.log(this.state.products);

      this.setState({marketplace, productCount: productCount.toNumber(), loading: false});
    }else{
      alert('Marketplace contract not deployed to detected network');
    }
    
  }

  constructor(props){
    super(props);
    this.state ={
      account: '',
      productCount: 0,
      products: [],
      loading: true
    };

    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  createProduct(name, price){
    this.setState({loading: true});

    this.state.marketplace.methods.createProduct(name,price).send({from: this.state.account}).once('receipt',(receipt)=>{
      this.setState({loading: false});
    });
  }
  purchaseProduct(id, price){
    this.setState({loading: true});

    this.state.marketplace.methods.purchaseProduct(id).send({from: this.state.account, value: price}).once('receipt',(receipt)=>{
      this.setState({loading: false});
    });
  }


  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content ">
                {this.state.loading ? <Loading /> : <Main createProduct={this.createProduct} purchaseProduct={this.purchaseProduct} products={this.state.products} productCount={this.state.productCount} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
