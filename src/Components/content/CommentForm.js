import React, { useState } from 'react';
import TagButton from './TagButton';
import { validateForm, sendFormData, handleFileInputChange } from '../../utils/helpers';
import Loading from "./Loading";
import Captcha from "./Captcha";

export default function CommentForm({ parentId, setComments }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        text: '',
        file: null,
        parent_id: parentId || '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if (name === 'text') {
            updatePreview(value);
        }
    };

    const updatePreview = (text) => {
        const previewComment = {
            id: 'preview',
            text: text,
            username: 'Preview',
            date: '0',
            children: []
        };
        setComments(prevComments => {
            let updatedComments = [...prevComments];
            const parentComment = updatedComments.find(comment => comment.id == parentId);
            if (parentComment) {
                if (!parentComment.children) {
                    parentComment.children = [];
                }
                const existingPreviewChildIndex = parentComment.children.findIndex(child => child.id === 'preview');
                if (existingPreviewChildIndex === -1) {
                    parentComment.children = [previewComment, ...parentComment.children];
                } else {
                    parentComment.children[existingPreviewChildIndex] = previewComment;
                }
            }
            return updatedComments;
        });
    };

    const handleFileChange = (event) => {
        handleFileInputChange(event, formData, setFormData);
    };

    const handleButtonClicked = (value) => {
        setFormData(prevData => ({
            ...prevData,
            text: prevData.text + value
        }));
        updatePreview(formData.text + value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsShow(true);
        setIsFormSubmitting(true);

        const validationResult = validateForm(formData);
        if (validationResult.error || formData.captcha !== captchaValue) {
            setErrorMessage(validationResult.message || 'Неправильная капча.');
            setIsFormSubmitting(false);
            setIsShow(false);
            return;
        }

        try {
            await sendFormData(formData, parentId, setFormData);
            setIsShow(false);
            if (window.location.pathname.includes('/create')) {
                window.location.replace('/');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form id="commentForm" onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} required placeholder="Имя" onChange={handleInputChange} />
            <input type="email" name="email" value={formData.email} required placeholder="Почтовый ящик" onChange={handleInputChange} />
            <textarea name="text" id="text" value={formData.text} onChange={handleInputChange} rows="4" required></textarea>

            <div className="buttons">
                <TagButton handleClick={handleButtonClicked} value="<strong></strong>">Strong</TagButton>
                <TagButton handleClick={handleButtonClicked} value="<a href='' title=''></a>">Link</TagButton>
                <TagButton handleClick={handleButtonClicked} value="<code></code>">Code</TagButton>
                <TagButton handleClick={handleButtonClicked} value="<i></i>">I</TagButton>
            </div>

            <input type="file" name="file" onChange={handleFileChange} accept="image/*,.txt" />
            <input type="hidden" name="parent_id" value={parentId} />

            <Captcha setCaptchaValue={setCaptchaValue} isFormSubmitting={isFormSubmitting}/>
            <input type="text" name="captcha" value={formData.captcha} required placeholder="Введите капчу" onChange={handleInputChange} />
            <button type="submit">Добавить комментарий</button>
            <Loading isShow={isShow} />

            <div className="error-message">{errorMessage}</div>
        </form>
    );
}
