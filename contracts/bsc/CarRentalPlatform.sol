// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
contract CarRentalPlatform {


  //Counter
  using Counters for Counters.Counter;
  Counters.Counter private _counter;

  //Owner

  address private owner;

  //TotalPayments

  uint private totalPayments;

  //user struct
  struct User {
    address walletAddress;
    string name;
    string lastname;
    uint rentedCarId;
    uint balance;
    uint debt; 
    uint start;
  }

  //car struct
  struct Car{
    uint id;
    string name;
    string imgUrl;
    Status status;
    uint rentFee;
    uint saleFee;
  }

  //enum to indicate the status of the car
  enum Status{
    Retired,
    InUse,
    Available
  }

  //events

  event CarrAdded(uint indexed id, string name, string imgUrl, uint rentFee, uint saleFee );

  event CarMetadataEdited(uint indexed id, string name, string imgUrl, uint rentFee, uint saleFee);

  event CarStatusEdited(uint indexed id, Status status);
  event UserAdded(address indexed wallletAddress, string name, string lastname);
  event Deposit(address indexed walletAddress, uint amount);
  event CheckOuut(address indexed walletAddress , uint indexed carId);
  event CheckIn(address indexed walletAddres, uint indexed carId );
  event PaymentMade(address indexed walletAddress, uint amount);
  event BalenceWithdrawn(address indexed walletAddress, uint amount);

  //user mapping
  mapping(address => User) private users;

  //car mapping
  mapping(uint=> Car) private cars;

  //constructor
  constructor(){
    owner = msg.sender;
    totalPayments= 0;

  }

  //MODIFIERS
  //OnlyOwner
  modifier onlyOwner(){
    require(msg.sender ==owner, "Only the owner can call this function");
    _;
  }




}