import React, { useRef, useEffect, useState } from 'react';

export default function Captcha({ setCaptchaValue, isFormSubmitting }) {
    const [captcha, setCaptcha] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        generateCaptcha();
    }, [isFormSubmitting]);

    const generateCaptcha = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.font = '30px Arial';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bgColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let text = '';
        for(let i = 0; i < 5; i++) {
            text += Math.random().toString(36).charAt(2);
        }
        setCaptcha(text);
        setCaptchaValue(text);

        for(let i = 0; i < text.length; i++) {
            ctx.save();
            ctx.translate(20 + i * 20, canvas.height / 2);
            ctx.rotate(Math.random() * 0.5 - 0.25);

            const textColor = getContrastColor(bgColor);
            ctx.fillStyle = textColor;
            ctx.fillText(text.charAt(i), -ctx.measureText(text.charAt(i)).width / 2, 0);
            ctx.restore();
        }
    };

    const getContrastColor = (hexColor) => {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };

    return (
        <div className={'captcha-control'}>
            <canvas ref={canvasRef} width={120} height={40} />
            <button type='button' onClick={generateCaptcha}>Обновить капчу</button>
        </div>
    );
}
