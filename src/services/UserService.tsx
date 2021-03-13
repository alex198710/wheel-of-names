const storage = window.localStorage
const DEFAULT = "default_list"

export default class UserService {
  public static getUserList() {
    const storedList = storage.getItem(DEFAULT)
    return storedList
      ? JSON.parse(storedList)
      : [
          "Millicent Drummond",
          "Ember Bonilla",
          "Gurdeep Hulme",
          "Scarlett Harrison",
          "Milan Edwards",
          "Aishah Kouma",
          "Arya Spooner",
          "Ella-Louise Bone",
          "Yuvaan Bate",
          "Humayra Adkins",
          "Rogan Costa",
          "Ivy-Rose Montes",
          "Adrian Harrell",
          "Bronte Mcknight",
        ]
  }

  public static addItem(name: string) {
    storage.setItem(DEFAULT, JSON.stringify([...UserService.getUserList(), name]))
  }

  public static deleteItem(n: string) {
    storage.setItem(
      DEFAULT,
      JSON.stringify(UserService.getUserList().filter((e: string) => e !== n))
    )
  }

  public static reset() {
    storage.clear()
    window.location.reload()
  }
}
