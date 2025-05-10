// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleChallengePlatform
 * @dev A very basic contract for creating and joining challenges without Counters.sol.
 */
contract ChallengePlatform {
    uint256 private _nextChallengeId = 1; // Start challenge IDs from 1

    // Structure to represent a challenge
    struct Challenge {
        uint256 id; // Unique identifier for the challenge
        string name; // Name or title of the challenge
        address creator; // Who created this challenge
        // We could add participantCount here if needed, but keeping it minimal
    }

    // Array to store all challenges.
    // Note: Storing unbounded arrays can be gas-intensive if they grow very large.
    // For a small number of challenges, this is okay. For many, consider events for off-chain indexing.
    Challenge[] public challenges;

    // Mapping from challenge ID to a mapping of participant address to boolean (true if joined)
    mapping(uint256 => mapping(address => bool)) public isParticipant;

    // --- Events ---
    event ChallengeCreated(
        uint256 indexed challengeId,
        string name,
        address indexed creator
    );

    event ChallengeJoined(
        uint256 indexed challengeId,
        address indexed participant
    );

    /**
     * @dev Creates a new challenge.
     * @param _name The name/title of the challenge.
     */
    function createChallenge(string memory _name) external {
        require(
            bytes(_name).length > 0,
            "SimpleChallengePlatform: Challenge name cannot be empty"
        );

        uint256 newChallengeId = _nextChallengeId; // Use our manual counter
        _nextChallengeId++; // Increment for the next challenge

        challenges.push(
            Challenge({id: newChallengeId, name: _name, creator: msg.sender})
        );

        emit ChallengeCreated(newChallengeId, _name, msg.sender);
    }

    /**
     * @dev Allows a user to join an existing challenge.
     * @param _challengeId The ID of the challenge to join (1-based).
     */
    function joinChallenge(uint256 _challengeId) external {
        // Validate the challengeId against the number of created challenges
        // _challengeId is 1-based, _nextChallengeId is the ID for the *next* potential challenge
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "SimpleChallengePlatform: Challenge does not exist"
        );
        require(
            !isParticipant[_challengeId][msg.sender],
            "SimpleChallengePlatform: Already joined this challenge"
        );

        isParticipant[_challengeId][msg.sender] = true;
        // Note: We are not incrementing a participantCount on the Challenge struct itself in this version
        // to keep the struct minimal. isParticipant mapping handles the join status.

        emit ChallengeJoined(_challengeId, msg.sender);
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
            "SimpleChallengePlatform: Challenge does not exist"
        );
        // The challenges array is 0-indexed.
        // If IDs are 1, 2, 3, ... they correspond to indices 0, 1, 2, ...
        // So, challenge with ID 'n' is at index 'n-1'.
        return challenges[_challengeId - 1];
    }

    /**
     * @dev Checks if a user has joined a specific challenge.
     * @param _challengeId The ID of the challenge (1-based).
     * @param _user The address of the user.
     * @return True if the user has joined, false otherwise.
     */
    function hasJoined(
        uint256 _challengeId,
        address _user
    ) external view returns (bool) {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId, // Validate against _nextChallengeId
            "SimpleChallengePlatform: Challenge does not exist"
        );
        return isParticipant[_challengeId][_user];
    }
}
