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
  })
 })

});
