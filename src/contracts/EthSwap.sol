pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    using SafeMath for uint256;

    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event TokensPurchased(
        address buyer,
        address from,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokensSold(
        address seller,
        address to,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Sets the token exchange rate
        uint256 tokenAmount = msg.value.mul(rate);

        // Requires there be enough tokens available for purchase
        require(token.balanceOf(address(this)) >= tokenAmount, 'All tokens have been purchased!');

        // Transfers purchased tokens to buyer
        token.transfer(msg.sender, tokenAmount);

        // Emits TokensPurchased event
        emit TokensPurchased(msg.sender, address(this), address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public payable {
        // Calculate Eth exchange rate
        uint256 ethAmount = _amount.div(rate);

        // Requires there be enough Eth available for exchange
        require(address(this).balance >= ethAmount, 'No Eth balance remaining!');

        // Transfers sold tokens to exchange
        token.transferFrom(msg.sender, address(this), _amount);

        // Transfers Eth to user
        msg.sender.transfer(ethAmount);

        // Emits TokensSold event
        emit TokensSold(msg.sender, address(this), address(token), _amount, rate);

    }
}