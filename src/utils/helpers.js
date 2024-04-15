import serverUrl from './config'

export const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} в ${hours}:${minutes}`;
};

export function validateForm(formData) {
    let error = false;
    let message = '';

    if (!formData.name.trim() || !formData.email.trim() || !formData.text.trim()) {
        error = true;
        message = 'Пожалуйста, заполните все поля.';
    } else if (!isValidEmail(formData.email)) {
        error = true;
        message = 'Пожалуйста, введите правильный почтовый ящик.';
    } else if (!isValidName(formData.name)) {
        error = true;
        message = 'Пожалуйста, введите правильное имя(только буквы и цифры)';
    } else if (!isValidText(formData.text)) {
        error = true;
        message = 'HTML-теги в тексте не допускаются.';
    } else if (formData.text.length > 1000) {
        error = true;
        message = 'Текст слишком большой! (макс. 1000)';
    }
    return { error, message };
}

function isValidEmail(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    return nameRegex.test(name);
}

function isValidText(text) {
    const allowedTags = ['strong', 'a', 'i', 'code'];
    const tagRegex = /<\/?(\w+)[^>]*>/g;
    const matches = text.match(tagRegex);
    if (!matches) return true;
    const stack = [];
    for (const match of matches) {
        const tagNameMatch = /<\/?(\w+)/.exec(match);
        if (!tagNameMatch) continue;
        const tagName = tagNameMatch[1];
        if (allowedTags.includes(tagName)) {
            if (match.startsWith('</')) {
                if (stack.length === 0 || stack.pop() !== tagName) return false;
            } else {
                stack.push(tagName);
            }
        } else {
            return false;
        }
    }
    return stack.length === 0;
}




export async function sendFormData(formData, parentId, setFormData) {
    const validationResult = validateForm(formData);
    if (validationResult.error) {
        throw new Error(validationResult.message);
    }

    try {
        const response = await fetch(`${serverUrl}api/comments/create`, {
            method: 'POST',
            body: createFormData(formData)
        });

        if (!response.ok) {
            throw new Error('Ошибка в создании комментария');
        }

        const data = await response.json();

        setFormData({
            name: '',
            email: '',
            text: '',
            parent_id: parentId || '',
            file: null
        });
    } catch (error) {
        throw new Error('Ошибка отправки формы: ' + error.message);
    }
}

function createFormData(formData) {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('text', formData.text);
    formDataToSend.append('parent_id', formData.parent_id);

    if (formData.file) {
        formDataToSend.append('file', formData.file);
    }

    return formDataToSend;
}


export function handleFileInputChange(event, formData, setFormData) {
    const file = event.target.files[0];

    if (!file) {
        setFormData(prevData => ({
            ...prevData,
            file: null,
        }));
        return;
    }

    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'text/plain'];

    if (!allowedFormats.includes(file.type)) {
        alert('Недоступный формат файла. Доступные: JPG, PNG, GIF, TXT.');
        return;
    }

    if (file.type.startsWith('image/') && file.size > 0) {
        if (file.size > 1000000) {
            alert('Файл больше чем 1 МБ');
            return;
        }

        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
            const maxWidth = 320;
            const maxHeight = 240;
            let width = image.width;
            let height = image.height;

            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;

                if (width > maxWidth) {
                    width = maxWidth;
                    height = width / aspectRatio;
                }

                if (height > maxHeight) {
                    height = maxHeight;
                    width = height * aspectRatio;
                }
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob(blob => {
                setFormData(prevData => ({
                    ...prevData,
                    file: new File([blob], file.name, { type: file.type }),
                }));
            }, file.type);
        };
    } else if (file.type === 'text/plain' && file.size > 0 && file.size <= 100000) {
        setFormData(prevData => ({
            ...prevData,
            file: file,
        }));
    } else {
        alert('Недоступный формат или размер файла');
    }
}

