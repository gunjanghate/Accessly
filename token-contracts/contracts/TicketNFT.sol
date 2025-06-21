// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    struct EventData {
        string eventName;
        string date;
        string location;
        string seat;
        uint256 price;
    }

    mapping(uint256 => EventData) public ticketMetadata;

    constructor(
        address initialOwner
    ) ERC721("AccesslyTicket", "ACT") Ownable(initialOwner) {}

    function mintTicket(
        address to,
        string memory _eventName,
        string memory _date,
        string memory _location,
        string memory _seat,
        uint256 _price,
        string memory _tokenURI
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        ticketMetadata[tokenId] = EventData(
            _eventName,
            _date,
            _location,
            _seat,
            _price
        );

        nextTokenId++;
        return tokenId;
    }
}
