// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PEPEStaking is Ownable {
    IERC20 public pepeToken;
    uint256 public rewardRate = 1e16; // 0.01 PEPE per second

    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 reward);

    constructor(address _pepeToken) Ownable(msg.sender) {
        pepeToken = IERC20(_pepeToken);
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");

        pepeToken.transferFrom(msg.sender, address(this), _amount);

        stakes[msg.sender] = Stake({
            amount: _amount,
            startTime: block.timestamp
        });

        emit Staked(msg.sender, _amount);
    }

    function calculateReward(address _staker) public view returns (uint256) {
        Stake memory stakeData = stakes[_staker];
        if (stakeData.amount == 0) {
            return 0;
        }
        uint256 stakingDuration = block.timestamp - stakeData.startTime;
        uint256 reward = (stakeData.amount * stakingDuration * rewardRate) / 1e18;
        return reward;
    }

    function claimRewards() external {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards available");

        stakes[msg.sender].startTime = block.timestamp;
        pepeToken.transfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    function unstake() external {
        Stake memory stakeData = stakes[msg.sender];
        require(stakeData.amount > 0, "No stake found");

        uint256 reward = calculateReward(msg.sender);
        uint256 amountToUnstake = stakeData.amount;

        delete stakes[msg.sender];

        pepeToken.transfer(msg.sender, amountToUnstake + reward);

        emit Unstaked(msg.sender, amountToUnstake);
        emit RewardsClaimed(msg.sender, reward);
    }

    function setRewardRate(uint256 _newRate) external onlyOwner {
        rewardRate = _newRate;
    }
}
