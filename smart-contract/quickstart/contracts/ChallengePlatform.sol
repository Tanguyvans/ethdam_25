// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ChallengePlatform {
    uint256 private _nextChallengeId = 1; // Start challenge IDs from 1
    uint256 public constant STAKE_AMOUNT = 1 ether; // 1 ROSE
    address public owner;

    struct Player {
        bool hasPassed;
        bool hasJoined;
    }

    // Structure to represent a challenge
    struct Challenge {
        uint256 id; // Unique identifier for the challenge
        string name; // Name or title of the challenge
        address creator; // Who created this challenge
        // We could add participantCount here if needed, but keeping it minimal
        uint256 start_date;
        uint256 end_date;
        uint256 pool;
        uint256 playerCount;
        bool isSettled; // New field to track if challenge is settled
    }

    // Mapping from challengeId => player address => Player info
    mapping(uint256 => mapping(address => Player)) public players;

    // Array to store all challenges
    Challenge[] public challenges;

    // Add a new mapping to track participants
    mapping(uint256 => address[]) public challengeParticipants;

    // --- Events ---
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

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Creates a new challenge.
     * @param _name The name/title of the challenge.
     */
    function createChallenge(
        string memory _name,
        uint256 _start_date,
        uint256 _end_date
    ) external {
        require(
            bytes(_name).length > 0 && _start_date > 0 && _end_date > 0,
            "Challenge name and dates cannot be empty"
        );
        require(_end_date > _start_date, "End date must be after start date");

        uint256 newChallengeId = _nextChallengeId;
        _nextChallengeId++;

        challenges.push(
            Challenge({
                id: newChallengeId,
                name: _name,
                creator: msg.sender,
                start_date: _start_date,
                end_date: _end_date,
                pool: 0,
                playerCount: 0,
                isSettled: false
            })
        );

        emit ChallengeCreated(newChallengeId, _name, msg.sender);
    }

    /**
     * @dev Checks if a user has joined a specific challenge.
     * @param _challengeId The ID of the challenge (1-based).
     * @param _player The address of the user.
     * @return True if the user has joined, false otherwise.
     */
    function hasJoined(
        uint256 _challengeId,
        address _player
    ) external view returns (bool) {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId, // Validate against _nextChallengeId
            "Challenge does not exist"
        );
        return players[_challengeId][_player].hasJoined;
    }

    /**
     * @dev Allows a user to join an existing challenge.
     * @param _challengeId The ID of the challenge to join (1-based).
     */
    function joinChallenge(uint256 _challengeId) external payable {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );

        require(
            !players[_challengeId][msg.sender].hasJoined,
            "Already joined this challenge"
        );

        require(
            block.timestamp < challenges[_challengeId - 1].start_date,
            "Challenge has already started"
        );

        require(msg.value == STAKE_AMOUNT, "Must send exactly 1 ROSE");

        players[_challengeId][msg.sender] = Player({
            hasPassed: false,
            hasJoined: true
        });

        challenges[_challengeId - 1].pool += STAKE_AMOUNT;
        challenges[_challengeId - 1].playerCount += 1;

        // Correctly adds participant to the array
        challengeParticipants[_challengeId].push(msg.sender);

        emit ChallengeJoined(_challengeId, msg.sender, STAKE_AMOUNT);
    }

    function markChallengePassed(
        uint256 _challengeId,
        address _participant
    ) external {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );

        require(
            players[_challengeId][_participant].hasJoined,
            "Participant has not joined this challenge"
        );

        require(
            !players[_challengeId][_participant].hasPassed,
            "Participant has already passed the challenge"
        );

        players[_challengeId][_participant].hasPassed = true;
        emit ChallengePassed(_challengeId, _participant);
    }

    /**
     * @dev Settles a challenge by selecting a winner and distributing the prize
     * @param _challengeId The ID of the challenge to settle
     */
    function settleChallenge(uint256 _challengeId) external {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );

        Challenge storage challenge = challenges[_challengeId - 1];
        require(!challenge.isSettled, "Challenge is already settled");
        require(challenge.pool > 0, "No prize pool available");

        // Get the actual participants array
        address[] storage participants = challengeParticipants[_challengeId];
        require(participants.length > 0, "No participants in this challenge");

        // Calculate prize per participant (split equally among all participants)
        uint256 prizePerParticipant = challenge.pool / participants.length;

        // Distribute prizes to all participants
        for (uint i = 0; i < participants.length; i++) {
            (bool success, ) = participants[i].call{value: prizePerParticipant}(
                ""
            );
            require(success, "Prize transfer failed");
        }

        challenge.isSettled = true;
        emit ChallengeSettled(_challengeId, challenge.pool);
    }

    /**
     * @dev Checks if a challenge is settled
     * @param _challengeId The ID of the challenge to check
     * @return True if the challenge is settled, false otherwise
     */
    function isChallengeSettled(
        uint256 _challengeId
    ) external view returns (bool) {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );
        return challenges[_challengeId - 1].isSettled;
    }

    /**
     * @dev Retrieves all created challenges.
     * @return An array of Challenge structs.
     * WARNING: This can be very gas expensive if there are many challenges.
     * For production, consider paginated retrieval or event-based off-chain aggregation.
     */
    function getAllChallenges() external view returns (Challenge[] memory) {
        return challenges;
    }

    /**
     * @dev Retrieves a single challenge by its ID.
     * @param _challengeId The ID of the challenge (1-based).
     * @return The Challenge struct.
     */
    function getChallengeById(
        uint256 _challengeId
    ) external view returns (Challenge memory) {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId, // Validate against _nextChallengeId
            "Challenge does not exist"
        );
        // The challenges array is 0-indexed.
        // If IDs are 1, 2, 3, ... they correspond to indices 0, 1, 2, ...
        // So, challenge with ID 'n' is at index 'n-1'.
        return challenges[_challengeId - 1];
    }

    function hasPassedChallenge(
        uint256 _challengeId,
        address _participant
    ) external view returns (bool) {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "Challenge does not exist"
        );
        return players[_challengeId][_participant].hasPassed;
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
            uint256 passedCount,
            address[] memory participants
        )
    {
        if (_challengeId == 0 || _challengeId >= _nextChallengeId) {
            return (false, false, 0, 0, 0, new address[](0));
        }

        Challenge storage challenge = challenges[_challengeId - 1];
        address[] storage participantList = challengeParticipants[_challengeId];

        uint256 passed = 0;
        for (uint i = 0; i < participantList.length; i++) {
            if (players[_challengeId][participantList[i]].hasPassed) {
                passed++;
            }
        }

        return (
            true,
            challenge.isSettled,
            challenge.playerCount,
            challenge.pool,
            passed,
            participantList
        );
    }
}
