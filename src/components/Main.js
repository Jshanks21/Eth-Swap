import React, { Component } from 'react';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

class Main extends Component {

	constructor(props) {
		super(props)
		this.state = {
			currentForm: 'buy'
		}
	}

  render() {
		let content
		if(this.state.currentForm === 'buy') {
			content = <BuyForm
				ethBalance={this.props.ethBalance}
				tokenBalance={this.props.tokenBalance}
				buyTokens={this.props.buyTokens}
			/>
		} else {
			content = <SellForm
				ethBalance={this.props.ethBalance}
				tokenBalance={this.props.tokenBalance}
				sellTokens={this.props.sellTokens}
			/>
		}

    return (
      <div id="content" className="mt-3">
				<div className="d-flex justify-content-between mb-3">
					<button
							className="btn btn-light"
							onClick={(event) => {
								this.setState({ currentForm: 'buy' })
							}}
						>
						Buy
					</button>
					<span className="text-muted">&lt; &nbsp; &gt;</span>
					<button
							className="btn btn-light"
							onClick={(event) => {
								this.setState({ currentForm: 'sell' })
							}}
						>
						Sell
					</button>
				</div>

        <div className="card mb-4" >
					<div className="card-body">

						{content}

					</div>
				</div>
				<div className="alert alert-warning">
					<strong className="d-flex justify-content-center">Live only on the Ropsten testnet.</strong>
					<span className="d-flex justify-content-center">Get your test Ether<a href="https://faucet.metamask.io/" target="_blank">&nbsp;here.</a></span>
				</div>
				<div className="alert alert-info">
  				<strong className="d-flex justify-content-center">SWP token is live on Ropsten at: </strong>
					<a href="https://ropsten.etherscan.io/address/0xa93f25a89fee39dcc0273ba55c3c7d0092d7dc69"
						target="_blank"
						className="d-flex justify-content-center">
							0xa93f25A89FEE39dCc0273BA55C3c7D0092D7dc69
					</a>
				</div>
      </div>
    );
  }
}

export default Main;
