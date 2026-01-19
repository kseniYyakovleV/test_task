
const MAX_FILE_SIZE_BYTES = 5;
const HIDDEN_TYPES = ["text", "email"]
const MIN_PASSPORT_VALIDITY_PERIOD_MONTHS = 10;
const MIN_AGE_YEARS = 18;
const PHONE_CODES = new Map([
    ["Боливия", "+591"],
    ["Бразилия", "+55"],
    ["Венгрия", "+36"],
    ["Индонезия", "+62"],
    ["Казахстан", "+7"],
    ["Мьянма", "+95"],
    ["Намибия", "+264"],
    ["Руанда", "+250"],
    ["Узбекистан", "+998"]
]);
const COUNTRY_NAMES_TO_ICON_SRC = new Map([
    ["Боливия", "static/images/country_icons/Bolivia.png"],
    ["Бразилия", "static/images/country_icons/Brazilia.png"],
    ["Венгрия", "static/images/country_icons/Vengria.png"],
    ["Индонезия", "static/images/country_icons/Indonesia.png"],
    ["Казахстан", "static/images/country_icons/Kazakhstan.png"],
    ["Мьянма", "static/images/country_icons/Myanmar.png"],
    ["Намибия", "static/images/country_icons/Namibia.png"],
    ["Руанда", "static/images/country_icons/Rwanda.png"],
    ["Узбекистан", "static/images/country_icons/Uzbekistan.png"]
]);


function file_size_is_valid(file) {
    let file_size_mb = file.size / 10**6;
    return file_size_mb < MAX_FILE_SIZE_BYTES;
}

function age_is_valid(age) {
    let current_date = new Date();
    let min_valid_date = current_date;
    min_valid_date.setFullYear(current_date.getFullYear() - MIN_AGE_YEARS);
    return age <= min_valid_date;
}

function passport_validity_period_is_valid(date) {
    const MIN_PASSPORT_VALIDITY_PERIOD_MONTHS = 6;
    let current_date = new Date();
    let max_valid_date = current_date;
    max_valid_date.setMonth(current_date.getMonth() + MIN_PASSPORT_VALIDITY_PERIOD_MONTHS);
    return date > max_valid_date;
}

function input_is_valid(input)  {
    const DIGITS = "0123456789";

    if (input.type == "text") {
        let is_optional = Boolean(input.dataset.isOptional);
        if (is_optional) { return true; }
        return (input.value != "");

    } else if (input.type == "email") {
        
        if ( !input.value.includes("@") ) { return false; }

        let parts = input.value.split("@");
        if ( parts.length != 2 ) { return false; }

        if ( parts[0].length < 1 ) { return false; }

        if ( !parts[1].includes(".") ) { return false; }
        let domains = parts[1].split(".");
        let domain = domains[0];
        let tld = domains[1];

        if ( domain.length < 1 || DIGITS.includes(domain[0])) { return false; }
        if ( tld.length < 1 || DIGITS.includes(tld[0])) { return false; }

    } else if (input.type == "file") {
        if (input.id == "visa_photo_input") {
            let have_visa_input = document.getElementById("have_visa_input");
            if ( !have_visa_input.checked ) { return true; }
        }
        let files = input.files;
        if ( files.length == 0 ) { return false; }
        Array(files).forEach(element => {
            if ( !file_size_is_valid(element) ) { return false; }
        });

    } else if (input.type == "tel") {
        let value = input.value;
        if (value.length < 10) { return false; }
        if (value[0] != "+") { return false; }
        for (let index = 1; index < value.length; index++) {
            const char = value[index];
            if ( !DIGITS.includes(char) ) {return false; }
        }
    } else if (input.id == "foreign_passport_validity_period_input") {
        if (input.value == "") { return false; }
        let date = new Date(input.value);
        return passport_validity_period_is_valid(date);
    } else if (input.id == "birthday_date_input") {
        if (input.value == "") { return false; }
        let date = new Date(input.value);
        return age_is_valid(date);
    }

    return true;
}

function get_input_section(input) {
    let input_section = input.parentElement.parentElement;
    if (input_section.className == "form_input_section") {
        input_section = input_section.parentElement;
    } 
    if (input_section.className == "opened_list" || input_section.className == "closed_list") {
        input_section = input_section.parentElement;
    }
    return input_section;
}

function check_input(input) {
    let input_section = get_input_section(input);
    if (input.type != "file" && input.type != "hidden") {
        if (input_is_valid(input)) {
            input_section.className = "valid_input_section";
            return true;
        } else {
            input_section.className = "invalid_input_section";
            return false;
        }

    } else if (input.type == "file") {
        if (input.value == "") {
            input_section.className = "empty_invaid_input_section";
            return false;
        } else if (input_is_valid(input)) {
            input_section.className = "not_empty_valid_input_section";
            return true;
        } else {
            input_section.className = "not_empty_invalid_input_section";
            return false;
        }
    }
    
}

