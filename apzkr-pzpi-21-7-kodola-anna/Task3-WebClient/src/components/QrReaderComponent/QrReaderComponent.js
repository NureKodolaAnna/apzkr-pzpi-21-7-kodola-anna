import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QrReaderComponent = ({ constraints = { facingMode: 'environment' } }) => {
    const [data, setData] = useState('No result');
    const navigate = useNavigate();

    const handleScan = async (result) => {
        if (result?.text) {
            setData(result.text);
            try {
                const response = await axios.get(result.text);
                const record = response.data;
                navigate(`/medical-record/${record._id}`);
            } catch (error) {
                console.error('Error fetching medical record:', error);
            }
        }
    };

    return (
        <div>
            <h2>Scan QR Code</h2>
            <QrReader
                onResult={handleScan}
                constraints={constraints}
                style={{ width: '100%' }}
            />
            <p>{data}</p>
        </div>
    );
};

export default QrReaderComponent;
