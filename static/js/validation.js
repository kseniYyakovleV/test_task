
let nameInput = document.getElementById("nameInput");
function nameIsValid() {
    return nameInput.value != "";
}

let lastnameInput = document.getElementById("lastnameInput");
function lastnameIsValid() {
    return lastnameInput.value != "";
}

let dateOfBirthday = document.getElementById("dateOfBirthday");
function dateOfBirthdayIsValid() {
    return dateOfBirthday.value != "";
}


phoneNumber = document.getElementById("phoneNumber");
function phoneNumberIsValid() {
    let code = phoneNumber.placeholder;
    let value = phoneNumber.value;
    if (value.charAt(0) != "+") {
        return false;
    }
    if (value.length != code.length + 10) {
        return false;
    }
    let charCode;
    for (index of value) {
        charCode = value.charCodeAt(index);
        if (charCode == 43) {
            continue;
        }
        if (charCode > 57 || charCode < 48) {
            return false;
        }
    }
    return true
}

let email = document.getElementById("email");
function emailIsValid() {
    let value = email.value;
    if (!value.includes("@")) {
        return false;
    }
    let parts = value.split("@");
    let leftPart = parts[0];
    if (leftPart.length == 0) {
        return false;
    }
    let rightPart = parts[1];
    if (!rightPart.includes(".")) {
        return false;
    }

    parts = rightPart.split(".")
    leftPart = parts[0];
    rightPart = parts[1];

    if (leftPart.length == 0 || rightPart.length == 0) {
        return false;
    }
    return true;
}

let teamName = document.getElementById("teamName");
function teamNameIsValid() {
    return teamName.value != "";
}

let foreignPassport = document.getElementById("foreignPassport");
function foreignPassportIsValid() {
    return foreignPassport.value != "";
}


/* Photo validation */

const MAX_SIZE_MB = 5;  
const EXTENSIONS = [".png", ".jpg", '.jpeg', '.webp', '.pdf']

function isFileNameValid(file) {
    let fileName = file.name;
    let extensionIndex = fileName.lastIndexOf(".");
    let extension = fileName.substring(extensionIndex, fileName.length);
    
    return EXTENSIONS.includes(extension);
}

function isFileSizeValid(file) {
    let fileSize = file.size;
    let fileSizeMB = fileSize / 2**20;
    return fileSizeMB < MAX_SIZE_MB;
}

let fileInputs = document.getElementsByClassName("fileInput");
for (fileInput of fileInputs) {
    fileInput.addEventListener("input", event=> {
        let target = event.target;
        let file = target.files[0];
        let fileInputContainer = target.parentElement.parentElement;

        if (isFileNameValid(file) && isFileSizeValid(file)) {
            fileInputContainer.className = "validInputField";
        } else {
            fileInputContainer.className = "invalidInputField";
            target.value = "";
        }
        
    });
}


let emptyFileInputs = document.getElementsByClassName("emptyFileInput");
function isFilesValid() {
    let result = true;
    for (emptyFileInput of emptyFileInputs) {
        let field = emptyFileInput.parentElement;
        if (field.className == "invalidInputField") {
            return false;
        }
    }
    return true;
}


let submit = document.getElementById("submit");
function checkInputs() {
    let result = true;
    if (!nameIsValid()) {
        nameInput.parentElement.className = "invalidInputField";
        result&= false;
    } else {
        nameInput.parentElement.className = "validInputField";
    }

    if (!lastnameIsValid()) {
        lastnameInput.parentElement.className = "invalidInputField";
        result&= false;
    } else {
        lastnameInput.parentElement.className = "validInputField";
    }

    if (!dateOfBirthdayIsValid()) {
        dateOfBirthday.parentElement.className = "invalidInputField";
        result&= false;
    } else {
        dateOfBirthday.parentElement.className = "validInputField";
    }


    if (!emailIsValid()) {
        email.parentElement.className = "invalidInputField";
        result&= false;
    } else {
        email.parentElement.className = "validInputField";
    }

    if (!teamNameIsValid()) {
        teamName.parentElement.className = "invalidInputField";
        result&= false;
    } else {
        teamName.parentElement.className = "validInputField";
    }

    if (!foreignPassportIsValid()) {
        foreignPassport.parentElement.className = "invalidInputField";
        result&= false;
    } else {
        foreignPassport.parentElement.className = "validInputField";
    }

    result&= isFilesValid();

    return result;
}