const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
};

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap, totalSupply

    before(async () => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        totalSupply = await token.totalSupply();
        await token.transfer(ethSwap.address, totalSupply);
    })

    describe('Token deployment', () => {

        it('has the correct name', async () => {
            const name = await token.name();
            assert.equal(name, 'SwapToken');
        });

        it('has the correct symbol', async () => {
            const symbol = await token.symbol();
            assert.equal(symbol, 'SWP');
        });
    });

    describe('EthSwap deployment', async () => {

        it('has the correct name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange');
        });

        it('has the total token supply', async () => {
            let exchangeBalance = await token.balanceOf(ethSwap.address);
            assert.equal(totalSupply.toString(), exchangeBalance.toString()); // Should switch to BN
        });
    });

    describe('token purchases', async () => {
        let result

        before(async () => {
            result = await ethSwap.buyTokens({ from: investor, value: tokens('1') });
        });

        it('allows user to purchase tokens at fixed price', async () => {
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'));
        });

        it('deducts tokens & increases Ether balance of Exchange', async () => {
            let exchangeBalance 

            // Checks that tokens were deducted
            exchangeBalance = await token.balanceOf(ethSwap.address);
            assert.equal(exchangeBalance.toString(), tokens('999900'));

            //Checks that Ether was received
            exchangeBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(exchangeBalance.toString(), tokens('1'));
        });

        it('emits TokensPurchased event as expected', async () => {
            const event = result.logs[0].args;
            assert.equal(event.buyer, investor);
            assert.equal(event.from, ethSwap.address);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100'));
            assert.equal(event.rate.toString(), '100');
        });
    });

    describe('token sales', async () => {
        let result

        before(async () => {
            await token.approve(ethSwap.address, tokens('500'), { from: investor });
            result = await ethSwap.sellTokens(tokens('100'), { from: investor });
        });

        it('allows user to sell tokens at fixed price', async () => {
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('0'));
        });

        it('deducts Ether & increases token balance of Exchange', async () => {
            let exchangeBalance 

            // Checks that tokens were added
            exchangeBalance = await token.balanceOf(ethSwap.address);
            assert.equal(exchangeBalance.toString(), tokens('1000000'));

            //Checks that Ether was deducted
            exchangeBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(exchangeBalance.toString(), tokens('0'));
        });

        it('emits TokensPurchased event as expected', async () => {
            const event = result.logs[0].args;
            assert.equal(event.seller, investor);
            assert.equal(event.to, ethSwap.address);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100'));
            assert.equal(event.rate.toString(), '100');
        });

        it('does not allow user to sell more tokens than they hold', async () => {
            await ethSwap.buyTokens({ from: deployer, value: tokens('5') });
            await ethSwap.sellTokens(tokens('400'), { from: investor }).should.be.rejected;
        });

    });

});