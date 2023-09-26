(async function () {
    let app = document.querySelector('#app');
    let add = document.querySelector('#add');
    let container = document.querySelector('.container');
    let search = document.querySelector('.header__search__field');
    let contactsAll = [];
    let show = false;
    let interval;

    //получить всех клиентов с сервера
    const response = await fetch('http://localhost:3000/api/clients/', {
        method: 'GET',
    });
    let clients = (await response.json());
    let copyClients = [...clients];

    //функция для закрытия
    function close() {
        document.querySelector('.modal-container').classList.remove('active');
        document.querySelector('.modal-container').classList.add('hidden');
        while (add.firstChild) {
            add.removeChild(add.firstChild);
        }
        show = false;
    }

    //кнопка закрытия модалок
    let buttonClose = document.createElement('button');
    buttonClose.classList.add('close');
    buttonClose.classList.add('cursor');
    buttonClose.innerHTML = `<svg width="29" height="14" viewbox="0 0 29 14">
    <use xlink:href="img/sprite.svg#close"></use>
  </svg>`;

    buttonClose.addEventListener('click', function (e) {
        e.preventDefault();
        close();
    })


    //поиск 
    search.addEventListener('keyup', function () {
        clearTimeout(interval);
        interval = setTimeout(function () {
            let result = copyClients.filter(function (client) {
                if (client.name.includes(search.value) || client.surname.includes(search.value) || client.lastName.includes(search.value)) {
                    return true;
                }
            })
            render(result);
        }, 800);

    });



    //ф-ции для работы с временем
    //наш часовой пояс
    function convertTZ(date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
    }

    //формат времени
    function timeNormalize(time) {
        time = String(time).split(' ');
        time = time.splice(4, 1);
        time = String(time).split(':');
        time = time.splice(0, 2).join(':');
        return time;
    }

    //формат даты
    function dateNormalize(date) {
        date = (date.split('T')[0])
        return date.split('-').reverse().join('.');
    }

    //проверка инпута при вводе
    function checkInput(input) {
        let reg = /^[а-яёА-ЯЁ]+$/;
        if (!reg.test(input.value)) {
            input.classList.add('inputError');
        } else {
            input.classList.remove('inputError');
        }
    }

    //создать заголовок таблицы
    let tableClients = document.createElement('table');
    let thead = document.createElement('thead');
    thead.classList.add('tableHead');
    let tbody = document.createElement('tbody');
    let trHed = document.createElement('tr');
    let thID = document.createElement('th');
    thID.innerHTML = 'ID';
    thID.classList.add('id');
    thID.classList.add('over');
    let buttonFilId = document.createElement('a');
    buttonFilId.classList.add('butArrow');
    buttonFilId.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_211_4865)">
    <path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/>
    </g>
    <defs>
    <clipPath id="clip0_211_4865">
    <rect width="12" height="12" fill="white" transform="translate(12 12) rotate(-180)"/>
    </clipPath>
    </defs>
    </svg>    
    `;
    let tdFIO = document.createElement('th');
    tdFIO.innerHTML = 'Фамилия, имя и отчество';
    tdFIO.classList.add('tdFIO');
    let buttonFilName = document.createElement('a');
    buttonFilName.classList.add('butArrow');
    buttonFilName.innerHTML = `<svg width="29" height="14" viewbox="0 0 29 14">
    <use xlink:href="img/sprite.svg#nameArrow"></use>
  </svg>`;
    let tdDateCreate = document.createElement('th');
    tdDateCreate.innerHTML = 'Дата и время создания';
    tdDateCreate.classList.add('tdDateCreate');
    let buttonFilDateCreate = document.createElement('a');
    buttonFilDateCreate.classList.add('butArrow');
    buttonFilDateCreate.innerHTML = `<svg width="29" height="14" viewbox="0 0 12 12">
    <use xlink:href="img/sprite.svg#arrow"></use>
  </svg>
    `;
    let tdDateChange = document.createElement('th');
    tdDateChange.innerHTML = 'Последние изменения';
    tdDateChange.classList.add('tdDateChange');
    let buttonFilDateChange = document.createElement('a');
    buttonFilDateChange.classList.add('butArrow');
    buttonFilDateChange.innerHTML = `<svg width="29" height="14" viewbox="0 0 12 12">
    <use xlink:href="img/sprite.svg#arrow"></use>
  </svg>
    `;
    let tdContacts = document.createElement('th');
    tdContacts.innerHTML = 'Контакты';
    tdContacts.classList.add('tdContacts');
    let tdActions = document.createElement('th');
    tdActions.innerHTML = 'Действия';
    tdActions.classList.add('tdActions');
    let buttonAddClient = document.createElement('button');
    buttonAddClient.classList.add('buttonAddClient');
    buttonAddClient.innerHTML = `<svg width="23" height="16" viewbox="0 0 23 16">
    <use xlink:href="img/sprite.svg#addClients"></use>
  </svg>
    ` + 'Добавить клиента';

    app.appendChild(tableClients);
    tableClients.appendChild(thead);
    thead.appendChild(trHed);
    trHed.appendChild(thID);
    thID.appendChild(buttonFilId);
    trHed.appendChild(tdFIO);
    tdFIO.appendChild(buttonFilName);
    trHed.appendChild(tdDateCreate);
    tdDateCreate.appendChild(buttonFilDateCreate);
    trHed.appendChild(tdDateChange);
    tdDateChange.appendChild(buttonFilDateChange);
    trHed.appendChild(tdContacts);
    trHed.appendChild(tdActions);
    tableClients.appendChild(tbody);
    container.appendChild(buttonAddClient);

    //заполнить таблицу
    async function render(array) {
        tbody.innerHTML = '';
        let prel = document.createElement('div');
        prel.classList.add('fade');
        tbody.appendChild(prel);

        setTimeout(async function () {
            tbody.removeChild(prel);
            for (let elem of array) {
                let tr = document.createElement('tr');
                let tdId = document.createElement('td');
                tdId.classList.add('tdId')
                let tdName = document.createElement('td');
                tdName.classList.add('tableText');
                let tdDateCreate = document.createElement('td');
                tdDateCreate.classList.add('tableText');
                tdDateCreate.classList.add('DateCreate');
                let tdDateChange = document.createElement('td');
                tdDateChange.classList.add('tableText');
                tdDateChange.classList.add('DateChange');
                let tdContacts = document.createElement('td');
                let tdActionsChange = document.createElement('div');
                let divActions = document.createElement('td');
                tdActionsChange.classList.add('tableText');
                let tdActionsDelete = document.createElement('div');
                tdActionsDelete.classList.add('tableText');
                tdId.innerHTML = elem.id.slice(0, 6);
                tdId.classList.add('tableHead');
                tdName.innerHTML = elem.surname + ' ' + elem.name + ' ' + elem.lastName;
                tdName.classList.add('name');
                tdDateCreate.innerHTML = dateNormalize(elem.createdAt) + ' ' + `<span class='span'>${timeNormalize(convertTZ(elem.createdAt))}</span>`;
                tdDateChange.innerHTML = dateNormalize(elem.updatedAt) + ' ' + `<span class='span'>${timeNormalize(convertTZ(elem.updatedAt))}</span>`;

                let contactList = document.createElement('ul');
                contactList.classList.add('contactList');

                for (let contact of elem.contacts) {
                    let contactLi = document.createElement('li');
                    if (contact.type == 'tel') {
                        contactLi.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
                        <use xlink:href="img/sprite.svg#tel"></use>
                      </svg>`;
                        contactLi.title = contact.value;
                    }
                    if (contact.type == 'email') {
                        contactLi.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
                    <use xlink:href="img/sprite.svg#email"></use>
                  </svg>`;
                        contactLi.title = contact.value;
                    }
                    if (contact.type == 'vk') {
                        contactLi.innerHTML = `<svg width="16" heigbacht="16" viewbox="0 0 16 16">
                    <use xlink:href="img/sprite.svg#vk"></use>
                  </svg>`;
                        contactLi.title = contact.value;
                    }
                    if (contact.type == 'fb') {
                        contactLi.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
                    <use xlink:href="img/sprite.svg#fb"></use>
                  </svg>`;
                        contactLi.title = contact.value;
                    }

                    contactList.append(contactLi);
                }

                tdContacts.append(contactList);


                //Удалить клиента
                tdActionsDelete.addEventListener('click', async function (e) {
                    e.preventDefault();
                    document.querySelector('.modal-container').classList.remove('hidden');
                    document.querySelector('.modal-container').classList.add('active');
                    let divDel = document.createElement('div');
                    divDel.classList.add('divDel');
                    divDel.style.position = 'relative';
                    let h2 = document.createElement('h2');
                    h2.classList.add('changeTitle');
                    h2.style.textAlign = 'center';
                    h2.innerHTML = 'Удалить клиента';
                    let p = document.createElement('p');
                    p.classList.add('textDel');
                    p.style.marginBottom = '4%';
                    p.innerHTML = 'Вы действительно хотите удалить данного клиента?';
                    let buttonDel = document.createElement('button');
                    buttonDel.classList.add('buttonSaveClient');
                    buttonDel.innerHTML = 'Удалить';
                    let buttonCancel = document.createElement('button');
                    buttonCancel.classList.add('buttonDelСlient');
                    buttonCancel.innerHTML = 'Отмена';

                    add.appendChild(divDel);
                    divDel.appendChild(h2);
                    divDel.appendChild(p);
                    divDel.appendChild(buttonDel);
                    divDel.appendChild(buttonCancel);
                    divDel.appendChild(buttonClose);

                    buttonDel.addEventListener('click', async function (e) {
                        e.preventDefault();
                        await fetch(`http://localhost:3000/api/clients/${String(elem.id)}`, {
                            method: 'DELETE'
                        });
                        location.reload();
                    });

                    //кнопка отмены
                    buttonCancel.addEventListener('click', function (e) {
                        e.preventDefault();
                        close();
                    })
                });

                //Изменить клиента
                tdActionsChange.addEventListener('click', function (e) {
                    document.querySelector('.modal-container').classList.remove('hidden');
                    document.querySelector('.modal-container').classList.add('active');
                    let formChangeClient = document.createElement('form');
                    formChangeClient.classList.add('formChangeClient');

                    let h2 = document.createElement('h2');
                    h2.classList.add('changeTitle');
                    let span = document.createElement('span');
                    span.classList.add('span');
                    h2.innerHTML = `Изменить данные `;
                    span.innerHTML = 'ID:' + `${elem.id}`;
                    let inputName = document.createElement('input');

                    let pInputName = document.createElement('p');
                    pInputName.classList.add('inputText');
                    inputName.classList.add('inputChange');
                    inputName.placeholder = 'Имя*';
                    inputName.classList.add('addPlaceholder');
                    inputName.classList.add('inputName');
                    inputName.type = 'text';
                    inputName.required = true;
                    inputName.classList.add('inputNameChange');
                    inputName.addEventListener('input', () => {
                        checkInput(inputName);
                    })
                    pInputName.innerHTML = 'Имя*';
                    inputName.value = elem.name;
                    let inputSurname = document.createElement('input');
                    inputSurname.classList.add('addPlaceholder');
                    inputSurname.classList.add('inputSurname');
                    inputSurname.type = 'text';
                    inputSurname.required = true;

                    inputSurname.addEventListener('input', () => {
                        checkInput(inputSurname);
                    })

                    let pInputSurn = document.createElement('p');
                    pInputSurn.classList.add('inputText');
                    inputSurname.classList.add('inputChange');
                    inputSurname.classList.add('inputSurnameChange');
                    inputSurname.type = 'text';
                    pInputSurn.innerHTML = 'Фамилия*';
                    inputSurname.value = elem.surname;
                    contactsAll.push(elem.contacts);
                    let inputLastname = document.createElement('input');
                    let pInputLast = document.createElement('p');
                    pInputLast.classList.add('inputText');
                    inputLastname.classList.add('inputChange');
                    pInputLast.innerHTML = 'Отчество';
                    inputLastname.value = elem.lastName;
                    let buttonShowContacts = document.createElement('button');
                    buttonShowContacts.innerHTML = 'Показать контакты';
                    buttonShowContacts.classList.add('showButton');

                    //развернуть контакты
                    buttonShowContacts.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (show === false) {
                            show = true;
                            for (let contact of elem.contacts) {
                                let div = document.createElement('div');
                                div.classList.add('divShow');
                                let select = document.createElement('select');
                                let input = document.createElement('input');
                                let option = document.createElement('option');
                                option.innerHTML = contact.type;
                                input.type = contact.type;
                                input.value = contact.value;
                                input.addEventListener('input', function () {
                                    contact.value = input.value;
                                })
                                input.classList.add('inputSelect');
                                select.appendChild(option);
                                div.appendChild(select);
                                div.appendChild(input);
                                buttonAddContactsWrapper.appendChild(div);
                                const choices = new Choices(select, {
                                    searchEnabled: false,
                                    itemSelectText: '',
                                    shouldSort: false,
                                    position: 'bottom',
                                });
                                let inputButtonClose = document.createElement('button');
                                inputButtonClose.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
                                    <use xlink:href="img/sprite.svg#inputButtonClose"></use>
                                  </svg>`;
                                inputButtonClose.classList.add('inputButtonClose');
                                div.append(inputButtonClose);
                                inputButtonClose.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    div.remove();
                                    elem.contacts.pop(div);
                                })
                            }
                        }
                    });

                    let buttonAddContactsWrapper = document.createElement('div');
                    buttonAddContactsWrapper.classList.add('buttonAddContactsWrapper');
                    let buttonAddContacts = document.createElement('button');
                    buttonAddContacts.classList.add('buttonAddContacts');
                    buttonAddContacts.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
        <use xlink:href="img/sprite.svg#plus"></use>
      </svg>
        ` + 'Добавить контакт';
                    let buttonSaveClient = document.createElement('button');
                    buttonSaveClient.classList.add('buttonSaveClient');
                    buttonSaveClient.innerHTML = 'Сохранить';
                    let buttonDelСlient = document.createElement('button');
                    buttonDelСlient.classList.add('buttonDelСlient');
                    buttonDelСlient.innerHTML = 'Удалить клиента';

                    buttonDelСlient.addEventListener('click', async function (e) {
                        e.preventDefault();
                        await fetch(`http://localhost:3000/api/clients/${String(elem.id)}`, {
                            method: 'DELETE'
                        });
                        location.reload();
                    })

                    add.append(formChangeClient);
                    formChangeClient.appendChild(h2);
                    formChangeClient.appendChild(pInputSurn);
                    formChangeClient.appendChild(inputSurname);
                    formChangeClient.appendChild(pInputName);
                    formChangeClient.appendChild(inputName);
                    formChangeClient.appendChild(pInputLast);
                    formChangeClient.appendChild(inputLastname);
                    formChangeClient.appendChild(buttonShowContacts);
                    formChangeClient.appendChild(buttonAddContactsWrapper);
                    buttonAddContactsWrapper.appendChild(buttonAddContacts)
                    formChangeClient.appendChild(buttonSaveClient);
                    add.appendChild(buttonDelСlient);
                    formChangeClient.appendChild(buttonClose);

                    buttonAddContacts.addEventListener('click', function (e) {
                        console.log(document.querySelectorAll('.select__elem').length);
                        let p = document.createElement('p');
                        p.innerHTML = 'Вы добавили максиммальное количество контактов';
                        if (document.querySelectorAll('.select__elem').length >= 2) {
                            document.querySelector('#add').classList.add('scroll');
                        }
                        if (document.querySelectorAll('.select__elem').length === 7) {
                            p.classList.add('error');
                            add.appendChild(p);
                            buttonAddContacts.disabled = true;
                        }

                        e.preventDefault();
                        let div = document.createElement('div');
                        div.classList.add('select');
                        let select = document.createElement('select');
                        let optionEmp = document.createElement('option');
                        optionEmp.innerHTML = '';
                        let optionTel = document.createElement('option');
                        optionTel.value = 'tel';
                        optionTel.innerHTML = 'Телефон';
                        let optionTel2 = document.createElement('option');
                        optionTel2.value = 'tel';
                        optionTel2.innerHTML = 'Доп. телефон';
                        let optionEmail = document.createElement('option');
                        optionEmail.value = 'email';
                        optionEmail.innerHTML = 'Email';
                        let optionVk = document.createElement('option');
                        optionVk.value = 'vk';
                        optionVk.innerHTML = 'VK';
                        let optionFb = document.createElement('option');
                        optionFb.value = 'fb';
                        optionFb.innerHTML = 'Facebook';

                        let input = document.createElement('input');
                        input.classList.add('inputSelect');
                        input.placeholder = 'Введите данные контакта';

                        select.addEventListener('change', function () {
                            if (select.value === 'tel') {
                                input.classList.add('inputTel');
                                var im = new Inputmask("+7 (999) 999-99-99");
                                im.mask('.inputTel');
                                input.classList.remove('inputTel');
                            }
                            if (select.value === 'email') {
                                input.classList.add('inputEmail');
                                var im = new Inputmask("*{3,20}@*{3,20}.*{2,7}");
                                im.mask('.inputEmail')
                                input.classList.remove('inputEmail');
                            }
                            if (select.value === 'vk') {
                                input.classList.add('inputVk');
                                var im = new Inputmask("https://vk.com/*{2,20}");
                                im.mask('.inputVk')
                                input.classList.remove('inputVk');
                            }
                            if (select.value === 'fb') {
                                input.classList.add('inputFb');
                                var im = new Inputmask("https://www.facebook.com/*{2,30}");
                                im.mask('.inputFb')
                                input.classList.remove('inputFb');
                            }
                        })


                        let inputButtonClose = document.createElement('button');
                        inputButtonClose.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
                        <use xlink:href="img/sprite.svg#inputButtonClose"></use>
                      </svg>`;
                        inputButtonClose.classList.add('inputButtonClose');

                        buttonAddContactsWrapper.insertBefore(div, buttonAddContacts);
                        div.appendChild(select);
                        select.classList.add('select__elem');
                        select.setAttribute('name', 'select__elem');
                        div.appendChild(input);
                        div.appendChild(inputButtonClose);
                        select.appendChild(optionEmp);
                        select.appendChild(optionTel);
                        select.appendChild(optionTel2);
                        select.appendChild(optionEmail);
                        select.appendChild(optionVk);
                        select.appendChild(optionFb);

                        const elementAll = document.querySelectorAll('.select__elem');
                        for (let element of elementAll) {
                            const choices = new Choices(element, {
                                searchEnabled: false,
                                itemSelectText: '',
                                shouldSort: false,
                                position: 'bottom',
                            });
                        }

                        inputButtonClose.addEventListener('click', function (e) {
                            e.preventDefault();
                            div.remove();
                            elem.contacts.pop(div);
                            if(document.querySelectorAll('.select__elem').length < 7) {
                                buttonAddContacts.disabled = false;
                                document.querySelector('.error').remove()
                            }
                        })

                        function createContacts() {
                            let obj = {};
                            input.addEventListener('blur', function func() {
                                console.log(input.value.length);
                                if (input.value.length !== 0) {
                                    obj.type = (select.value);
                                    obj.value = (input.value)
                                } else {
                                    obj = {};
                                }
                            })
                            return obj;
                        }
                        elem.contacts.push(createContacts());

                    })

                    formChangeClient.addEventListener('click', async function (e) {
                        const validator = new JustValidate('.formChangeClient', {
                            errorFieldCssClass: 'is-invalid',
                            errorLabelStyle: {
                                fontSize: '16px',
                                color: 'red',
                            },
                        });

                        validator
                            .addField('.inputName', [
                                {
                                    rule: 'required',
                                    errorMessage: 'Введите имя',
                                },
                                {
                                    rule: 'minLength',
                                    value: 2,
                                    errorMessage: 'Имя слишком короткое',
                                },
                                {
                                    rule: 'customRegexp',
                                    value: /^[а-яёА-ЯЁ]+$/,
                                    errorMessage: 'Неверные символы в имени',
                                },
                            ])
                            .addField('.inputSurname', [
                                {
                                    rule: 'customRegexp',
                                    value: /^[а-яёА-ЯЁ]+$/,
                                    errorMessage: 'Неверные символы в фамилии',
                                },
                                {
                                    rule: 'required',
                                    errorMessage: 'Введите фамилию',
                                },
                                {
                                    rule: 'minLength',
                                    value: 2,
                                    errorMessage: 'Фамилия слишком короткая',
                                },
                            ]);

                        validator.onSuccess(async () => {
                            const response = await fetch(`http://localhost:3000/api/clients/${String(elem.id)}`, {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    name: inputName.value,
                                    surname: inputSurname.value,
                                    lastName: inputLastname.value,
                                    contacts: elem.contacts
                                }),
                            });
                        });
                    })
                })

                let tdActionsChangeDefaultSvg = `<svg width="16" height="16" viewbox="0 0 16 16">
                <use xlink:href="img/sprite.svg#pen"></use>
              </svg>`
                let tdActionsChangeActiveSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_224_2787)">
              <path d="M3.00008 8.04008C3.00008 10.8236 5.2566 13.0801 8.04008 13.0801C10.8236 13.0801 13.0801 10.8236 13.0801 8.04008C13.0801 5.2566 10.8236 3.00008 8.04008 3.00008C7.38922 3.00008 6.7672 3.12342 6.196 3.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
              </g>
              <defs>
              <clipPath id="clip0_224_2787">
              <rect width="16" height="16" fill="white"/>
              </clipPath>
              </defs>
              </svg>`;
                tdActionsChange.innerHTML = tdActionsChangeDefaultSvg + 'Изменить';
                function loadChange() {
                    tdActionsChange.innerHTML = tdActionsChangeActiveSvg + 'Изменить';
                }
                tdActionsChange.addEventListener('click', loadChange);
                tdActionsChange.classList.add('cursor');
                tdActionsChange.classList.add('tdActionsChange');
                let tdActionsDeleteDefaultSvg = `<svg width="16" height="16" viewbox="0 0 16 16">
                <use xlink:href="img/sprite.svg#del"></use>
              </svg>`;
                let tdActionsDeleteActiveSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_224_2792)">
              <path d="M3.00008 8.04008C3.00008 10.8236 5.2566 13.0801 8.04008 13.0801C10.8236 13.0801 13.0801 10.8236 13.0801 8.04008C13.0801 5.2566 10.8236 3.00008 8.04008 3.00008C7.38922 3.00008 6.7672 3.12342 6.196 3.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
              </g>
              <defs>
              <clipPath id="clip0_224_2792">
              <rect width="16" height="16" fill="white"/>
              </clipPath>
              </defs>
              </svg>
              `;
                tdActionsDelete.innerHTML = tdActionsDeleteDefaultSvg + 'Удалить';
                tdActionsDelete.addEventListener('click', () => {
                    tdActionsDelete.innerHTML = tdActionsDeleteActiveSvg + 'Удалить';
                });

                divActions.append(tdActionsChange);
                divActions.append(tdActionsDelete);
                tdActionsDelete.classList.add('cursor');
                tdActionsDelete.classList.add('tdActionsDelete');
                tr.appendChild(tdId);
                tr.appendChild(tdName);
                tr.appendChild(tdDateCreate);
                tr.appendChild(tdDateChange);
                tr.appendChild(tdContacts);
                tr.appendChild(divActions);
                divActions.classList.add('divActions');
                tbody.append(tr);

                //всплывающие подсказки контактов
                tippy('li', {
                    distance: 10,
                    arrow: true,
                    delay: 200
                });
            }
        }, 1000);
    }

    //добавить клиента
    buttonAddClient.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('.modal-container').classList.remove('hidden');
        document.querySelector('.modal-container').classList.add('active');

        //форма для добавления клиента
        let formNewClient = document.createElement('form');
        formNewClient.classList.add('formNewClient');
        formNewClient.style.position = 'relative';
        let h2 = document.createElement('h2');
        h2.classList.add('changeTitle');
        h2.innerHTML = 'Новый клиент';

        let inputSurname = document.createElement('input');
        inputSurname.placeholder = 'Фамилия*';
        inputSurname.classList.add('addPlaceholder');
        inputSurname.classList.add('inputSurname');
        inputSurname.type = "text";
        inputSurname.required = true;

        inputSurname.addEventListener('input', () => {
            checkInput(inputSurname)
        });

        let inputName = document.createElement('input');
        inputName.placeholder = 'Имя*';
        inputName.classList.add('addPlaceholder');
        inputName.classList.add('inputName');
        inputName.type = 'text';
        inputName.required = true;

        inputName.addEventListener('input', () => {
            checkInput(inputName)
        });

        let inputLastname = document.createElement('input');
        inputLastname.placeholder = 'Отчество';
        inputLastname.classList.add('addPlaceholder');
        inputLastname.classList.add('inputLastname');

        let buttonAddContacts = document.createElement('button');
        buttonAddContacts.classList.add('buttonAddContacts');
        buttonAddContacts.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
        <use xlink:href="img/sprite.svg#plus"></use>
      </svg>
        ` + 'Добавить контакт';

        let buttonAddContactsWrapper = document.createElement('div');
        buttonAddContactsWrapper.classList.add('buttonAddContactsWrapper');
        add.appendChild(formNewClient);

        let buttonSaveClient = document.createElement('button');
        buttonSaveClient.classList.add('buttonSaveClient');
        buttonSaveClient.innerHTML = 'Сохранить';
        buttonSaveClient.type = 'submit';

        let buttonDelСlient = document.createElement('button');
        buttonDelСlient.classList.add('buttonDelСlient');
        buttonDelСlient.innerHTML = 'Отмена';

        buttonDelСlient.addEventListener('click', function (e) {
            e.preventDefault();
            close();
        })

        formNewClient.appendChild(h2);
        formNewClient.appendChild(inputSurname);
        formNewClient.appendChild(inputName);
        formNewClient.appendChild(inputLastname);
        formNewClient.appendChild(buttonAddContactsWrapper);
        buttonAddContactsWrapper.appendChild(buttonAddContacts)
        formNewClient.appendChild(buttonSaveClient);
        formNewClient.appendChild(buttonDelСlient);
        formNewClient.appendChild(buttonClose);

        //добавление контактов
        buttonAddContacts.addEventListener('click', function (e) {
            let p = document.createElement('p');
            p.innerHTML = 'Вы добавили максиммальное количество контактов';
            if (document.querySelectorAll('.select__elem1').length >= 2) {
                document.querySelector('#add').classList.add('scroll');
            }
            if (document.querySelectorAll('.select__elem1').length === 7) {
                p.classList.add('error');
                formNewClient.insertBefore(p, buttonSaveClient);
                buttonAddContacts.disabled = true;
            }

            e.preventDefault();
            let div = document.createElement('div');
            div.classList.add('select');
            let select = document.createElement('select');
            let optionEmp = document.createElement('option');
            optionEmp.innerHTML = '';
            let optionTel = document.createElement('option');
            optionTel.value = 'tel';
            optionTel.innerHTML = 'Телефон';
            let optionTel2 = document.createElement('option');
            optionTel2.value = 'tel';
            optionTel2.innerHTML = 'Доп. телефон';
            let optionEmail = document.createElement('option');
            optionEmail.value = 'email';
            optionEmail.innerHTML = 'Email';
            let optionVk = document.createElement('option');
            optionVk.value = 'vk';
            optionVk.innerHTML = 'VK';
            let optionFb = document.createElement('option');
            optionFb.value = 'fb';
            optionFb.innerHTML = 'Facebook';
            let input = document.createElement('input');
            input.placeholder = 'Введите данные контакта';
            input.classList.add('inputSelect');

            let inputButtonClose = document.createElement('button');
            inputButtonClose.innerHTML = `<svg width="16" height="16" viewbox="0 0 16 16">
                        <use xlink:href="img/sprite.svg#inputButtonClose"></use>
                      </svg>`;
            inputButtonClose.classList.add('inputButtonClose');
            buttonAddContactsWrapper.insertBefore(div, buttonAddContacts);
            div.appendChild(select);
            select.classList.add('select__elem1');
            select.setAttribute('name', 'select__elem1');
            div.appendChild(input);
            div.appendChild(inputButtonClose);
            select.appendChild(optionEmp);
            select.appendChild(optionTel);
            select.appendChild(optionTel2);
            select.appendChild(optionEmail);
            select.appendChild(optionVk);
            select.appendChild(optionFb);
            select.classList.add('selectAddContacts')

            const elementAll2 = document.querySelectorAll('.select__elem1');
            for (let element of elementAll2) {
                const choices = new Choices(element, {
                    searchEnabled: false,
                    itemSelectText: '',
                    shouldSort: false,
                    position: 'bottom',
                });
            }

            select.addEventListener('change', function () {
                if (select.value === 'tel') {
                    input.classList.add('inputTel');
                    var im = new Inputmask("+7 (999) 999-99-99");
                    im.mask('.inputTel');
                    input.classList.remove('inputTel');
                }
                if (select.value === 'email') {
                    input.classList.add('inputEmail');
                    var im = new Inputmask("*{3,20}@*{3,20}.*{2,7}");
                    im.mask('.inputEmail')
                    input.classList.remove('inputEmail');
                }
                if (select.value === 'vk') {
                    input.classList.add('inputVk');
                    var im = new Inputmask("https://vk.com/*{2,20}");
                    im.mask('.inputVk')
                    input.classList.remove('inputVk');
                }
                if (select.value === 'fb') {
                    input.classList.add('inputFb');
                    var im = new Inputmask("https://www.facebook.com/*{2,30}");
                    im.mask('.inputFb')
                    input.classList.remove('inputFb');
                }
            })

            function createContacts() {
                let obj = {};
                input.addEventListener('blur', function func() {
                    console.log(input.value.length);
                    if (input.value.length !== 0) {
                        obj.type = (select.value);
                        obj.value = (input.value)
                    } else {
                        obj = {};
                    }
                })
                return obj;

            }
            contactsAll.push(createContacts());

            inputButtonClose.addEventListener('click', function (e) {
                e.preventDefault();
                div.remove();
                contactsAll.pop(div);
                if(document.querySelectorAll('.select__elem').length < 7) {
                    buttonAddContacts.disabled = false;
                    document.querySelector('.error').remove()
                }
            })
        })

        const validator = new JustValidate('.formNewClient', {
            errorFieldCssClass: 'is-invalid',
            errorLabelStyle: {
                fontSize: '16px',
                color: 'red',
            },
        })

        //Сохранить клиента
        formNewClient.addEventListener('click', async function (e) {
            validator
                .addField('.inputName', [
                    {
                        rule: 'required',
                        errorMessage: 'Введите имя',
                    },
                    {
                        rule: 'minLength',
                        value: 2,
                        errorMessage: 'Имя слишком короткое',
                    },
                    {
                        rule: 'customRegexp',
                        value: /^[а-яёА-ЯЁ]+$/,
                        errorMessage: 'Неверные символы в имени',
                    },
                ])
                .addField('.inputSurname', [
                    {
                        rule: 'customRegexp',
                        value: /^[а-яёА-ЯЁ]+$/,
                        errorMessage: 'Неверные символы в фамилии',
                    },
                    {
                        rule: 'required',
                        errorMessage: 'Введите фамилию',
                    },
                    {
                        rule: 'minLength',
                        value: 2,
                        errorMessage: 'Фамилия слишком короткая',
                    },
                ]);

            validator.onSuccess(async () => {
                const response = await fetch('http://localhost:3000/api/clients/', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: inputName.value,
                        surname: inputSurname.value,
                        lastName: inputLastname.value,
                        contacts: contactsAll
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
        })
    })

    // //Сортировка
    //ф-ция для сортировки
    function sort(arr, func) {
        let result = [...arr];
        for (let j = 0; j < result.length; j++) {
            for (let i = 0; i < result.length - 1; i++) {
                if (func(result[i], result[i + 1])) {
                    let temp = result[i];
                    result[i] = result[i + 1];
                    result[i + 1] = temp
                }
            }
        }
        return result;
    }

    buttonFilId.addEventListener('click', function () {
        let result = [];
        result = (sort(copyClients, function (A, B) {
            return A.id < B.id
        }))
        copyClients = result;
        render(copyClients);
    });


    buttonFilName.addEventListener('click', function () {
        let result = [];
        result = (sort(copyClients, function (A, B) {
            return A.surname > B.surname
        }))
        copyClients = result;
        render(copyClients);
    });

    buttonFilDateCreate.addEventListener('click', function () {
        let result = [];
        result = (sort(copyClients, function (A, B) {
            return A.createdAt < B.createdAt
        }))
        copyClients = result;
        render(copyClients);
    });

    buttonFilDateChange.addEventListener('click', function () {
        let result = [];
        result = (sort(copyClients, function (A, B) {
            return A.updatedAt < B.updatedAt
        }))
        copyClients = result;
        render(copyClients);
    });
    //end sort

    render(copyClients)
})();

