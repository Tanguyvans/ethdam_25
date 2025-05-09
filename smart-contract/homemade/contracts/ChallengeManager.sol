// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChallengeManager {
    struct Challenge {
        address user;
        uint256 amount;
        uint256 deadline;
        bool completed;
        bool claimed;
    }

    mapping(uint256 => Challenge) public challenges;
    uint256 public challengeCount;

    event ChallengeCreated(uint256 id, address user, uint256 amount, uint256 deadline);
    event ChallengeValidated(uint256 id);
    event ChallengeClaimed(uint256 id, address user, uint256 amount);

    function createChallenge(uint256 _deadline) external payable {
        require(msg.value > 0, "Need to stake something");

        challenges[challengeCount] = Challenge({
            user: msg.sender,
            amount: msg.value,
            deadline: _deadline,
            completed: false,
            claimed: false
        });

        emit ChallengeCreated(challengeCount, msg.sender, msg.value, _deadline);
        challengeCount++;
    }

    function validateChallenge(uint256 _id) external {
        Challenge storage c = challenges[_id];
        require(msg.sender == c.user, "Only creator can validate");
        require(block.timestamp <= c.deadline, "Too late");
        require(!c.completed, "Already done");

        c.completed = true;
        emit ChallengeValidated(_id);
    }

    function claimStake(uint256 _id) external {
        Challenge storage c = challenges[_id];
        require(c.completed, "Challenge not completed");
        require(msg.sender == c.user, "Not your challenge");
        require(!c.claimed, "Already claimed");

        c.claimed = true;
        payable(c.user).transfer(c.amount);

        emit ChallengeClaimed(_id, c.user, c.amount);
    }
}
