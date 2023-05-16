export class Class_pickUp {

  constructor(pickUpDate, AmountToPickUp, pickUpUserName, post) {
    this.pickUpDate = pickUpDate
    this.AmountToPickUp = AmountToPickUp
    this.pickUpUserName = pickUpUserName
    this.sharingUser = post.getUserName()
  }

}
