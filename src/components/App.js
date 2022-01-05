import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/MarketPlace.json';
import Navbar from './Navbar';

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
      console.log(marketplace);
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
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Al-Ghoul Blockchain Marketplace</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CONNECT <u><b>METAMASK! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
