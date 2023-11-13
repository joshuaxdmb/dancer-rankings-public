import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
    partyId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({partyId}) => {
    const data = `LatinDancersApp:Party:${partyId}`;

    return (
        <div>
            <QRCode value={data} />
        </div>
    );
};

export default QRCodeGenerator;
