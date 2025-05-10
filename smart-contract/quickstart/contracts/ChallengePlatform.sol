// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleChallengePlatform
 * @dev A very basic contract for creating and joining challenges without Counters.sol.
 */
contract ChallengePlatform {
    uint256 private _nextChallengeId = 1; // Start challenge IDs from 1


    struct Player {
        address player;
        bool isWinner;
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
        uint256 stake_price;
        Player[] players_suscribed;
    }

    // Array to store all challenges.
    // Note: Storing unbounded arrays can be gas-intensive if they grow very large.
    // For a small number of challenges, this is okay. For many, consider events for off-chain indexing.
    Challenge[] public challenges;

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
    function createChallenge(string memory _name, uint256 _stake_price, uint256 _start_date, uint256 _end_date) external {
        require(
            bytes(_name).length > 0 && _stake_price > 0 && _start_date > 0 && _end_date > 0,
            "SimpleChallengePlatform: Challenge name, stake price and dates cannot be empty"
        );

        uint256 newChallengeId = _nextChallengeId; // Use our manual counter
        _nextChallengeId++; // Increment for the next challenge

        challenges.push(
            Challenge({
                id: newChallengeId, 
                name: _name, 
                creator: msg.sender, 
                start_date: _start_date, 
                end_date: _end_date, 
                pool: 0, 
                stake_price: _stake_price, 
                players_suscribed: new Player[](0)})
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
            "SimpleChallengePlatform: Challenge does not exist"
        );

        bool alreadyJoined = false;
        for (uint i = 0; i < challenges[_challengeId].players_suscribed.length; i++) {
            if (challenges[_challengeId].players_suscribed[i].player == _player) {
                alreadyJoined = true;
                break;
            }
        }

        return alreadyJoined;
    }

    /**
     * @dev Allows a user to join an existing challenge.
     * @param _challengeId The ID of the challenge to join (1-based).
     */
    function joinChallenge(uint256 _challengeId, address _player_address) external {
        // Validate the challengeId against the number of created challenges
        // _challengeId is 1-based, _nextChallengeId is the ID for the *next* potential challenge
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId,
            "SimpleChallengePlatform: Challenge does not exist"
        );
        
        // Check if player already joined
        require(!this.hasJoined(_challengeId, _player_address), 
            "SimpleChallengePlatform: Already joined this challenge");

        require(
            block.timestamp < challenges[_challengeId].start_date,
            "SimpleChallengePlatform: Challenge did not start yet"
        );
        require(
            block.timestamp > challenges[_challengeId].end_date,
            "SimpleChallengePlatform: Challenge is closed"
        );

        Player memory player = Player({player: _player_address, isWinner: false});
        challenges[_challengeId].players_suscribed.push(player);
        challenges[_challengeId].pool += challenges[_challengeId].stake_price;

        emit ChallengeJoined(_challengeId, msg.sender);
    }

    function setWinner(uint256 _challengeId, address _player) external {
        require(
            challenges[_challengeId].creator == msg.sender,
            "SimpleChallengePlatform: Only the creator can set the winner"
        );  

        for (uint i = 0; i < challenges[_challengeId].players_suscribed.length; i++) {
            if (challenges[_challengeId].players_suscribed[i].player == _player) {
                challenges[_challengeId].players_suscribed[i].isWinner = true;
            }
        }
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
     * @dev Computes the winner'price of a specific challenge.
     * @param _challengeId The ID of the challenge (1-based).
     * @return The price of the winner.
     */
    function computePrice(
        uint256 _challengeId
    ) external view returns (uint256) {
        require(
            _challengeId > 0 && _challengeId < _nextChallengeId, // Validate against _nextChallengeId
            "SimpleChallengePlatform: Challenge does not exist"
        );
        uint256 nb_winner = 0;
        for (uint i = 0; i < challenges[_challengeId].players_suscribed.length; i++) {
            if (challenges[_challengeId].players_suscribed[i].isWinner) {
                nb_winner++;
            }
        }
        uint256 price = challenges[_challengeId].pool / nb_winner;
        return price;
    }
}
