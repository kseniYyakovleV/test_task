

let inputs = document.getElementsByTagName("input");

for(element of inputs) {

    if (element.type == "text" || element.type == "email") {
        element.addEventListener("input", (event)=>{
            let label = event.target.parentElement.getElementsByTagName("label")[0];
            if (event.target.value != "") {
                label.style.setProperty("visibility", "visible");
            } else {
                label.style.setProperty("visibility", "hidden");
            }
        });
    }
}

let arrow = document.getElementById("arrow");
let countriesListForNumberContainer = document.getElementById("countriesListForNumberContainer");
arrow.addEventListener("click", (event)=> {
    if (countriesListForNumberContainer.style.display == "block") {
        countriesListForNumberContainer.style.display = "none";
    } else {
        countriesListForNumberContainer.style.display = "block";
    }
});



const PHONE_CODES = new Map([
    ["bolivia", "+591"],
    ["brazilia", "+55"],
    ["indonesia", "+62"],
    ["kazakhstan", "+7"],
    ["myanmar", "+95"],
    ["namibia", "+264"],
    ["rwanda", "+250"],
    ["uzbekistan", "+998"],
    ["vengria", "+36"]
]);


let countries = document.getElementsByClassName("country");
let phoneNumberContainer = document.getElementById("phoneNumberContainer");
let choosenCountryIcon = document.getElementById("choosenCountryIcon");
let phoneNumber = document.getElementById("phoneNumber");
for (country of countries) {
    country.addEventListener("click", (event)=> {
        let target;
        if (event.target.className == "country") {
            target = event.target;
        } else {
            target = event.target.parentElement;
        }
        let countryName = target.id;

        choosenCountryIcon.src = "country_icons/" + countryName.charAt(0).toUpperCase() + countryName.substring(1) + ".png";
        phoneNumber.value = PHONE_CODES.get(countryName);
        phoneNumber.placeholder = PHONE_CODES.get(countryName);
        countriesListForNumberContainer.style.display = "none";
    });
}


let arrow2 = document.getElementById("arrow2");
let countriesListContainer = document.getElementById("countriesListContainer");
arrow2.addEventListener("click", (event)=> {
    if (countriesListContainer.style.display == "block") {
        countriesListContainer.style.display = "none";
    } else {
        countriesListContainer.style.display = "block";
    }
});




let countries2 = document.getElementsByClassName("country2");
let countryNameInput = document.getElementById("countryNameInput");
let choosenCountryIcon2 = document.getElementById("choosenCountryIcon2");

for (country of countries2) {
    country.addEventListener("click", (event)=> {
        let target;
        if (event.target.className == "country2") {
            target = event.target;
        } else {
            target = event.target.parentElement;
        }
        let countryName = target.id;
        let len = countryName.length;
        choosenCountryIcon2.src = "country_icons/" + countryName.charAt(0).toUpperCase() + countryName.substring(1, len-1) + ".png";
        let russianName = target.getElementsByTagName("span")[0];
        countryNameInput.value =  russianName.textContent;
        countryNameInput.size = countryNameInput.value.length;
        countriesListContainer.style.display = "none";
    });
}


let haveVisaContainer = document.getElementById("haveVisaContainer");
let hiddenCheckboxInput = document.getElementById("haveVisaHiddenInput");
let addVisaPhotoContainer = document.getElementById("addVisaPhotoContainer");
let visaInput = document.getElementById("visaInput");
haveVisaContainer.addEventListener("click", event=> {
    let iHaveNo = document.getElementById("iHaveNo");
    let iHave = document.getElementById("iHave");
    let addVisaPhoto = addVisaPhotoContainer.getElementsByTagName("div")[0];
    if (iHaveNo.style.display == "none") {
        iHaveNo.style.display = "block";
        iHave.style.display = "none";
        hiddenCheckboxInput.checked = false;
        addVisaPhoto.className = "validInputField";
        visaInput.value = "";

    } else {
        iHaveNo.style.display = "none";
        iHave.style.display = "block";
        hiddenCheckboxInput.checked = true;
        addVisaPhoto.className = "emptyInputField";
    }
});



let fileInputContainers = document.getElementsByClassName("fileInputContainer");
for (fileInputContainer of fileInputContainers) {
    fileInputContainer.addEventListener("click", event=> {
        let target = event.target;
        while (target.className != "fileInputContainer") {
            target = target.parentElement;
        }
        if(target.id == "addVisaPhotoContainer") {
            console.log("Yes")
            let iHave = document.getElementById("iHave");
            if (iHave.style.display == "none") {
                console.log("double yes")
                return;
            }
        }

        let fileInput = target.getElementsByClassName("fileInput")[0];
        fileInput.click()
    });
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
        let inputWrapper = fileInputContainer.getElementsByTagName("div")[0];

        if (isFileNameValid(file) && isFileSizeValid(file)) {
            fileInputContainer.className = "validInputField";
        } else {
            fileInputContainer.className = "invalidInputField";
        }
        
    });
}


let nextContainer = document.getElementById("nextContainer");
nextContainer.addEventListener("click", event=> {
    if (checkInputs()) {
        submit.click();
    }
});




