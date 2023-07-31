const CarRentalPlatform = artifacts.require("CarRentalPlatform");

contract("CarRentalPlatform", accounts => {
 let carRentalPlatform;
 const owner = accounts[0];
 const user1 = accounts[1];

 beforeEach(async () =>{

 });

 descrie("Add user and car", ()=>{
  it("adds a new user", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from : user1});
    const user = await carRentalPlatform.getUser(user1);
    assert.equal(user.name, "Alice", "Promlem with user name");
    assert.equal(user.lastname, "Smith", "Promlem with user lastname");
  });
  
  it("adds a car", async ()=>{
    await carRentalPlatform.addCar("Tesla Model S", "example url", 10, 50000,{from:owner});
    const car = await carRentalPlatform.getCar(1);
    assert.equal(car.name, "Tesla Model S", "Prolem with car name");
    assert.equal(car.imgUrl, "example imgUrl", "Prolem with img Url");
    assert.equal(car.rentFee, 10, "Prolem with rent fee");
    assert.equal(car.saleFee, 50000, "Prolem with sale fee");
  });
 });

 descrie ("Check out and check in car", ()=>{
  it("Check out a car", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from:user1});
    await carRentalPlatform.addCar("Tesla Model S", "example url", 10, 50000, {from:owner});
    await carRentalPlatform.checkout(1, {from:user1});

    const user = await carRentalPlatform.getUser(1);
    assert.equal(user.rentedCarId, 1, "User could not check out the car");
  });

  it("Checks in a car", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from:user1});
    await carRentalPlatform.addCar("Tesla Model S", "example url", 10, 50000, {from:owner});
    await carRentalPlatform.checkout(1, {from:user1});
    await new Promise((resolve)=> setTimeOut(resolve, 60000)); // 1min.

    await carRentalPlatform.checkIn({from: user1});

    const user = await carRentalPlatform.getUser(user1);

    assert. equal(user.rentedCarId, 0, "User could not check in the car");
    assert.equal(user.debt, 10, "User debt did not get created");
  });
 });

 descrie("Deposit token and make payment", ()=>{
  it("deposits token", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from:user1});
    await carRentalPlatform.deposit({from:user1, value:10});
    const user = await carRentalPlatform.getUser(user1);
    assert.equal(user.balance, 100, "User could nnot deposit tokens" );
  });

  it("makes a payment", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from:user1});
    await carRentalPlatform.addCar("Tesla Model S", "example url", 10, 50000, {from:owner});
    await carRentalPlatform.checkout(1, {from:user1});
    await new Promise((resolve)=> setTimeOut(resolve, 60000)); // 1min.
    await carRentalPlatform.checkIn({from:user1});

    await carRentalPlatform.deposit({from: user1, value:100});
    await carRentalPlatform.makePayment({from:user1});
    const user = await carRentalPlatform.getUser(user1);

    assert.equal(user.debt, 0, "Something went wrong while trying to make the payment");
  });
 });
 
 describe("edit car", ()=>{
  it("should edit an existing car's metadata with valid parameters", async()=>{
    await carRentalPlatform.addCar("Tesla Model S", "example img url", 10, 50000, {from:owner});

    const newNAme = "Honda";
    const newImgUrl = "new img url";
    const newRentFee = 20;
    const newSaleFee = 100000;
    await carRentalPlatform.editCarMetadata(1, newName, newImgUrl, newRentFee, newSaleFee, {from : owner});

    const car = await carRentalPlatform.getCar(1);
    assert.equal(car.name, newName, "Prolem editing car name");
    assert.equal(car.imgUrl, newImgUrl, "Prolem updating the image url");
    assert.equal(car.rentFee, newRentFee, "Prolem editing rent fee");
    assert.equal(car.saleFee, newSaleFee, "Prolem editing sale fee");
  });

  it("should edit an existing car's status", async()=>{
    await carRentalPlatform.addCar("Tesla Model S", "example img url", 10, 50000, {from:owner});
    const newStatus = 0;
    await carRentalPlatform.editCarStatus(1, newStatus, {from:owner});
    const car = await carRentalPlatform.getCar(1);
    assert.equal(car.status, newStatus, "Prolem with editing car status");
  });
 });

 describe("Withdraw balance", ()=>{
  it("should send the desired amount of tokens to the user", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from:user1});
    await carRentalPlatform.deposit({from: user1, vaalue:100});
    await carRentalPlatform.withdrawBalance(50, {from:user1});

    const user = await carRentalPlatform.getUser(user1);
    assert.equal(user.balance, 50, "User could not get his/her tokens");
  });

  it("should send the desired amount of tokens to the owner", async()=>{
    await carRentalPlatform.addUser("Alice", "Smith", {from:user1});
    await carRentalPlatform.addCar("Tesla Model S", "example url", 10, 50000, {from:owner});
    await carRentalPlatform.checkout(1, {from:user1});
    await new Promise((resolve)=> setTimeOut(resolve, 60000)); // 1min.
    await carRentalPlatform.checkIn({from:user1});
    await carRentalPlatform.deposit({from: user1, value:1000});
    await carRentalPlatform.makePayment({from:user1});

    const totalPaymentAmount = await carRentalPlatform.getTotalPayments({from:owner});
    const amountToWithdraw = totalPaymentAmount - 10;
    await carRentalPlatform.withdrawBalance(amountToWithdraw, {from:owner});
    const totalPayment = await carRentalPlatform.getTotalPayments({from:owner});
    assert.equal(totalPayment, 10, "Owner could not withdraw tokens");
  });
 });

});
