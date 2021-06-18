pragma solidity =0.5.16;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol';
contract SEL is ERC20, ERC20Detailed {
		constructor() ERC20Detailed("SELENDRA", "SEL", 18) public {
				_mint(msg.sender, 1000000 * 10 ** 18);
		}
}
