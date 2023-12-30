"use client"
import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
    partyId: string | null;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({partyId}) => {
    const data = `https://open.latindancers.app/party-playlist?id=${partyId}`;

    return (
            <QRCode size={280} value={data} />
    );
};

export default QRCodeGenerator;
