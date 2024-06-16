import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
    const { appointmentId } = useParams(); // Используем useParams для получения appointmentId из URL
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cardNumber || !cvv || !expiryDate) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await axios.post(`http://localhost:3000/api/appointments/pay/${appointmentId}`, {
                cardNumber,
                cvv,
                expiryDate,
            });

            setSuccess('Payment successful');
            setError(null);

            // Обновляем статус приема на "оплачен"
            await axios.put(`http://localhost:3000/api/appointments/update/${appointmentId}`, {
                status: 'paid',
            });

            // Перенаправляем пользователя на страницу истории приемов
            navigate('/appointment-history');
        } catch (error) {
            setError('Payment failed. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <div className="payment-container">
            <form className="payment-form" onSubmit={handleSubmit}>
                <h2>Payment</h2>
                <div className="form-group">
                    <label>Card Number</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>CVV</label>
                    <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                    />
                </div>
                <button type="submit">Pay</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default PaymentPage;
