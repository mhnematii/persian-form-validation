class Validator {
    constructor(form) {
        this.form = form;
        form.setAttribute("novalidate", true);
    }

    inputEmptyValidator = (options) => {
        this.formValid = true;
        try {
            const form = this.form;
            if (form) {
                form.addEventListener("submit", this.formSubmit)
            } else {
                throw new Error("ورودی تابع نادرست می باشد!");
            }
            let requiredInputs = [...form].filter((element) => {
                return element.tagName == "INPUT" && element.hasAttribute("required");
            });
            if (requiredInputs) {
                requiredInputs.forEach(input => {
                    const elementHaveRegex = input.hasAttribute("pattern");
                    if (options != undefined && options.regex == true) {
                        if (elementHaveRegex) {
                            input.addEventListener("change", this.regexValidator);
                        }
                    }
                    if (!elementHaveRegex) {
                        input.addEventListener("change", this.inputOnChange);
                    }
                    let errorElement = document.createElement("span");
                    errorElement.style.color = "#d40000";
                    errorElement.id = `${input.id}Error`;
                    input.parentNode.appendChild(errorElement);
                })
            }
            ;
        } catch {
            throw new Error("مشکلی به وجود آمده است!");
        }
    }

    formSubmit = (e) => {
        let arrayOfInput = [...e.target];
        arrayOfInput = arrayOfInput.filter((element) => {
            return element.tagName == "INPUT" && element.hasAttribute("required");
        });
        arrayOfInput.forEach((input) => {
            const elementHaveRegex = input.hasAttribute("pattern");
            let spanError = document.getElementById(`${input.id}Error`);
            if (input.value == "") {
                let [label] = input.labels;
                e.preventDefault();
                spanError.innerHTML = `عنوان ${label.textContent} الزامی میباشد.`;
            } else {
                spanError.innerHTML = "";
                if (elementHaveRegex) {
                    let regexStatus = this.regexInputOnChange(input);
                    if (!regexStatus) {
                        e.preventDefault();
                    }
                }
            }
        });
    }

    inputOnChange = (e) => {
        let targetInput = e.target;
        let spanError = document.getElementById(`${targetInput.id}Error`);
        if (targetInput.value == "") {
            spanError.innerHTML = `عنوان ${targetInput.labels[0].textContent} الزامی میباشد.`;
        } else {
            spanError.innerHTML = "";
        }
    }

    regexInputOnChange = (input) => {
        let pattern = input.pattern;
        let spanError = document.getElementById(`${input.id}Error`);
        let exp = new RegExp(pattern);
        let regexResult = exp.test(input.value);
        if (!regexResult) {
            if (input.value == "") {
                spanError.innerHTML = ` عنوان ${input.labels[0].textContent} الزامی میباشد.`;
            } else {
                spanError.innerHTML = ` فرمت ${input.labels[0].textContent} نادرست میباشد.`;
            }
        } else {
            spanError.innerHTML = "";
        }
        return regexResult;
    }

    regexValidator = (e) => {
        let targetInput = e.target;
        this.regexInputOnChange(targetInput);
    }
}