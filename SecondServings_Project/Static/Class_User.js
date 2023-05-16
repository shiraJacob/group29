export class Class_User {
  constructor(userName, password, phoneNumber, address, dietPreferences, kosher, restaurantOwner, city) {
    this.userName = userName
    this.password = password
    this.phoneNumber = phoneNumber
    this.address = address
    this.city=city;
    this.dietPreferences = dietPreferences //new vector?
    this.kosher = kosher //vector?
    this.restaurantOwner = restaurantOwner
    this.amountSahre = 0;
    this.amountPickup = 0;
    this.enjoyed= 0;
  }

  getUserName() {
    return this.userName
  }

  getAddress() {
    return this.address
  }

  getPhoneNumber() {
    return this.phoneNumber
  }

  isRestaurantOwner() {
    return this.restaurantOwner
  }

  getDiet() {
    return this.dietPreferences
  }

  getKosher() {
    return this.kosher
  }

  getAmountShare(){
    return this.amountSahre;
  }

  getAmountPickup(){
    return this.amountPickup;
  }

  addAmountShare(){
    this.amountSahre++;
  }

  addAmountPickup(){
    this.amountPickup++;
  }
  getEnjoyed() {
    return this.enjoyed;
  }
 getCity() {
    return this.city;
  }
}