function check_all_inputs() {
    let result = true;
    let inputs = document.getElementsByTagName("input");
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        if (input.id == "visa_photo_input") {
            let have_visa_input = document.getElementById("have_visa_input");
            if ( !have_visa_input.checked ) { console.log('empty'); continue; }
        }
        result = check_input(input) && result;
    }
    return result;
}


function display_label(input) {
    if (HIDDEN_TYPES.includes(input.type)) {
        let label = input.parentElement.getElementsByTagName("label")[0];
        if (input.value == "") {
            label.style.opacity = "0%";
        } else {
            label.style.opacity = "100%";
        }
    }
}

function display_all_labels() {
    let inputs = document.getElementsByTagName("input");
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        if (HIDDEN_TYPES.includes(input.type) && !input.readOnly) {
            display_label(input);
        }
    }
}


function connect_have_visa_checkbox() {

    // Переносит значение искуственного checkbox на скрытый настоящий
    let have_visa_input = document.getElementById("have_visa_input");
    let have_visa_icon = document.getElementById("have_visa_icon");
    if (have_visa_icon.style.display == "none") {
        have_visa_input.checked = false;
    } else {
        have_visa_input.checked = true;
    }
}

function connect_add_visa_photo_input() {
     // Скрывает и показывает поле ввода фото визы в зависимости от скрытого checkbox 
    let have_visa_input = document.getElementById("have_visa_input");
    let visa_photo_input = document.getElementById("visa_photo_input");
    let container = visa_photo_input.parentElement.parentElement.parentElement;
    if (have_visa_input.checked) {
        if (visa_photo_input.value == "") {
            container.className = "empty_valid_input_section";
        } else {
            container.className = "not_empry_valid_input_section";
        }
    } else {
        container.className = "hidden_file_input_section";
    }

}

function clear_file_inputs() {
    let file_input_containers = document.getElementsByClassName("add_file_container");
    for (let index = 0; index < file_input_containers.length; index++) {
        const file_input_container = file_input_containers[index];
        let file_input = file_input_container.getElementsByTagName("input")[0];
        file_input.value = "";  
    }
}

function init_form() {

    // Инициализация checkbox
    let have_visa_input = document.getElementById("have_visa_input");
    if (have_visa_input.checked) {
        let have_no_visa_icon = document.getElementById("have_no_visa_icon");
        have_no_visa_icon.style.display = "none";
    } else {
        let have_visa_icon = document.getElementById("have_visa_icon");
        have_visa_icon.style.display = "none";
    }
    connect_add_visa_photo_input();

    // Генерация сообщений о нарушении срока заграничного паспорта и минимального возраста
    let passport_validity_period_warning_message = document.getElementById("passport_validity_period_warning_message");
    passport_validity_period_warning_message.textContent = `Срок действия заграничного паспорта должен быть не менее ${MIN_PASSPORT_VALIDITY_PERIOD_MONTHS} месяца(-ев) с текущего момента`
    let min_age_warning_message = document.getElementById("min_age_warning_message");
    min_age_warning_message.textContent = `Участие могут принимать лишь лица старше ${MIN_AGE_YEARS} лет`



    let country_input = document.getElementById("country_input");
    if (country_input.value.length > 0) {
        country_input.size = country_input.value.length;
    } else {
        country_input.size = 1;
    }
    let country_input_container = document.getElementsByClassName("country_input_container")[0];
    let country_icon = country_input.parentElement.getElementsByClassName("country_icon")[0];
    if (COUNTRY_NAMES_TO_ICON_SRC.keys().toArray().includes(country_input.value)) {
        country_icon.src = COUNTRY_NAMES_TO_ICON_SRC.get(country_input.value);
    }


    
    country_icon = document.getElementById("coutry_list_country_icon");
    let country_for_phone_number_input = document.getElementById("country_for_phone_number_input");
    if (country_for_phone_number_input.value.length > 0) {
        let choosen_country_name = country_for_phone_number_input.value;
        if (COUNTRY_NAMES_TO_ICON_SRC.keys().toArray().includes(choosen_country_name)) {
            country_icon.src = COUNTRY_NAMES_TO_ICON_SRC.get(choosen_country_name);
        }
    }
    


    clear_file_inputs();
    display_all_labels();
}


init_form();






// Event listeners


function add_display_label_events() {
    let inputs = document.getElementsByTagName("input");
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        input.addEventListener("input", event=> {
            display_label(input);
        }); 
    }
}

function add_hide_warning_message_events() {
    let inputs = document.getElementsByTagName("input");
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        input.addEventListener("input", event=> {
            let input_section = get_input_section(input);
            if (input_section.className == "invalid_input_section") {
                check_input(input);
            }
        }); 
    }
}

