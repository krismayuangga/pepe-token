// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DummyUSDT is ERC20, Ownable {
    constructor() ERC20("Dummy USDT", "DUSDT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1 juta USDT ke deployer
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
