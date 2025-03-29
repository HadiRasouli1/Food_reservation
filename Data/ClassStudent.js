class Student {
  constructor(ID, firstName, lastName, dateOfBirth, major) {
    this._ID = ID;
    this._firstName = firstName;
    this._lastName = lastName;
    this._dateOfBirth = dateOfBirth;
    this._major = major;
  }

  get ID() {
    return this._ID;
  }

  set ID(value) {
    if (typeof value === "number") {
      this._ID = value;
    } else {
      console.log("ID must be a number");
    }
  }

  get firstName() {
    return this._firstName;
  }

  set firstName(value) {
    if (typeof value === "string") {
      this._firstName = value;
    } else {
      console.log("First name must be a string");
    }
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(value) {
    this._lastName = value;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  set dateOfBirth(value) {
    this._dateOfBirth = value;
  }

  get major() {
    return this._major;
  }

  set major(value) {
    this._major = value;
  }

  displayInfo() {
    console.log(`ID: ${this.ID}`);
    console.log(`First Name: ${this.firstName}`);
    console.log(`Last Name: ${this.lastName}`);
    console.log(`Date of Birth: ${this.dateOfBirth}`);
    console.log(`Major: ${this.major}`);
  }
}

//   const student1 = new Student(12345, 'John', 'Doe', '1998-03-25', 'Computer Science');
//   student1.ID = 54321;
//   student1.firstName = "hadi";
//   student1.displayInfo();

export default Student;
