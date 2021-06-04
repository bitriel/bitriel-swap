// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
// a library for performing overflow-safe math (https://github.com/dapphub/ds-math)
contract  SafeMath {
		function add(uint x, uint y) internal pure returns(uint z) {
				z = x + y;
				require((z = x + y) >=x, "math add overflow");

		}	   
		function sub(uint x, uint y) internal pure returns(uint z) {
				z = x - y;
				require((z = x - y) <=x, "math sub underflow");
		}
		function mul(uint x, uint y) internal pure returns(uint z) {
				z = x * y;
				require(y == 0 || (z = x * y) / y == x, "math mul overflow");
		}
		function div(uint x, uint y) internal pure returns(uint z) {
				require(y > 0, "Can not divided by zero");
				z = x / y;
				
		}
}
