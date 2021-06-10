// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
contract SELToken is ERC20 {
  constructor() ERC20('SELToken', 'SEL') {
    _mint(msg.sender, 1000000 * 10 ** 18);
  }
}