function add_focus_hr_event() {
    let inputs = document.getElementsByTagName("input");
    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        if (input.type == "checkbox" || input.type == "file" || input.type == "submit") { continue; }
        input.addEventListener("focusin", event=> {
            let input_section = get_input_section(input);
            let hr = input_section.getElementsByTagName("hr")[0];
            hr.className = "focused_field";
        });

        input.addEventListener("focusout", event=> {
            let input_section = get_input_section(input);
            let hr = input_section.getElementsByTagName("hr")[0];
            hr.className = "";
        });
    }
}

function add_list_dropping_event() {
    let clickable_phone_number_area = document.getElementById("area_for_list_droping");
    let clickable_country_area = document.getElementsByClassName("country_input_container")[0];
   

    clickable_phone_number_area.addEventListener("click", event=> {
        let style_container = clickable_phone_number_area.parentElement.parentElement.parentElement;
        if (style_container.className == "opened_list") {
            style_container.className = "closed_list";
        } else {
            style_container.className = "opened_list";
        }
    });
    
    clickable_country_area.addEventListener("click", event=> {
        let style_container = clickable_country_area.parentElement.parentElement;
        if (style_container.className == "opened_list") {
            style_container.className = "closed_list";
        } else {
            style_container.className = "opened_list";
        }
    });
}

function add_click_visa_checkbox_event() {
    let visa_checkbox_container = document.getElementById("visa_input_container");
    let visa_photo_input = document.getElementById("visa_photo_input");
    visa_checkbox_container.addEventListener("click", event=> {
        let visa_photo_container = event.target.parentElement.parentElement.parentElement;
        let have_no_visa_icon = document.getElementById("have_no_visa_icon");
        let have_visa_icon = document.getElementById("have_visa_icon");
        if (have_no_visa_icon.style.display == "none") {
            have_no_visa_icon.style.display = "";
            have_visa_icon.style.display = "none";
            visa_photo_input.value = "";
        } else {
            have_no_visa_icon.style.display = "none";
            have_visa_icon.style.display = "";
            visa_photo_input.value = "";
        }
        connect_have_visa_checkbox();
        connect_add_visa_photo_input();
    });
}   


function add_change_files_event() {
    let add_file_containers = document.getElementsByClassName("add_file_container");
    for (let index = 0; index < add_file_containers.length; index++) {
        let container = add_file_containers[index];
        let file_input = container.getElementsByTagName("input")[0];
        file_input.addEventListener("change", event=> {
            if (file_input.files.length > 0) {
                let validation_container = file_input.parentElement.parentElement.parentElement;
                validation_container.className = "not_empty_valid_input_section";
            }
            console.log(file_input.files)
        });
    }
}

function add_click_add_files_event() {
    let add_file_containers = document.getElementsByClassName("add_file_container");
    for (let index = 0; index < add_file_containers.length; index++) {
        const add_file_container = add_file_containers[index];
        add_file_container.addEventListener("click", event=> {
            let container = event.target;
            while (container.className != "add_file_container") {
                container = container.parentElement;
            }
            let input = container.getElementsByTagName("input")[0];
            input.click(); 
        });
        
    }
}

function add_click_next_button_event() {
    let next_button = document.getElementById("next_button");
    let form = document.getElementById("registration_form");
    next_button.addEventListener("click", target=>{
        if (check_all_inputs()) {
            form.submit();
        }
    });
}


function add_choose_country_event() {
    let country_items = document.getElementsByClassName("country_item");
    for (let index = 0; index < country_items.length; index++) {
        const country_item = country_items[index];
        country_item.addEventListener("click", event=>{
            let target = event.target;
            while (target.className != "country_item") {
                target = target.parentElement;
            }
            let choosen_img_src = target.getElementsByTagName("img")[0].src;
            let choosen_country_name = target.getElementsByTagName("span")[0].textContent;

            while (target.className != "country_list_container") {
                target = target.parentElement;
            }

            let form_input_section = target.parentElement.getElementsByClassName("form_input_section")[0];
            if (form_input_section.id == "country") {
                let country_input = form_input_section.getElementsByTagName("input")[0];
                country_input.value = choosen_country_name;
                country_input.size = choosen_country_name.length;
                let country_image = form_input_section.getElementsByTagName("img")[0];
                country_image.src = choosen_img_src;
            } else {
                let country_image = form_input_section.getElementsByClassName("country_icon")[0];
                let phone_number_input = form_input_section.getElementsByTagName("input")[0];
                console.log(country_image);
                console.log(phone_number_input);
                phone_number_input.value = PHONE_CODES.get(choosen_country_name);
                country_image.src = choosen_img_src;
                let country_for_phone_number_input = document.getElementById("country_for_phone_number_input");
                country_for_phone_number_input.value = choosen_country_name;
            }
            let list_container = form_input_section.parentElement;
            list_container.className = "closed_list";

        });
    }
}








add_display_label_events();
add_hide_warning_message_events();
add_focus_hr_event();
add_list_dropping_event();
add_click_visa_checkbox_event();
add_change_files_event()
add_click_add_files_event();
add_click_next_button_event();
add_choose_country_event();
