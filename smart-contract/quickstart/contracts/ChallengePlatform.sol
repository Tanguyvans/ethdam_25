// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ChallengePlatform {
    uint256 private _nextChallengeId = 1;
    uint256 public constant STAKE_AMOUNT = 1 ether; // 1 ROSE
    address public owner;

    struct Player {
        bool hasPassed; // Tracks if user is a winner
        bool hasJoined; // Tracks if user has joined
        bool hasClaimed; // Tracks if user has claimed their reward
    }

    struct Challenge {
        uint256 id;
        string name;
        address creator;
        uint256 pool;
        uint256 playerCount;
        bool isSettled;
    }

    mapping(uint256 => mapping(address => Player)) public players;
    Challenge[] public challenges;
    mapping(uint256 => address[]) public challengeParticipants;

    event ChallengeCreated(
        uint256 indexed challengeId,
        string name,
        address indexed creator
    );
    event ChallengeJoined(
        uint256 indexed challengeId,
        address indexed participant,
        uint256 stakeAmount
    );
    event ChallengeSettled(uint256 indexed challengeId, uint256 prizeAmount);
    event ChallengePassed(
        uint256 indexed challengeId,
        address indexed participant
    );
    event RewardClaimed(
        uint256 indexed challengeId,
        address indexed winner,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // 1. Create a challenge
    function createChallenge(string memory _name) external {
        require(bytes(_name).length > 0, "Challenge name cannot be empty");

        uint256 newChallengeId = _nextChallengeId;
        _nextChallengeId++;

        challenges.push(
            Challenge({
                id: newChallengeId,
                name: _name,
                creator: msg.sender,
                pool: 0,
                playerCount: 0,
                isSettled: false
            })
        );

        emit ChallengeCreated(newChallengeId, _name, msg.sender);
    }

    // 2. Join a challenge
    function joinChallenge(uint256 _challengeId) external payable {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );
        require(
            !players[_challengeId][msg.sender].hasJoined,
            "Already joined this challenge"
        );
        require(msg.value == STAKE_AMOUNT, "Must send exactly 1 ROSE");

        players[_challengeId][msg.sender] = Player({
            hasPassed: false,
            hasJoined: true,
            hasClaimed: false
        });

        challenges[_challengeId - 1].pool += STAKE_AMOUNT;
        challenges[_challengeId - 1].playerCount += 1;
        challengeParticipants[_challengeId].push(msg.sender);

        emit ChallengeJoined(_challengeId, msg.sender, STAKE_AMOUNT);
    }

    // 3. Mark winners (only owner)
    function markChallengePassed(
        uint256 _challengeId,
        address _participant
    ) external onlyOwner {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );
        require(
            players[_challengeId][_participant].hasJoined,
            "Participant has not joined"
        );
        require(
            !players[_challengeId][_participant].hasPassed,
            "Already marked as passed"
        );

        players[_challengeId][_participant].hasPassed = true;
        emit ChallengePassed(_challengeId, _participant);
    }

    // 4. Settle the challenge (only owner)
    function settleChallenge(uint256 _challengeId) external onlyOwner {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );
        Challenge storage challenge = challenges[_challengeId - 1];
        require(!challenge.isSettled, "Challenge is already settled");
        require(challenge.pool > 0, "No prize pool available");

        challenge.isSettled = true;
        emit ChallengeSettled(_challengeId, challenge.pool);
    }

    // 5. Claim rewards (for winners)
    function claimRewards(uint256 _challengeId) external {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );
        Challenge storage challenge = challenges[_challengeId - 1];
        require(challenge.isSettled, "Challenge is not settled yet");
        require(
            players[_challengeId][msg.sender].hasPassed,
            "You are not a winner"
        );
        require(
            !players[_challengeId][msg.sender].hasClaimed,
            "Already claimed reward"
        );

        // Count winners
        uint256 winnerCount = 0;
        address[] storage participants = challengeParticipants[_challengeId];
        for (uint i = 0; i < participants.length; i++) {
            if (players[_challengeId][participants[i]].hasPassed) {
                winnerCount++;
            }
        }
        require(winnerCount > 0, "No winners in this challenge");

        // Calculate and send reward
        uint256 rewardPerWinner = challenge.pool / winnerCount;
        (bool success, ) = msg.sender.call{value: rewardPerWinner}("");
        require(success, "Reward transfer failed");

        players[_challengeId][msg.sender].hasClaimed = true;
        emit RewardClaimed(_challengeId, msg.sender, rewardPerWinner);
    }

    // View functions
    function hasJoined(
        uint256 _challengeId,
        address _player
    ) external view returns (bool) {
        return players[_challengeId][_player].hasJoined;
    }

    function hasPassed(
        uint256 _challengeId,
        address _player
    ) external view returns (bool) {
        return players[_challengeId][_player].hasPassed;
    }

    function hasClaimed(
        uint256 _challengeId,
        address _player
    ) external view returns (bool) {
        return players[_challengeId][_player].hasClaimed;
    }

    function getChallengeState(
        uint256 _challengeId
    )
        external
        view
        returns (
            bool exists,
            bool isSettled,
            uint256 playerCount,
            uint256 pool,
            uint256 winnerCount
        )
    {
        if (_challengeId == 0 || _challengeId >= _nextChallengeId) {
            return (false, false, 0, 0, 0);
        }

        Challenge storage challenge = challenges[_challengeId - 1];
        address[] storage participants = challengeParticipants[_challengeId];

        uint256 winners = 0;
        for (uint i = 0; i < participants.length; i++) {
            if (players[_challengeId][participants[i]].hasPassed) {
                winners++;
            }
        }

        return (
            true,
            challenge.isSettled,
            challenge.playerCount,
            challenge.pool,
            winners
        );
    }

    function getAllChallenges() external view returns (Challenge[] memory) {
        return challenges;
    }
}
