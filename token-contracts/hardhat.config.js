require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.20',
  networks: {
    filecoinCalibration: {
      url: 'https://api.calibration.node.glif.io/rpc/v1',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
