// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// SelBar is the coolest bar in town. You come in with some SEL, and leave with more! The longer you stay, the more SEL you get.
// This contract handles swapping to and from xSel, BitrielSwap's staking token.
contract SelBar is ERC20("SelBar", "xSEL"){
    using SafeMath for uint256;
    IERC20 public sel;

    // Define the SEL token contract
    constructor(IERC20 _sel) public {
        sel = _sel;
    }

    // Enter the bar. Pay some SELs. Earn some shares.
    // Locks SEL and mints xSel
    function enter(uint256 _amount) public {
        // Gets the amount of SEL locked in the contract
        uint256 tatalSel = sel.balanceOf(address(this));
        // Gets the amount of xSel in existence
        uint256 totalShares = totalSupply();
        // If no xSel exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || tatalSel == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xSel the SEL is worth. The ratio will change overtime, as xSel is burned/minted and SEL deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(tatalSel);
            _mint(msg.sender, what);
        }
        // Lock the SEL in the contract
        sel.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SELs.
    // Unlocks the staked + gained SEL and burns xSel
    function leave(uint256 _share) public {
        // Gets the amount of xSel in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of SEL the xSel is worth
        uint256 what = _share.mul(sel.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        sel.transfer(msg.sender, what);
    }
}
